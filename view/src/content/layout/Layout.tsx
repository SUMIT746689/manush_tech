import { Outlet, redirect } from "react-router-dom";
import { NavbarNested } from "./nav/Navbar";
import { Flex } from '@mantine/core';
import { ofetch } from "@/lib/ofetch";

export default function MainLayout() {
  return (
    <>
      {/* <AppShell
        navbar={<NavbarNested />}
        header={<Header><Head/></Header>}
      >
        <Outlet />
      </AppShell> */}
      <Flex sx={{ backgroundColor: 'orange.1' }} >
        <NavbarNested />
        <div className=" bg-gray-200 bg-opacity-50 w-full h-screen overflow-auto">
          <Outlet />
        </div>
      </Flex>
    </>
  )
}


// export const LayoutRouteAction = async ({ request }: any) => {
//   console.log("yes");

//   try {
//     await ofetch("/logout", { method: "post" })
//     document.cookie = "Authorization="
//     return redirect("/login")

//   }
//   catch (err) {
//     console.log({ err });
//   }

//   return null
// }
