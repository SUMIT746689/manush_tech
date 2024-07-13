import { Button, Group } from "@mantine/core";
import React, { useState } from "react";
import { PermissionVerify } from "@/components/PermissionVerify";
import { Category } from "@/types/category";
import CreateOrUpdateCategory from "./CreateOrUpdateCategory";

interface CreateOrUpdateDataInterFace {
  editData: Category | null | undefined;
  addEditCategory: (arg: null) => void;
}

const CreateOrUpdateData: React.FC<CreateOrUpdateDataInterFace> = ({ editData, addEditCategory }) => {

  const [open, setOpen] = useState<boolean>(false);
  const [create, setCreate] = useState<string | null>(null);

  // useEffect(() => {
  //   if (editData) setOpen(true);
  // }, [editData]);

  const handleCreate = (value: string) => {
    console.log({ value })
    setCreate(value)
    setOpen(true)
  }

  const handleOpen = (value: boolean) => {
    setOpen(value)
  }

  return (
    <>
      <Group position="center" pr={20} py={4} >
        <PermissionVerify havePermission="ADMIN">
          {/* <SecondNavbarWrapper /> */}
          <Button.Group sx={{ gap: 1, display: "flex" }}>
            <Button onClick={() => handleCreate("category")} className=" bg-orange-600 hover:bg-orange-700 w-52"> Create Category</Button>
          </Button.Group>
        </PermissionVerify>
      </Group>

      {
        create === "category" && <CreateOrUpdateCategory open={open} handleOpen={handleOpen} editData={editData} addEditCategory={addEditCategory} />
      }
      
    </>
  )
}



export default CreateOrUpdateData;