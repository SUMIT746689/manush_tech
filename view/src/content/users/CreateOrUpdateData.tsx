import { Box, Button, Grid, Group, LoadingOverlay, Modal, PasswordInput, Select, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useForm } from '@mantine/form';
import { useCreateUserMutation, useUpdateUserMutation } from "@/redux/services/user";
import { User } from "@/types/users";
// import { AuthUser } from "@/types/auth";
import { notifications } from "@mantine/notifications";
import { FormSubmitButtonWrapper } from "@/components/ButtonWrapper";

interface CreateOrUpdateDataInterFace {
  editData: User | null | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setEditData: Function;
  // authUser: AuthUser | undefined;
}

interface CreateOrUpdateFormInterFace {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  role: string;
}

const CreateOrUpdateData: React.FC<CreateOrUpdateDataInterFace> = ({ editData, setEditData }) => {


  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (editData) setOpen(true);
  }, [editData]);

  const handleModalClose = () => {
    setOpen(false);
    setEditData(undefined)
  }
  return (
    <>
      <Modal opened={open} onClose={handleModalClose} title="User" centered>
        {/* Modal content */}
        {/* <PermissionVerify havePermission="create_user" > */}
        <Form editData={editData} handleModalClose={handleModalClose} />
        {/* </PermissionVerify> */}
      </Modal>

      <Group position="center" pr={20} >
        <Button onClick={() => { setOpen(true) }} className=" bg-orange-600 hover:bg-orange-700"> Create User</Button>
      </Group>
    </>
  )
}

interface FormInterface {
  editData: User | undefined | null;
  handleModalClose: () => void;
}

const Form: React.FC<FormInterface> = ({ editData, handleModalClose }) => {
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateUserMutation()

  const form = useForm({
    initialValues: {
      fullName: '',
      phone_number: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      role: '',
      // company_id: '',
      // termsOfService: false,
    },
    validate: {
      fullName: (value) => (value ? null : 'Type your name'),
      email: (value) => (!value || /^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      username: (value) => (value ? null : 'Provide username'),
      password: (value) => (editData || /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) ? null : 'Minimum eight characters, at least one letter and one number'),
      confirm_password: (value, values) => ((value === values.password) ? null : 'Password did not match'),
      role: (value) => (['ADMIN', 'GENERAL'].includes(value) ? null : 'Select a role'),
    },
  });

  console.log({ value: form.values, error: form.errors })

  useEffect(() => {
    if (editData) {
      form.setValues((prev) => ({ ...prev, ...editData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = (values: CreateOrUpdateFormInterFace): void => {
    console.log({ values })
    // const customizeValues = { ...values, role_id: Number(values.role_id), company_id: Number(values.company_id) }
    if (editData) {
      // @ts-ignore
      updateUser({ user_id: editData.id, body: values })
        .unwrap()
        .then(() => {
          notifications.show({ message: 'Sucessfully Updated' });
          handleModalClose();
        })
        .catch((error: { data: string }) => { notifications.show({ message: error.data, color: 'red' }) })
    }
    else {
      // @ts-ignore
      createUser(values).unwrap()
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

        <Grid grow gutter="xs">
          <Grid.Col span={4}>
            <TextInput
              withAsterisk
              label="Name"
              placeholder="your first name..."
              {...form.getInputProps('fullName')}
            />
          </Grid.Col>
        </Grid>

        <TextInput
          withAsterisk
          label="Username"
          placeholder="your username..."
          autoComplete="new-username"
          {...form.getInputProps('username')}
        />
        <TextInput
          // withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <Select
          withAsterisk
          label="Select Role"
          placeholder="Select Role"
          {...form.getInputProps('role')}
          // sx={{"::selection":{backgroundColor:'orange'}}}
          data={
            ["ADMIN", "GENERAL"]?.map((value: string) => ({ value: value, label: value }))
          }
        />

        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="your password..."
          autoComplete="new-password"
          {...form.getInputProps('password')}
        />
        <PasswordInput
          withAsterisk
          label="Confirm Password"
          placeholder="your confirm password..."
          {...form.getInputProps('confirm_password')}
        />

        <FormSubmitButtonWrapper>
          Submit
        </FormSubmitButtonWrapper>
      </form>
    </Box>
  );
}

export default CreateOrUpdateData;