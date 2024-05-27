import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export const TableRowWrapper = ({ children, ...params }) => {
  return (
    <TableRow
      {...params}
      sx={{ ':hover': { backgroundColor: 'lightgray' } }}
      // sx={{ ":hover": { backgroundColor: "#9bc0ff", } }}
    >
      {/* <Typography noWrap variant="h5" fontWeight={500}> */}
      {children}
      {/* </Typography> */}
    </TableRow>
  );
};

export const TableCellWrapper = ({ children }) => {
  return (
    <TableCell sx={{ border: '1px solid lightgray' }}>
      <Typography noWrap variant="h5" fontWeight={500}>
        {children}
      </Typography>
    </TableCell>
  );
};

export const TableHeaderCellWrapper = ({ children, style = {}, ...parmas }) => {
  return (
    <TableCell sx={{ border: '1px solid lightgray', px: 0.6, py: 0, fontSize: { xs: 9, md: 10, xl: 11 }, ...style }} {...parmas}>
      {children}
    </TableCell>
  );
};

export const TableBodyCellWrapper = ({ children, ...parmas }) => {
  return (
    <TableCell sx={{ border: '1px solid lightgray', px: 0.6, py: 0, fontSize: { xs: 10, md: 11, xl: 12 } }} {...parmas}>
      {children}
    </TableCell>
  );
};

export const TableFooterCellWrapper = ({ children, ...parmas }) => {
  return (
    <TableCell sx={{ border: '1px solid lightgray', px: 0.6, py: 1, fontSize: { xs: 10, md: 11, xl: 12 } }} {...parmas}>
      {children}
    </TableCell>
  );
};
