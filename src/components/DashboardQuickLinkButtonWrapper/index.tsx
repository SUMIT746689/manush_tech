import { ModuleContext } from "@/contexts/ModuleContext";
import { Card, Grid } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

// export const DashboardQuickLinkButtonWrapper = ({ color, linkUrl, name, icon, value }) => {
//     const { handleChangeModule } = useContext(ModuleContext);
//     return (
//         <>
//             <Link href={linkUrl} onClick={() => handleChangeModule(value)} >
//                 <Card
//                     sx={{
//                         p: 1.5,
//                         // boxShadow: 'inset 0px 0px 25px 3px rgba(0,0,0,0.1)',
//                         border: '1px solid',
//                         transition: 'all 0.2s',
//                         ':hover': { background: color, transform: 'scale(.95)' },
//                         borderRadius: '18px',
//                         borderColor: color.dark,
//                         background: 'transparent',
//                         boxShadow: '5px 5px 13px 0px #D1D9E6E5 inset,-5px -5px 10px 0px #FFFFFFE5 inset;,5px -5px 10px 0px #D1D9E633 inset;,-5px 5px 10px 0px #D1D9E633 inset;,-1px -1px 2px 0px #D1D9E680;,1px 1px 2px 0px #FFFFFF4D'
//                         // borderRadius: 1, px: 3, py: 1
//                     }}>
//                     <Card sx={{
//                         // boxShadow: '5px 5px 13px 0px #D1D9E6E5,-5px -5px 10px 0px #FFFFFFE5,5px -5px 10px 0px #D1D9E633,-5px 5px 10px 0px #D1D9E633,-1px -1px 2px 0px #D1D9E680 inset,1px 1px 2px 0px #FFFFFF4D inset',
//                         boxShadow: 'box-shadow: 5px 5px 13px 0px #D1D9E6E5,-5px -5px 10px 0px #FFFFFFE5,5px -5px 10px 0px #D1D9E633,-5px 5px 10px 0px #D1D9E633,-1px -1px 2px 0px #D1D9E680 inset,1px 1px 2px 0px #FFFFFF4D inset',
//                         borderRadius: '18px',
//                         background: color.light
//                     }}>
//                         <Grid sx={{ width: 175, height: 101, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}>
//                             <Grid>
//                                 {icon}
//                             </Grid>
//                             <Grid fontSize={15} fontWeight={700} color={color.dark}>
//                                 {name}
//                             </Grid>
//                         </Grid>
//                     </Card>
//                 </Card>

//                 {/* <Card sx={{ border: '1px solid', transition: 'all 0.2s', ':hover': { background: colorLightViolet, transform: 'scale(.95)' }, borderColor: colorDarkViolet, borderRadius: 1, px: 3, py: 1 }}>
//           <Grid sx={{ width: 85, height: 85, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}>
//             <Grid>
//               {icon}
//             </Grid>
//             <Grid fontSize={14} color={colorDarkViolet}>
//               {name}
//             </Grid>
//           </Grid>
//         </Card> */}
//             </Link>
//         </>
//     )
// }

export const DashboardQuickLinkButtonWrapper = ({ color, linkUrl, name, icon, value }) => {
    const { handleChangeModule } = useContext(ModuleContext);
    return (
        <>
            <Link href={linkUrl} onClick={() => handleChangeModule(value)} style={{ textDecoration: "none" }} >
                <Card
                    sx={{
                        p: { xs: 0.75, md: 1, xl: 1.5 },
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
                        borderRadius: '16px',
                        background: color.light
                    }}>
                        {/* <Grid sx={{ width: { xs: 150, xl: 175 }, height: { xs:80, xl: 101 }, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}> */}
                        <Grid sx={{ width: { xs: 125, xl: 175 }, minHeight: { xs: 70, xl: 101 }, textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}>
                            <Grid>
                                {icon}
                            </Grid>
                            <Grid fontSize={{ xs: 10, lg: 12, xl: 13 }} fontWeight={400} color={color.dark}>
                                {name}
                            </Grid>
                        </Grid>
                    </Card>
                </Card>
            </Link>
        </>
    )
}

export const ModuleQuickLinkButtonWrapper = ({ color, linkUrl, name, icon }) => {
    return (
        <>
            <Link href={linkUrl} style={{ textDecoration: "none" }} >
                <Card
                    sx={{
                        p: { xs: 0.75, md: 1, xl: 1.5 },
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
                        borderRadius: '16px',
                        background: color.light
                    }}>
                        {/* <Grid sx={{ width: { xs: 150, xl: 175 }, height: { xs:80, xl: 101 }, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}> */}
                        <Grid sx={{ width: { xs: 150, xl: 175 }, height: { xs: 80, xl: 101 }, my: "auto", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: 'space-evenly' }}>
                            <Grid>
                                {icon}
                            </Grid>
                            <Grid fontSize={{ xs: 12, lg: 13 }} fontWeight={400} color={color.dark}>
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
