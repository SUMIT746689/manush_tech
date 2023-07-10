import { useTranslation } from "next-i18next";
import { Box, Grid, Typography } from "@mui/material";

const Head = ({ name, extraInfo }) => {

  const { t }: { t: any } = useTranslation();


  return (
    <Box
      display="grid"
      width="full"

    >
      <Typography variant="h3" component="h3" gutterBottom>
        {t(`Welcome, ${name}`)}
      </Typography>

      <Grid className=' grid item grid-cols-2'>
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