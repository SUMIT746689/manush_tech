import { FormSubmitButtonWrapper } from "@/components/ButtonWrapper";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/redux/services/category";
import { Category, CreateCategory } from "@/types/category";
import { Box, LoadingOverlay, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";


interface CreateOrUpdateCategoryInterFace {
  editData: Category | null | undefined;
  addEditCategory: (arg: null) => void;
  open: boolean;
  handleOpen: (arg: boolean) => void;
}

interface FormInterface {
  editData: Category | undefined | null;
  handleModalClose: () => void;
}

const CreateOrUpdateCategory: React.FC<CreateOrUpdateCategoryInterFace> = ({open,handleOpen, editData, addEditCategory }) => {


  useEffect(() => {
    if (editData) handleOpen(true);
  }, [editData]);

  const handleModalClose = () => {
    handleOpen(false);
    addEditCategory(null);
  }



  return (
    <>
      <Modal opened={open} onClose={handleModalClose} title="Category" centered>
        {/* Modal content */}
        <Form editData={editData} handleModalClose={handleModalClose} />
      </Modal>
    </>
  )
}

const Form: React.FC<FormInterface> = ({ editData, handleModalClose }) => {
  const [createCategory, { isLoading: isCreateLoading }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdateLoading }] = useUpdateCategoryMutation()


  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (value ? null : 'Type your category name'),
    },
  });

  useEffect(() => {
    if (editData) {
      form.setValues((prev) => ({ ...prev, ...editData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = (values: CreateCategory): void => {

    if (editData) {
      updateCategory({ id: editData.id, body: values })
        .unwrap()
        .then(() => {
          notifications.show({ message: 'Sucessfully Updated' });
          handleModalClose();
        })
        .catch((error: { data: string }) => { notifications.show({ message: error.data, color: 'red' }) })
    }
    else {
      createCategory(values).unwrap()
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
      <form onSubmit={form.onSubmit((values: CreateCategory): void => handleFormSubmit(values))} >


        <TextInput
          withAsterisk
          label="name"
          placeholder="type category name..."
          {...form.getInputProps('name')}
        />

        <FormSubmitButtonWrapper>
          Submit
        </FormSubmitButtonWrapper>
      </form>
    </Box>
  );
}

export default CreateOrUpdateCategory;