
import { PageHeaderWrapper } from "@/components/PageHeaderWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import CreateOrUpdateData from "@/content/food_items/CreateOrUpdateData";
import ShowData from "@/content/food_items/ShowData";
import { FoodItem } from "@/types/food_item";
import { useState } from "react";


export default function MeasurementUnits() {

  const [editAttribute, setEditAttribute] = useState<FoodItem | null>();

  const addEditAttribute= (user: FoodItem | null): void => {
    setEditAttribute(() => user)
  }

  return (
    <>
      <PageHeaderWrapper name="Food Items">
        <CreateOrUpdateData editData={editAttribute} setEditData={addEditAttribute} />
      </PageHeaderWrapper>

      <div className="px-6 py-3 w-full min-h-fit">
        <PermissionVerify havePermission="ADMIN">
          <ShowData addEditData={addEditAttribute} />
        </PermissionVerify>
      </div>
    </>
  )
}


