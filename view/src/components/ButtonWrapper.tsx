import { Button, Group } from "@mantine/core";
import React from "react";

interface FormSubmitButtonInterface{
  children?: React.ReactElement | string;
}

const FormSubmitButtonWrapper:React.FC<FormSubmitButtonInterface > = ({children}) => {

  return (
    <Group position="right" mt="md">
      <Button type="submit" variant="filled" className=" bg-orange-600 hover:bg-orange-700" >
        {children}
      </Button>
    </Group>
  );
}

export { FormSubmitButtonWrapper }