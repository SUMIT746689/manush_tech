import { useLogoutUserMutation } from "@/redux/services/auth"
// import { store } from "@/redux/store"
// import { store } from "@/redux/store"
import {
  Avatar, Code, Group, Tooltip,
  // rem
} from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"
// import { Logo } from "./Logo"

const NavHeader = () => {
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandle = () => {
    // document.cookie = `Authorization=`
    logoutUser().unwrap().finally(() => {
      
      navigate("/login")
      location.replace("/login");
      // store.dispatch(userApi.usePrefetch().)
    })
    // navigate({to:"/login",replace:true}) 
    // return null
  }
  return (
    <>
      <Group position="apart">
        {/* <Logo clipRule="white" width={rem(120)} /> */}
        <Avatar color="orange" w={100} radius="md"><span className=" text-red-700" >Office Meal</span></Avatar>
        <Code sx={{ fontWeight: 700 }}>v.1</Code>

        <Tooltip onClick={logoutHandle} label="Log out">
          <Avatar color="orange" translate="yes" sx={{ transition: "all", ":hover": { cursor: "pointer", scale: 1.5 } }}>
            <IconLogout />
          </Avatar>
        </Tooltip>
      </Group>
    </>
  )
}

export default NavHeader