import PaginationWithPageSizeSelectorWrapper from "@/components/PaginationWithPageSizeSelectorWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import { handleNotification } from "@/lib/handleNotification";
import { useDeleteBrandMutation, useGetAllBrandQuery } from "@/redux/services/meal_week_days";
import { Brand } from "@/types/week_day";
import { ActionIcon, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React from "react";


interface ShowDataInterface {
  addEditData: (arg: Brand) => void;
}

const ShowData: React.FC<ShowDataInterface> = ({ addEditData }) => {

  const { data: brands } = useGetAllBrandQuery();

  const [deleteBrand] = useDeleteBrandMutation();

  const handleDelete = (id: number): void => {
    deleteBrand(id).unwrap()
      .then(() => { notifications.show({ message: 'meal week day deleted successfully', }) })
      .catch((error: { message: string }) => handleNotification(notifications, error))
  }

  return (
    <>
      <PaginationWithPageSizeSelectorWrapper
        headColumns={[
          { accessor: 'id', width: 100 },
          { accessor: 'day' },
          // { accessor: 'create_time', },
          // { accessor: 'update_time' },
          {
            accessor: 'actions',
            title: <Text mr="xs">actions</Text>,
            textAlignment: 'right',
            render: (data: Brand) => (
              <Group spacing={4} position="right" noWrap>
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
        // @ts-ignore
        datas={brands?.data || []}
      />
    </>
  )
}

export default ShowData;