import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';

import {
  Grid,
  Typography
} from '@mui/material';

function PageHeader(): any {
  const { t }: { t: any } = useTranslation();
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Routine')}
          </Typography>
          <Typography variant="subtitle2">
            {t('These are your active routine')}
          </Typography>
        </Grid>
      </Grid>
      
    </>
  );
}

export default PageHeader;
