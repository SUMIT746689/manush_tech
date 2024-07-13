import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthUserQuery, useLoginUserMutation } from "@/redux/services/auth";
import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React from "react";
import { Form, useNavigate } from "react-router-dom";


interface FormElements extends HTMLInputElement {
  username: HTMLInputElement;
  password: HTMLInputElement;
}


export default function Login() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate()

  const { refetch, isLoading: authUserLoading } = useAuthUserQuery()

  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();

    const target = event.target as FormElements;
    const username = target["username"]?.value;
    const password = target["password"]?.value;

    loginUser({ username, password }).unwrap().then(async (data) => {

      if (!data) throw new Error('Login failed')
      if (data.env.toLowerCase() === "development") document.cookie = `Authorization=${data.token}`;
      await refetch();
      navigate('/dashboard', { replace: true })
    }).catch((err: string) => {
      console.log({ err });
      notifications.show({ message: err, color: "red", withBorder: true });
    });
  }


  return (
    <>
      {(isLoading || authUserLoading) &&
        <div className=" h-screen w-screen z-50 absolute flex justify-center items-center backdrop-blur-sm">
          <Loader />
        </div>
      }
      <div
        // className="grid w-screen h-screen items-center gap-1.5 mx-auto content-center"
        className="grid w-screen h-screen items-center gap-1.5 mx-auto content-center"
      >

        <Form onSubmit={(event: React.SyntheticEvent): void => handleSubmit(event)}
          method="post" action="/login"
          className="grid w-full max-w-sm items-center gap-1.5 mx-auto content-center"
        >
          <Label>Username</Label>
          <Input className="max-w-sm" required name="username" />
          <Label>Password</Label>
          <Input className="max-w-sm" type="password" required name="password" />
          <Button type="submit">Login</Button>
        </Form>
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffd700" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg> */}
      </div>
    </>
  )
}

// export async function LoginRouteAction({ request }: { request: Request }) {
//   const data = await request.formData();
//   const username = data.get('username');
//   const password = data.get('password');
//   console.log({ username, password });
//   const [loginUser] = useLoginUserMutation();
//   const login =await loginUser({username, password});
//   console.log({login})
// }