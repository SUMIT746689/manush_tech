import { Grid, Card } from '@mui/material';
import {
  ButtonWrapper,
  SearchingButtonWrapper
} from '@/components/ButtonWrapper';

const Reset_Sent_SMS_Collect_Invoice = ({
  handlePrint,
  prinCollectedtFees,
  printFees,
  handleSentSms,
  isSentSmsLoading,
  resetBtnHandleClick
}) => {
  return (
    <Grid>
      <Grid
        sx={{
          // pt: 1,
          // px: 1,
          display: 'grid',
          gridTemplateColumns: { xs: ' 1fr 1fr', sm: '1fr 1fr 1fr' },
          justifyContent: 'center',
          fontSize: 0.1,
          gap: 1
        }}
      >
        <ButtonWrapper pb={0} handleClick={resetBtnHandleClick} color="warning">
          {'Reset'}
        </ButtonWrapper>

        <SearchingButtonWrapper
          pb={0}
          isLoading={isSentSmsLoading}
          handleClick={handleSentSms}
          disabled={printFees.length === 0 || prinCollectedtFees.length === 0}
        >
          Sent Sms
        </SearchingButtonWrapper>

        <ButtonWrapper
          pb={0}
          sx={{
            ':disabled': {
              backgroundColor: 'silver'
            }
          }}
          disabled={printFees.length === 0}
          handleClick={handlePrint}
        >
          {'Collect Invoice Print'}
        </ButtonWrapper>
      </Grid>
    </Grid>
  );
};

export default Reset_Sent_SMS_Collect_Invoice;
