
import { PageHeaderWrapper } from "@/components/PageHeaderWrapper";
import CreateOrUpdateData from "@/content/users/CreateOrUpdateData";
import ShowData from "@/content/users/ShowData";
import { User } from "@/types/users";
import { useState } from "react";


export default function UserIndex() {

  const [editUser, setEditUser] = useState<User>();

  const addEditUser = (user: User): void => {
    setEditUser(() => user)
  }

  return (
    <>
      <PageHeaderWrapper name="Users">
        <CreateOrUpdateData editData={editUser} setEditData={setEditUser} />
      </PageHeaderWrapper>

      <div className="px-6 py-3 w-full min-h-fit">
        <ShowData addEditData={addEditUser} />
      </div>
    </>
  )
}


