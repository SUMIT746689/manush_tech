import { Box, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, Typography } from "@mui/material"
import { useTranslation } from "next-i18next";

export const TableHeadWrapper = ({ title, total, count, rowsPerPage, page, onPageChange, onRowsPerPageChange, selectAllCheckbox = null, children = null }) => {
  const { t }: { t: any } = useTranslation();
  return (
    <Box
      px={1}
      pt={1}
    >
      {children
        &&
        <Grid item display="grid" gridTemplateColumns='auto 1fr' gap={{ sm: 1 }} sx={{ pr: 1 }} justifyItems="end" >
          {children}
        </Grid>
      }
      <Grid
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          {selectAllCheckbox && selectAllCheckbox}

          <Typography component="span" variant="subtitle1" pl={1}>
            {t('Showing')}:
          </Typography>{' '}
          <b>{total}</b>  <b>{t(title)}</b>
        </Box>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Grid>

    </Box>
  )
}

export const TableContainerWrapper = ({ tableHead, tableBody, tableFooter = <></> }) => {

  return (
    <TableContainer>
      <Table>
        <TableHead>
          {tableHead}
        </TableHead>
        <TableBody>
          {tableBody}
        </TableBody>
        {tableFooter}
      </Table>
    </TableContainer>
  )

}

export const TableEmptyWrapper = ({ title }) => {
  const { t }: { t: any } = useTranslation();
  return (
    <Typography
      sx={{
        py: 10,
        fontSize: { sm: 20, md: 25 }
      }}
      variant="h4"
      fontWeight="normal"
      color="text.secondary"
      align="center"
    >
      {t(`We couldn't find any ${title} matching your search criteria`)}
    </Typography>
  )
}