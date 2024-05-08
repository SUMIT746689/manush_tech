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
      <Card
        sx={{
          pt: 1,
          px: 1,
          display: 'grid',
          gridTemplateColumns: { xs: ' 1fr', md: '1fr 1fr 1fr' },
          justifyContent: 'center',
          fontSize: 0.1,
          columnGap: 1
        }}
      >
        <ButtonWrapper handleClick={resetBtnHandleClick} color="warning">
          {'Reset'}
        </ButtonWrapper>

        <SearchingButtonWrapper
          isLoading={isSentSmsLoading}
          handleClick={handleSentSms}
          disabled={printFees.length === 0 || prinCollectedtFees.length === 0}
        >
          Sent Sms
        </SearchingButtonWrapper>

        <ButtonWrapper
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
      </Card>
    </Grid>
  );
};

export default Reset_Sent_SMS_Collect_Invoice;
