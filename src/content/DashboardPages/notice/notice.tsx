import { Button, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";

const Notice = ({ blockCount }) => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Typography variant="h3" component="h3" pl={4} gutterBottom>
        {t('Notice')}
      </Typography>

      <Grid paddingX={4}>
        <TableContainer component={Paper} sx={{ borderRadius: 0.5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#2196f3' }}>
                <TableCell padding="checkbox" >
                  <Checkbox
                  sx={{ color: 'white' }}
                    checked={false}
                    indeterminate={false}
                  // onChange={}
                  />
                </TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Date</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Title</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blockCount?.notices?.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox" >
                    <Checkbox
                      checked={false}
                      indeterminate={false}
                    // onChange={}
                    />
                  </TableCell>
                  {/* <TableCell component="th" scope="row">
                  {row.name}
                </TableCell> */}
                  <TableCell padding='none' align="right">{dayjs(row.created_at).format('DD - MM - YYYY')}</TableCell>
                  <TableCell padding='none' align="right">{row.title}</TableCell>

                  <TableCell sx={{ p: 0.5 }} align="right">
                    <Button> Download</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}

export default Notice