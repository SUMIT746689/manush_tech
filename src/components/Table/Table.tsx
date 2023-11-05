import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"

export const TableRowWrapper = ({ children, ...params }) => {
  return (
    <TableRow {...params}
      sx={{ ":hover": { backgroundColor: "lightgray", } }}
      // sx={{ ":hover": { backgroundColor: "#9bc0ff", } }}
    >
      {/* <Typography noWrap variant="h5" fontWeight={500}> */}
      {children}
      {/* </Typography> */}
    </TableRow>
  )
}

export const TableCellWrapper = ({ children }) => {
  return (
    <TableCell sx={{ border: '1px solid lightgray' }}>
      <Typography noWrap variant="h5" fontWeight={500}>
        {children}
      </Typography>
    </TableCell>
  )
}