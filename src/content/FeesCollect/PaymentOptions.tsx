import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { useTranslation } from 'react-i18next';
import { Grid, Button, Box } from '@mui/material';
import { TextFieldWrapper } from '@/components/TextFields';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import axios from 'axios';

const PaymentOptions = ({
  deSelectAllCheckbox,
  trackingCollectButton,
  setTrackingCollectButton,
  tableData,
  feesUserData,
  selectedRows,
  accountsOption,
  accounts,
  btnHandleClick
}) => {
  const { t }: { t: any } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [gatewayOption, setGatewayOption] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [transID, setTransID] = useState(null);
  const [amount, setAmount] = useState(null);
  const { user } = useAuth();

  const { showNotification } = useNotistick();

  // dueAmount update
  useEffect(() => {
    let dueValue = 0;

    // amount option update
    for (let i = 0; i < selectedRows.length; i++) {
      for (let j = 0; j < tableData.length; j++) {
        if (selectedRows[i] === tableData[j].feeId) {
          dueValue = dueValue + tableData[j].dueAmount;
        }
      }
    }
    if (dueValue > 0) {
      setAmount(dueValue);
    } else {
      setAmount(null);
    }
  }, [selectedRows, tableData]);

  // handleCollectFunction
  const handleCollect = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const dueAmount = [];

    for (let i = 0; i < selectedRows.length; i++) {
      for (let j = 0; j < tableData.length; j++) {
        if (selectedRows[i] === tableData[j].feeId) {
          dueAmount.push(tableData[j].dueAmount);
        }
      }
    }
    const totalDueAmount = dueAmount.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    // handle amount input field error message
    // if (!amount) {
    //   showNotification(
    //     'The amount is less than or equal to the due amount.',
    //     'error'
    //   );
    //   return;
    // } else if (amount > totalDueAmount) {
    //   showNotification(
    //     'The amount is less than or equal to the due amount.',
    //     'error'
    //   );
    //   return;
    // } else if (amount < totalDueAmount && amount > 0) {
    // } else if (amount < 0) {
    //   showNotification(
    //     'The amount is less than or equal to the due amount.',
    //     'error'
    //   );
    //   return;
    // }
    // handle bank account input field error message

    if (!selectedAccount?.id) {
      showNotification('Please select a bank account.', 'error');
      return;
    }
    // handle pay via input field error message
    if (!selectedGateway?.id) {
      showNotification('Please select a Pay via option.', 'error');
      return;
    }
    // handle transId input field error message
    if (selectedGateway?.label !== 'Cash' ? true : false) {
      showNotification('Please provide the transaction ID.', 'error');
      return;
    }

    // amount calculation part start
    let error_row_count = 0;
    let error_row_due_value = 0;
    for (let i = 0; i < dueAmount.length; i++) {
      error_row_due_value += parseInt(dueAmount[i]);
      if (error_row_due_value < parseInt(amount)) {
        error_row_count += 1;
      }
    }

    const total_amount = dueAmount.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    const copy_dueAmount_arr = dueAmount;
    let remaining_due_value = null;
    if (!amount) {
      showNotification('please fill out amount field.', 'error');
      return;
    } else if (parseInt(amount) > parseInt(total_amount)) {
      showNotification(
        'The amount is less than or equal to the due amount.',
        'error'
      );
      return;
    } else if (total_amount === amount) {
    } else if (amount < total_amount) {
      // amount = 35000
      copy_dueAmount_arr.pop();
      const total_amount_without_last_item = copy_dueAmount_arr.reduce(
        (accumulator, currentValue) => {
          // 30000 user input is 31000 selected item 3
          return accumulator + currentValue;
        },
        0
      );

      if (parseInt(total_amount_without_last_item) === parseInt(amount)) {
        // error message because now have no remaining value for last item
        showNotification(
          'please deselect the last row in the table as it does not contain any remaining values.',
          'error'
        );
        return;
      } else if (parseInt(amount) < parseInt(total_amount_without_last_item)) {
        // error message because now amount is less than selected first 2 items but user already select 3rd items.
        showNotification(
          `The amount is less than the total number of selected items (${
            error_row_count + 1
          }) but the user has selected (${
            selectedRows.length
          }) items. Please adjust the amount or deselect some items.`,
          'error'
        );
        return;
      } else if (parseInt(amount) > parseInt(total_amount_without_last_item)) {
        // user select 3 items andd amount is 31000 so first 2 items total value is 30000 now remaining value is 1000. So this value will be added for next item that means 3rd items
        remaining_due_value =
          parseInt(amount) - parseInt(total_amount_without_last_item); // amount = 31000, total_amount_without_lat_item = 30000 , result = 1000
        copy_dueAmount_arr.push(remaining_due_value);
      }
    }

    // amount calculation part end

    let finalArray = [];
    let collect_filter_data = [];
    const feesWithDueArray = selectedRows.map((id, index) => {
      return { id, due: copy_dueAmount_arr[index] };
    });

    if (feesWithDueArray.length > 1) {
      finalArray = feesWithDueArray.map((item, i) => {
        return {
          ...item,
          collected_amount: item.due
        };
      });
    } else {
      finalArray = feesWithDueArray;
    }

    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < finalArray.length; j++) {
        if (tableData[i].feeId === finalArray[j].id) {
          collect_filter_data.push({
            id: finalArray[j].id,
            collected_amount: finalArray[j].due,
            total_payable: parseInt(tableData[i].dueAmount)
          });
        }
      }
    }

    // amount calculation part end

    axios
      .post('/api/student_payment_collect/multiples_fees', {
        student_id: feesUserData.id,
        collected_by_user: user?.id,
        fee_id: selectedRows,
        account_id: selectedAccount?.id,
        payment_method_id: selectedGateway?.id,
        collected_amount: amount,
        transID: transID ? transID : null,
        total_payable: copy_dueAmount_arr,
        sent_sms: false,
        collect_filter_data
      })
      .then((res) => {
        if (res.data.success) {
          btnHandleClick();
          deSelectAllCheckbox();
          showNotification(
            `Congratulations! Payment Successfully Processed`,
            'success'
          );
        }
      })
      .catch((error) => {
        // console.log('Frontend catch block error message is here');
      });
  };

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
        handleChange={(e) => {
          setTransID(e.target.value);
        }}
        handleBlur={undefined}
        required={selectedGateway?.label !== 'Cash' ? true : false}
        // type
      />
      <TextFieldWrapper
        // disabled={selectedRows.length > 1 ? true : false}
        label="Amount"
        name=""
        type="number"
        touched={undefined}
        errors={undefined}
        value={amount || ''}
        handleChange={(e) => {
          setAmount(e.target.value);
        }}
        handleBlur={undefined}
      />
      <Grid>
        <Button
          variant="contained"
          disabled={selectedRows.length > 0 ? false : true}
          onClick={handleCollect}
          sx={{ borderRadius: 0.5, padding: '6px', width: '100%' }}
        >
          Collect
        </Button>
      </Grid>
    </Box>
  );
};

export default PaymentOptions;
