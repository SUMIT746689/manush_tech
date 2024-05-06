import { ModuleContext } from "@/contexts/ModuleContext"
import { Card, Grid } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"

const QuickLinkCards = ({ quickLinks }) => {

  return (
    <Grid display="grid" gridTemplateColumns={'1fr 1fr'} justifyContent="center" gap={2} p={2} mx='auto' maxWidth={500} >

      {
        quickLinks.map(({ src, href, name }) => (
          <Link href={href}>
            <Card
              sx={{ p: 2, fontWeight: 700, borderRadius: 0.5, height: '100%', textAlign: 'center', px: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}
            >
              <Image src={src} alt={name} width={40} height={40} className='h-full' />
              {name}
            </Card>
          </Link>
        ))
      }
    </Grid>
  )
}

export const StudentPathButton = ({ color, linkUrl, name, icon, value }) => {
  const { handleChangeModule } = useContext(ModuleContext);
  return (
    <>
      <Link href={linkUrl} onClick={() => handleChangeModule(value)} >
        <Card
          sx={{
            p: 1.5,
            // boxShadow: 'inset 0px 0px 25px 3px rgba(0,0,0,0.1)',
            border: '1px solid',
            transition: 'all 0.2s',
            ':hover': { background: color, transform: 'scale(.95)' },
            borderRadius: '18px',
            borderColor: color.dark,
            background: 'transparent',
            boxShadow: '5px 5px 13px 0px #D1D9E6E5 inset,-5px -5px 10px 0px #FFFFFFE5 inset;,5px -5px 10px 0px #D1D9E633 inset;,-5px 5px 10px 0px #D1D9E633 inset;,-1px -1px 2px 0px #D1D9E680;,1px 1px 2px 0px #FFFFFF4D'
            // borderRadius: 1, px: 3, py: 1
          }}>
          <Card sx={{
            // boxShadow: '5px 5px 13px 0px #D1D9E6E5,-5px -5px 10px 0px #FFFFFFE5,5px -5px 10px 0px #D1D9E633,-5px 5px 10px 0px #D1D9E633,-1px -1px 2px 0px #D1D9E680 inset,1px 1px 2px 0px #FFFFFF4D inset',
            boxShadow: 'box-shadow: 5px 5px 13px 0px #D1D9E6E5,-5px -5px 10px 0px #FFFFFFE5,5px -5px 10px 0px #D1D9E633,-5px 5px 10px 0px #D1D9E633,-1px -1px 2px 0px #D1D9E680 inset,1px 1px 2px 0px #FFFFFF4D inset',
            borderRadius: '18px',
            background: color.light
          }}>
            <Grid sx={{ width: 175, height: 101, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}>
              <Grid>
                {icon}
              </Grid>
              <Grid fontSize={15} fontWeight={700} color={color.dark}>
                {name}
              </Grid>
            </Grid>
          </Card>
        </Card>

        {/* <Card sx={{ border: '1px solid', transition: 'all 0.2s', ':hover': { background: colorLightViolet, transform: 'scale(.95)' }, borderColor: colorDarkViolet, borderRadius: 1, px: 3, py: 1 }}>
          <Grid sx={{ width: 85, height: 85, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <Grid>
              {icon}
            </Grid>
            <Grid fontSize={14} color={colorDarkViolet}>
              {name}
            </Grid>
          </Grid>
        </Card> */}
      </Link>
    </>
  )
}

export default QuickLinkCards