
import { PageHeaderWrapper } from "@/components/PageHeaderWrapper";
import { PermissionVerify } from "@/components/PermissionVerify";
import CreateOrUpdateData from "@/content/meal_week_days/CreateOrUpdateData";
import ShowData from "@/content/meal_week_days/ShowData";
import { Brand } from "@/types/week_day";
import { useState } from "react";


export default function Brands() {

  const [editBrand, setEditBrand] = useState<Brand | null>();

  const addEditBrand = (user: Brand | null): void => {
    setEditBrand(() => user)
  }

  return (
    <>
      <PageHeaderWrapper name="Meal WeekDays">
        <CreateOrUpdateData editData={editBrand} addEditBrand={addEditBrand} />
      </PageHeaderWrapper>

      <div className="px-6 py-3 w-full min-h-fit">
        <PermissionVerify havePermission="ADMIN">
          <ShowData addEditData={addEditBrand} />
        </PermissionVerify>
      </div>
    </>
  )
}


