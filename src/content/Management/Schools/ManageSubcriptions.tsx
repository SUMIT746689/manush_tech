import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { useClientFetch } from '@/hooks/useClientFetch';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import useNotistick from '@/hooks/useNotistick';
import { TextFieldWrapper } from '@/components/TextFields';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';

function ManageSubcriptions({ open, setOpen, reFetchData }): any {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const theme = useTheme();
  const { data: packages } = useClientFetch('/api/packages');

  const handleCreateProjectClose = () => {
    setOpen(null);
  };

  const handleCreateProjectSuccess = (message) => {
    showNotification(message);
    setOpen(false);
  };

  const handleCreateProjectError = (message) => {
    showNotification(message, 'error');
    setOpen(false);
  };

  const handleFormSubmit = async (
    _values,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    try {
      const handleSubmitSuccess = async (message) => {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateProjectSuccess(message);
        setOpen(null);
        reFetchData();
      };

      const res = await axios.post('/api/subscriptions', {
        school_id: open.id,
        ..._values
      });
      if (res.data?.success) {
        handleSubmitSuccess(t('School package added successfully'));
      } else throw new Error('Adding package for school was failed');
    } catch (err) {
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
      handleCreateProjectError(t(err.message));
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Manage school subscriptions')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to add or change school')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: open?.name,
            package_id:
              open?.subscription?.length > 0 && open.subscription[0].package_id,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            package_id: Yup.number()
              .max(255)
              .required(t('The package field is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            handleFormSubmit(
              _values,
              resetForm,
              setErrors,
              setStatus,
              setSubmitting
            );
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={0}>

                  <TextFieldWrapper
                    errors={errors.name}
                    touched={touched.name}
                    name="name"
                    label={t('School')}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.name}
                  />

                  <Grid
                    // sx={{
                    //   mb: `${theme.spacing(3)}`
                    // }}
                    display={"grid"}
                    gap={2}
                    item
                    width={"100%"}
                  >
                    <Autocomplete
                      disablePortal
                      size='small'
                      value={
                        packages?.data?.find(
                          (pkg: any) => pkg.id === values.package_id
                        ) || null
                      }
                      options={packages?.success ? packages.data : []}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.title === value.title
                      }
                      getOptionLabel={(option) =>
                        option?.title +
                        ' - ' +
                        option?.price +
                        ' ' +
                        open?.currency
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            [`& fieldset`]: {
                              borderRadius: 0.6,
                            }
                          }}
                          fullWidth
                          error={Boolean(
                            touched?.package_id && errors?.package_id
                          )}
                          helperText={touched?.package_id && errors?.package_id}
                          name="package_id"
                          label={t('Select Package ')}
                        />
                      )}
                      // @ts-ignore
                      onChange={(e, value: any) => {
                        setFieldValue('package_id', value?.id || 0);
                      }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActionWrapper
                handleCreateClassClose={handleCreateProjectClose}
                errors={errors}
                editData={undefined}
                title="Subscription"
                titleFront="Add "
                isSubmitting={isSubmitting}
              />
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default ManageSubcriptions;

function AdminSelect({ setFieldValue, oldSelectedAdminID }) {
  const [searchToken, setSearchToken] = useState('');
  // todo: now options is showing user with wny role, but we need users with only admin role
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const { searchUsers } = useSearchUsers(10);

  const getNsetOptions = async () => {
    const [users, err] = await searchUsers({ by: null, token: null });
    if (err) return;

    setOptions(
      users.map((user) => {
        return {
          id: user.id,
          label: user.username
        };
      })
    );
    if (oldSelectedAdminID) {
      const user = users.find((user) => user.id === oldSelectedAdminID);
      setSelectedOption({ id: user.id, label: user.username });
    }
  };

  const handleSelect = (value) => {
    setSelectedOption(value);
    if (value) setFieldValue('admin_id', value.id);
  };

  useEffect(() => {
    getNsetOptions();
  }, []);
  //
  useEffect(() => {
    if (searchToken.length > 3) {
      getNsetOptions();
    }
  }, [searchToken]);
  return (
    <>
      <Autocomplete
        renderInput={(params) => <TextField {...params} label="Select admin" />}
        options={options}
        onChange={(e, v) => handleSelect(v)}
        filterOptions={(x) => x}
        onInputChange={(e, v) => setSearchToken(v)}
        value={selectedOption}
      />
    </>
  );
}
