import { Box, Button, Group, LoadingOverlay, Modal, Select } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useForm } from '@mantine/form';
import { notifications } from "@mantine/notifications";
import { FormSubmitButtonWrapper } from "@/components/ButtonWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import { Brand, CreateBrand } from "@/types/week_day";
import { useCreateBrandMutation, useUpdateBrandMutation } from "@/redux/services/meal_week_days";
import { handleNotification } from "@/lib/handleNotification";

interface CreateOrUpdateDataInterFace {
  editData: Brand | null | undefined;
  addEditBrand: (arg: null) => void;
}

interface FormInterface {
  editData: Brand | undefined | null;
  handleModalClose: () => void;
}

const weekDays = ['SATERDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

const CreateOrUpdateData: React.FC<CreateOrUpdateDataInterFace> = ({ editData, addEditBrand }) => {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editData) setOpen(true);
  }, [editData]);

  const handleModalClose = () => {
    setOpen(false);
    addEditBrand(null);
  }

  return (
    <>
      <Modal opened={open} onClose={handleModalClose} title="Meal Week Day" centered>
        {/* Modal content */}
        <Form editData={editData} handleModalClose={handleModalClose} />
      </Modal>

      <Group position="center" pr={20} >
        <PermissionVerify havePermission="ADMIN">
          <Button onClick={() => { setOpen(true) }} className=" bg-orange-600 hover:bg-orange-700"> Create Meal Week Day</Button>
        </PermissionVerify>
      </Group>
    </>
  )
}

const Form: React.FC<FormInterface> = ({ editData, handleModalClose }) => {
  const [createUser, { isLoading: isCreateLoading }] = useCreateBrandMutation()
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateBrandMutation()


  const form = useForm({
    initialValues: {
      day: "",
    },
    validate: {
      day: (value) => (weekDays.includes(value) ? null : 'select a week day'),
    },
  });

  useEffect(() => {
    if (editData) {
      form.setValues((prev) => ({ ...prev, ...editData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = (values: CreateBrand): void => {

    if (editData) {
      updateUser({ id: editData.id, body: values })
        .unwrap()
        .then(() => {
          notifications.show({ message: 'Sucessfully Updated' });
          handleModalClose();
        })
        .catch((error: { data: string }) => handleNotification(notifications, error))
    }
    else {
      createUser(values).unwrap()
        .then(() => {
          notifications.show({ message: 'Sucessfully Created' });
          handleModalClose();
        })
        .catch((error: { data: { message: string } }) => handleNotification(notifications, error))
      // .catch((error: { data: string }) => { notifications.show({ message: error.data, color: 'red' }) })

    }
  }

  return (
    <Box maw={500} mx="auto" pos="relative" px={40}>
      <LoadingOverlay visible={isCreateLoading || isUpdateLoading} overlayBlur={2} />
      {/* @ts-ignore */}
      <form onSubmit={form.onSubmit((values: CreateBrand): void => handleFormSubmit(values))} >

        <Select
          withAsterisk
          label="Select Day"
          placeholder="select a day..."
          {...form.getInputProps('day')}
          // sx={{"::selection":{backgroundColor:'orange'}}}
          data={weekDays}
          searchable
        />

        <FormSubmitButtonWrapper>
          Submit
        </FormSubmitButtonWrapper>
      </form>
    </Box>
  );
}

export default CreateOrUpdateData;