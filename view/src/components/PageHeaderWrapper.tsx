import { Header, Text } from "@mantine/core"
import React from "react"

interface PageHeaderWrapper {
  name: string;
  children?: React.ReactElement;
}

const PageHeaderWrapper: React.FC<PageHeaderWrapper> = ({ name, children }) => {

  return (
    <Header height={64} display="flex" sx={{ justifyContent: 'space-between' }}>
      <Text pt={18} pl={18} size={"lg"} weight={600} color="orange">{name}</Text>
      {/* <CreateOrUpdateData editData={editUser} setEditData={setEditUser} /> */}
      {children}
    </Header>
  )
}

export { PageHeaderWrapper }