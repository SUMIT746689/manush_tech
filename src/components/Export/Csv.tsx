import { Grid, Tooltip } from '@mui/material';
import Image from 'next/image';
import { CSVLink } from 'react-csv';

function CsvExport({ exportData }) {
  
  return (
    <>
      <CSVLink data={exportData}>
      <Tooltip title={'Export CSV'} arrow>
        <Grid sx={{ ':hover': { cursor: 'pointer', scale: 1 } }}>
          <Image
            src="/export_icons/csv.png"
            width={35}
            height={35}
            alt="Export CSV"
          />
        </Grid>
      </Tooltip>
      </CSVLink>
    </>
  );
}

export default CsvExport;
