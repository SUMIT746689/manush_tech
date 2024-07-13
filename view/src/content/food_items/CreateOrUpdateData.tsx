import { Box, Button, Group, LoadingOverlay, Modal, Select, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useForm } from '@mantine/form';
import { notifications } from "@mantine/notifications";
import { FormSubmitButtonWrapper } from "@/components/ButtonWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import { useGetAllCategoryQuery } from "@/redux/services/category";
import { useCreateFoodItemMutation, useUpdateFoodItemMutation } from "@/redux/services/food_items";
import { Category } from "@/types/category";
import { FoodItem } from "@/types/food_item";

interface CreateOrUpdateDataInterFace {
  editData: FoodItem | null | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setEditData: Function;
  // authUser: AuthUser | undefined;
}

interface CreateOrUpdateFormInterFace {
  name: string;
  foodCategoryId?: string | null;
}

const CreateOrUpdateData: React.FC<CreateOrUpdateDataInterFace> = ({ editData, setEditData }) => {


  const [open, setOpen] = useState(false);
  const { data: foodCategories } = useGetAllCategoryQuery('');
  useEffect(() => {
    if (editData) setOpen(true);
  }, [editData]);

  const handleModalClose = () => {
    setOpen(false);
    setEditData(null)
  }
  return (
    <>
      <Modal opened={open} onClose={handleModalClose} title="User" centered>
        {/* Modal content */}
        <PermissionVerify havePermission="ADMIN" >
          <Form editData={editData} handleModalClose={handleModalClose} foodCategories={foodCategories?.data || []} />
        </PermissionVerify>
      </Modal>

      <Group position="center" pr={20} >
        <Button onClick={() => { setOpen(true) }} className=" bg-orange-600 hover:bg-orange-700"> Create User</Button>
      </Group>
    </>
  )
}

interface FormInterface {
  editData: FoodItem | undefined | null;
  handleModalClose: () => void;
  foodCategories: Category[] | [];
}

const Form: React.FC<FormInterface> = ({ editData, handleModalClose, foodCategories }) => {
  const [createUser, { isLoading: isCreateLoading }] = useCreateFoodItemMutation()
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateFoodItemMutation()

  const form = useForm({
    initialValues: {
      name: '',
      foodCategoryId: null,
    },
    validate: {
      name: (value) => (value ? null : 'Type food item name'),
      // role_id: (value) => (/^\d+$/.test(value) ? null : 'Select a role'),
      // company_id: (value) => (companies.length === 0 || (/^\d+$/.test(value)) ? null : 'Select a company'),
    },
  });

  useEffect(() => {
    if (editData) {
      // @ts-ignore
      form.setValues((prev) => ({ ...prev, ...editData, foodCategoryId: String(editData.foodCategoryId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = (values: CreateOrUpdateFormInterFace): void => {
    console.log({ values })
    const customizeValues = { name: values.name };
    // @ts-ignore
    if (values.foodCategoryId) customizeValues['foodCategoryId'] = Number(values.foodCategoryId);

    if (editData) {
      updateUser({ id: editData.id, body: customizeValues })
        .unwrap()
        .then(() => {
          notifications.show({ message: 'Sucessfully Updated' });
          handleModalClose();
        })
        .catch((error: { data: string }) => { notifications.show({ message: error.data, color: 'red' }) })
    }
    else {
      createUser(customizeValues).unwrap()
        .then(() => {
          notifications.show({ message: 'Sucessfully Created' });
          handleModalClose();
        })
        .catch((error: { data: string }) => { notifications.show({ message: error.data, color: 'red' }) })
    }
  }

  return (
    <Box maw={500} mx="auto" pos="relative" px={40}>
      <LoadingOverlay visible={isCreateLoading || isUpdateLoading} overlayBlur={2} />
      <form onSubmit={form.onSubmit((values: CreateOrUpdateFormInterFace): void => handleFormSubmit(values))} >

        <TextInput
          withAsterisk
          type="name"
          label="food item name"
          placeholder="type food item name..."
          {...form.getInputProps('name')}
        />

        <Select
          // withAsterisk
          label="Select Food Category"
          placeholder="Select a food category"
          {...form.getInputProps('foodCategoryId')}
          // sx={{"::selection":{backgroundColor:'orange'}}}
          data={
            foodCategories ? foodCategories?.map(({ id, name }: { id: number, name: string }) => ({ value: String(id), label: name })) : []

          }
        />

        <FormSubmitButtonWrapper>
          Submit
        </FormSubmitButtonWrapper>
      </form>
    </Box>
  );
}

export default CreateOrUpdateData;