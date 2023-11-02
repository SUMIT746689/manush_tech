import TableCell from "@mui/material/TableCell"
import Typography from "@mui/material/Typography"

export const TableCellWrapper = ({ children }) => {
  return (
    <TableCell sx={{ border: '1px solid lightgray' }}>
      <Typography noWrap variant="h5" fontWeight={500}>
        {children}
      </Typography>
    </TableCell>
  )
}