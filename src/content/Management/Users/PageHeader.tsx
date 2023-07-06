import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/hooks/useAuth';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';

function PageHeader({ editUser, setEditUser, reFetchData }) {
  const { user }: any = useAuth();

  useEffect(() => {
    if (editUser) handleCreateUserOpen();
  }, [editUser]);

  const permissons = [
    { label: 'Admin', role: 'ADMIN', value: 'create_admin' },
    { label: 'Guardian', role: 'GURDIAN', value: 'create_gurdian' },
    { label: 'Stuff', role: 'STAFF', value: 'create_stuff' },
    { label: 'Accountant', role: 'ACCOUNTANT', value: 'create_accountant' },
    { label: 'Librarian', role: 'LIBRARIAN', value: 'create_librarian' },
    { label: 'Receptionist', role: 'RECEPTIONIST', value: 'create_receptionist' }
  ];
  const available_permissions = user?.permissions?.map(
    (permission) => permission.value
  );
  const userPrermissionRoles = permissons.filter((role) =>
    available_permissions?.includes(role.value)
  );
  console.log({ userPrermissionRoles });

  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();


  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleCreateUserSuccess = () => {
    showNotification('The user account was created successfully');

    setOpen(false);
  };

  const handleFormSubmit = async(_values,formValue) => {
    const {resetForm, setErrors, setStatus, setSubmitting } = formValue
    try {
      if (editUser)
        axios.patch(`/api/user/${editUser.id}`, _values).then(() => {
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          handleCreateUserSuccess();
          reFetchData(true);
        });
      else
        axios.post(`/api/user`, _values).then(() => {
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          handleCreateUserSuccess();
          reFetchData(true);
        });
      // await wait(1000);
    } catch (err) {
      console.error(err);
      showNotification('There was an error, try again later', 'error');
      setStatus({ success: false });
      4 -
        // @ts-ignore
        setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Users Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the app users can be managed from this page'
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateUserOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create user')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateUserClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(editUser ? 'Edit user' : 'Add new user')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              `Fill in the fields below to ${editUser ? 'edit' : 'create a'
              } user to the site`
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            username: editUser?.username || '',
            password: '',
            confirm_password: '',
            school_id: editUser?.school_id || user?.school_id,
            role: ''
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string()
              .max(255)
              .required(t('The username field is required')),
            password: Yup.string()
              .max(255)
              .required(t('The password field is required'))
              // .matches(/[0-9]/, 'Password requires a number'),
              .min(8, 'Password is too short - should be 8 chars minimum.'),
            // .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
            confirm_password: Yup.string()
              .max(255)
              .required(t('confirm_password field is required'))
              .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            role: Yup.object().required(t('Role field is required'))
          })}
          onSubmit={(_values,getValue:any)=>handleFormSubmit(_values,getValue)}
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
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.username && errors.username)}
                        fullWidth
                        helperText={touched.username && errors.username}
                        label={t('Username')}
                        name="username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.username}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label={t('Password')}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(
                          touched.confirm_password && errors.confirm_password
                        )}
                        fullWidth
                        helperText={
                          touched.confirm_password && errors.confirm_password
                        }
                        label={t('Confirm password')}
                        name="confirm_password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.confirm_password}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        disablePortal
                        value={
                          userPrermissionRoles.find(
                            // @ts-ignore
                            (permRole) => permRole.value === values?.role?.permission
                          ) || null
                        }
                        options={userPrermissionRoles}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.value === value.value
                        }
                        getOptionLabel={(option) => option?.label}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            name="role"
                            label={t('User role')}
                            error={Boolean(
                              touched.role && errors.role
                            )}

                            helperText={touched.role && errors.role}
                            onBlur={handleBlur}
                          />
                        )}
                        // @ts-ignore
                        onChange={(event, value: any) => {
                          console.log({ value });
                          setFieldValue('role', { role_title: value?.role, permission: value?.value } || '');
                        }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{
                    p: 3
                  }}
                >
                  <Button color="secondary" onClick={handleCreateUserClose}>
                    {t('Cancel')}
                  </Button>
                  <Button
                    type="submit"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    // @ts-ignore
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                  >
                    {t(editUser ? 'Edit user' : 'Add new user')}
                  </Button>
                </DialogActions>
              </form>
            )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
