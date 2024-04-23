import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { useTranslation } from 'react-i18next';
import { Grid, Button, Box } from '@mui/material';
import { TextFieldWrapper } from '@/components/TextFields';
import { useState, useContext } from 'react';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';

const PaymentOptions = ({ dueAmout, accountsOption, accounts }) => {
  let due = 0;
  const { t }: { t: any } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [gatewayOption, setGatewayOption] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [transID, setTransID] = useState(null);
  const [amount, setAmount] = useState(dueAmout);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  console.log('AcademicYear ###################');
  console.log(academicYear);
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        padding: '18px',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 150px)',
        gap: 1,
        justifyContent: 'center'
      }}
    >
      <AutoCompleteWrapper
        label={t('Account')}
        placeholder={t('Select account...')}
        // getOptionLabel={(option) => option.name}
        options={accountsOption}
        value={selectedAccount}
        handleChange={(e, v) => {
          if (v) {
            const temp = accounts
              ?.find((i) => i.id === v?.id)
              ?.payment_method?.map((j) => ({
                label: j.title,
                id: j.id
              }));

            setGatewayOption(temp);
          } else {
            setGatewayOption([]);
          }
          setSelectedAccount(v);
          setSelectedGateway(null);
        }}
      />
      <AutoCompleteWrapper
        label={t('Pay via')}
        placeholder={t('Select Pay via...')}
        options={gatewayOption}
        value={selectedGateway}
        handleChange={(e, value) => {
          if (value == 'Cash') {
            setTransID(null);
          }
          setSelectedGateway(value);
        }}
      />
      <TextFieldWrapper
        label="trans ID"
        name=""
        value={transID}
        touched={undefined}
        errors={undefined}
        handleChange={(e) => setTransID(e.target.value)}
        handleBlur={undefined}
        required={selectedGateway !== 'Cash' ? true : false}
        // type
      />
      <TextFieldWrapper
        label="Amount"
        name=""
        type="number"
        touched={undefined}
        errors={undefined}
        value={amount || ''}
        handleChange={(e) => setAmount(e.target.value)}
        handleBlur={undefined}
      />
      <Grid>
        <Button
          variant="contained"
          disabled={false}
          onClick={() => {}}
          sx={{ borderRadius: 0.5, padding: '6px', width: '100%' }}
        >
          Collect
        </Button>
      </Grid>
    </Box>
  );
};

export default PaymentOptions;
