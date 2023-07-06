import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

export const PdfExport = ({ title, exportData,tableFooter = <></> }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <>
      <Grid
        onClick={handlePrint}
        sx={{ ':hover': { cursor: 'pointer', scale: 1 } }}
      >
        <Tooltip title={'Export Pdf'} arrow>
          <PictureAsPdfIcon sx={{ fontSize: '35px' }} />
        </Tooltip>
      </Grid>

      <Grid display='none'>
        <Grid ref={componentRef}>
          <PrintComponent title={title} exportData={exportData} tableFooter = {tableFooter}/>
        </Grid>
      </Grid>
    </>
  );
}

const PrintComponent = ({ title, exportData,tableFooter = <></> }) => {
  return (
    <Grid>
      <Grid textAlign={'center'} paddingY={3}>
        {' '}
        <h2> Title: {title}</h2>
        <Grid sx={{ marginX: 1, p: 0.5, border: 1, borderColor: 'lightgrey', }}>
          <Table sx={{ fontSize: '1em' }} aria-label="table">
            <TableHead>
              <TableRow >
                {exportData.length > 0 &&
                  Object.keys(exportData[0]).map((name) => (
                    <TableCell sx={{ fontSize: '1em', p: 0, fontWeight: 'bold' }}>{name}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {exportData?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {exportData.length > 0 &&
                    Object.keys(exportData[0]).map((columnKey, index) => (
                      <TableCell key={index} sx={{ fontSize: '1em', p: 0 }}>
                        {typeof row[columnKey] === 'object'
                          ? 'object'
                          : row[columnKey]}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
            {tableFooter}
          </Table>

        </Grid>
      </Grid>
    </Grid>
  );
};
