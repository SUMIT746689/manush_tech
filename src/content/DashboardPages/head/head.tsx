import { useTranslation } from "next-i18next";
import { Box, Grid, Typography } from "@mui/material";

const Head = ({ name, extraInfo }) => {

  const { t }: { t: any } = useTranslation();


  return (
    <Box
      display="grid"
      width="full"

    >
      <Typography variant="h3" component="h3" gutterBottom sx={{ color: theme => theme.colors.alpha.white[70] }}>
        {t(`Welcome, ${name}`)}
      </Typography>

      <Grid className=' grid item' sx={{ fontSize: { xs: 20, sm: 24 } }}>
        {
          extraInfo.map((info) => (
            <Typography variant="h5" component="h5" gutterBottom>
              {t(`${info[0]}: ${info[1]}`)}
            </Typography>
          ))
        }
      </Grid>

    </Box>
  )
}
export default Head