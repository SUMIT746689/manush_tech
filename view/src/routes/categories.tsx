
import { PageHeaderWrapper } from "@/components/PageHeaderWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import CreateOrUpdateData from "@/content/categories/CreateOrUpdateData";
import ShowData from "@/content/categories/ShowData";
import { Category } from "@/types/category";
import { useState } from "react";


export default function Categories() {

  const [editCategory, setEditCategory] = useState<Category | null>();

  const addEditCategory = (user: Category | null): void => {
    setEditCategory(() => user)
  }

  return (
    <>
      <PageHeaderWrapper name="Food Categories">
        <CreateOrUpdateData editData={editCategory} addEditCategory={addEditCategory} />
      </PageHeaderWrapper>

      <div className="px-6 py-3 w-full min-h-fit">
        <PermissionVerify havePermission="ADMIN">
          <ShowData addEditData={addEditCategory} />
        </PermissionVerify>
      </div>
    </>
  )
}


