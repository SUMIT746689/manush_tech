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
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import { currency_list } from '@/static_data/currency_list';
import useNotistick from '@/hooks/useNotistick';

function PageHeader({ editSchool, setEditSchool, reFetchData }): any {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { showNotification } = useNotistick();
  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setEditSchool(null);
    setOpen(false);
  };

  useEffect(() => {
    if (editSchool) {
      console.log("editSchool__",editSchool);
      
      handleCreateProjectOpen();
    }
  }, [editSchool]);

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
        showNotification(message);
        setEditSchool(null);
        reFetchData();
        handleCreateProjectClose();
      };
      if (editSchool) {
        const res = await axios.patch(`/api/school/${editSchool.id}`, _values);
        if (res?.data?.success) {
          handleSubmitSuccess(t('A school has been updated successfully'));
        } else {
          new Error('Edit school failed');
        }
      } else {
        const res = await axios.post('/api/school', _values);

        if (res.data?.success) {
          handleSubmitSuccess(t('A new school has been created successfully'));
        } else throw new Error('Failed to create new school');
      }
    } catch (err) {
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
      showNotification(t(err.message), 'error');
    }
  };
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Schools')}
          </Typography>
          <Typography variant="subtitle2">
            {t('These are your active schools')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateProjectOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create new schools')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Create new school')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to add a new school')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: editSchool?.name ? editSchool.name : undefined,
            phone: editSchool?.phone ? editSchool.phone : undefined,
            email: editSchool?.email ? editSchool.email : undefined,
            address: editSchool?.address ? editSchool.address : undefined,
            admin_ids: editSchool?.admins
              ? Array.from(editSchool.admins, (x: any) => x.id)
              : undefined,
            currency: editSchool?.currency ? editSchool.currency : null,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The name field is required')),
            phone: Yup.string()
              .length(11)
              .required(t('The phone field is required')),
            email: Yup.string()
              .email()
              .required(t('The email field is required')),
            address: Yup.string()
              .max(255)
              .required(t('The address field is required')),
            admin_ids: Yup.array(
              Yup.number().required(t('The admin_ids field must be number'))
            ).required('Please select admin.')
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
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('School Name')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(1)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      name="name"
                      placeholder={t('School name here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Phone Number')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(1)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.phone && errors.phone)}
                      fullWidth
                      helperText={touched.phone && errors.phone}
                      name="phone"
                      placeholder={t('Phone number here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Email')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(1)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      name="email"
                      placeholder={t('School email here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Address')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(1)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.address && errors.address)}
                      fullWidth
                      helperText={touched.address && errors.address}
                      name="address"
                      placeholder={t('School Eddress here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Select Admin')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(1)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    {/* <AdminSelect
                      setFieldValue={setFieldValue}
                      oldSelectedAdminID={values.admin_id}
                    /> */}
                    <SelectAdmin
                      setFieldValue={setFieldValue}
                      oldSelectedAdminID={values.admin_ids}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Select Currency')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Autocomplete
                      disablePortal
                      value={
                        currency_list.find(
                          (academic) => academic.code === values.currency
                        ) || null
                      }
                      options={currency_list}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.code === value.code
                      }
                      getOptionLabel={(option) =>
                        option?.name + ' - ' + option?.code
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={Boolean(touched?.currency && errors?.currency)}
                          helperText={touched?.currency && errors?.currency}
                          name="currency"
                          label={t('Select Currency ')}
                        />
                      )}
                      // @ts-ignore
                      onChange={(e, value: any) =>
                        setFieldValue('currency', value?.code || 0)
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    textAlign={{ sm: 'right' }}
                  />
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Button
                      sx={{
                        mr: 2
                      }}
                      type="submit"
                      startIcon={
                        isSubmitting ? <CircularProgress size="1rem" /> : null
                      }
                      disabled={Boolean(errors.submit) || isSubmitting}
                      variant="contained"
                      size="large"
                    >
                      {t(editSchool ? 'Edit school' : 'Create School')}
                    </Button>
                    <Button
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={handleCreateProjectClose}
                    >
                      {t('Cancel')}
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;

const SelectAdmin = ({ setFieldValue, oldSelectedAdminID }) => {
  const [options, setOptions] = useState([]);
  const [searchToken, setSearchToken] = useState('');
  const { searchUsers } = useSearchUsers(10);
  const [selectedOption, setSelectedOption] = useState<any>([]);

  const handleSelect = (value) => {
    setSelectedOption(value);
    const filterIds = Array.from(value, (x: any) => x.id);
    if (value) setFieldValue('admin_ids', filterIds);
  };

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
    // if (oldSelectedAdminID && oldSelectedAdminID?.length > 0) {
    if (oldSelectedAdminID) {
      oldSelectedAdminID.forEach((adminID) => {
        const user: any = users.find((user) => user.id === adminID);
        setSelectedOption((values) => [
          ...values,
          { id: user?.id, label: user?.username }
        ]);
      });
    }
  };

  useEffect(() => {
    getNsetOptions();
  }, []);

  useEffect(() => {
    if (searchToken.length > 3) {
      getNsetOptions();
    }
  }, [searchToken]);

  return (
    <Autocomplete
      multiple
      id="multiple-limit-tags"
      options={options}
      value={selectedOption}
      onChange={(e, v) => handleSelect(v)}
      onInputChange={(e, v) => setSearchToken(v)}
      renderInput={(params) => <TextField {...params} label="Select admin" />}
    />
  );
};

function OldAdminSelect({ setFieldValue, oldSelectedAdminID }) {
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
    if (value) setFieldValue('admin_ids', value.id);
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
