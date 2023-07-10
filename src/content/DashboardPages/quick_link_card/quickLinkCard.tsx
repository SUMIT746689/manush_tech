import { Card, Grid } from "@mui/material"
import Image from "next/image"
import Link from "next/link"

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

export default QuickLinkCards