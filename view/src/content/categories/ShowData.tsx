import PaginationWithPageSizeSelectorWrapper from "@/components/PaginationWithPageSizeSelectorWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import { useDeleteCategoryMutation, useGetAllCategoryQuery } from "@/redux/services/category";
import { Category } from "@/types/category";
import { ActionIcon, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React from "react";


interface ShowDataInterface {
  addEditData: (arg: Category) => void;
}

const ShowData: React.FC<ShowDataInterface> = ({ addEditData }) => {

  const { data: categories } = useGetAllCategoryQuery("");

  const [deleteUser] = useDeleteCategoryMutation();

  const handleDelete = (id: number): void => {
    deleteUser(id).unwrap()
      .then(() => { notifications.show({ message: 'deleted successfully', }) })
      .catch((error: { message: string }) => { notifications.show({ message: error.message, color: 'red' }) })
  }

  return (
    <>
      <PaginationWithPageSizeSelectorWrapper
        headColumns={[
          { accessor: 'id', width: 100 },
          { accessor: 'name' },
          // { accessor: 'create_time', },
          // { accessor: 'update_time' },
          {
            accessor: 'actions',
            width:100,
            title: <Text mr="xs">actions</Text>,
            textAlignment: 'center',
            render: (data: Category) => (
              <Group spacing={4} position="center" noWrap>
                <PermissionVerify havePermission="ADMIN">
                  <ActionIcon color="sky" onClick={() => addEditData(data)}>
                    <IconEdit size={20} />
                  </ActionIcon>
                </PermissionVerify>

                <PermissionVerify havePermission="ADMIN">
                  <ActionIcon color="red" onClick={() => handleDelete(data.id)}>
                    <IconTrash size={20} />
                  </ActionIcon>
                </PermissionVerify>
              </Group>
            ),
          },
        ]}
        datas={categories?.data || []}
      />
    </>
  )
}

export default ShowData;