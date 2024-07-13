import PaginationWithPageSizeSelectorWrapper from "@/components/PaginationWithPageSizeSelectorWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import { useDeleteFoodItemMutation, useGetAllFoodItemQuery } from "@/redux/services/food_items";
import { FoodItem } from "@/types/food_item";
import { ActionIcon, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React from "react";


interface ShowDataInterface {
  // setEditUser: React.Component<User,User>
  // setEditUser: any;
  addEditData: (arg: FoodItem) => void;
}

const ShowData: React.FC<ShowDataInterface> = ({ addEditData }) => {

  const { data: users } = useGetAllFoodItemQuery();

  const [deleteUser] = useDeleteFoodItemMutation();

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
            { accessor: 'name',render: (data: FoodItem) => (<> {data.name} {data?.foodCategory && `( ${data?.foodCategory?.name} )`}</>) },
            // { accessor: 'role.title' },
            // { accessor: 'phone_number' },
            {
              accessor: 'actions',
              width:100,
              title: <Text mr="xs">Actions</Text>,
              textAlignment: 'center',
              render: (data: FoodItem) => (
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
          datas={users?.data || []}
        />
    </>
  )
}

export default ShowData;