import { Box, Center, SegmentedControl } from "@mantine/core"
import { IconCode, IconExternalLink, IconEye } from "@tabler/icons-react"

export const SecondNavbarWrapper = () => {
  return (
    <>
      <SegmentedControl
        variant=""
        color="orange"

        data={[
          {
            value: 'preview',
            label: (
              <Center>
                <IconEye size="1rem" />
                <Box ml={10}>Preview</Box>
              </Center>
            ),
          },
          {
            value: 'code',
            label: (
              <Center>
                <IconCode size="1rem" />
                <Box ml={10}>Code</Box>
              </Center>
            ),
          },
          {
            value: 'export',
            label: (
              <Center>
                <IconExternalLink size="1rem" />
                <Box ml={10}>Export</Box>
              </Center>
            ),
          },
        ]}
      />
      
    </>
  )
}