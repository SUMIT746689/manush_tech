import { useContext, useEffect, useState } from 'react';
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
  Zoom,
  Typography,
  TextField,
  CircularProgress,
  Button,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';


function PageHeader({contentPermission, editGrade, setEditGrade, reFetchData }): any {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const theme = useTheme();


  useEffect(() => {
    if (editGrade) {
      handleCreateProjectOpen();
    }
  }, [editGrade]);

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
    setEditGrade(null);
  };

  const handleCreateProjectSuccess = (message) => {
    showNotification(message);
    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Grade')}
          </Typography>
          <Typography variant="subtitle2">
            {t('These are your Gradeing system')}
          </Typography>
        </Grid>
        {
          contentPermission?.create_grade && <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateProjectOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create new Grade')}
          </Button>
        </Grid>
        }
        
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
            {editGrade ? t('Edit grade') : t('Create new grade')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              `Use this dialog window to ${editGrade ? 'Edit ' : 'add a new'
              } Grade`
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            lower_mark: editGrade ? editGrade?.lower_mark : undefined,
            upper_mark: editGrade ? editGrade?.upper_mark : undefined,
            point: editGrade ? editGrade?.point : undefined,
            grade: editGrade ? editGrade?.grade : undefined,
            academic_year_id: academicYear.id,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            lower_mark: Yup.number()
              .max(255)
              .required(t('The lower_mark field is required')),
            upper_mark: Yup.number()
              .max(255)
              .required(t('The upper_mark field is required')),
            point: Yup.number()
              .max(255)
              .required(t('The point field is required')),
            grade: Yup.string()
              .max(255)
              .required(t('The grade field is required')),

          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const successProcess = (message) => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                setEditGrade(null);
                handleCreateProjectSuccess(message);
                reFetchData();
              };
              if (editGrade) {
                const res = await axios.patch(
                  `/api/grade?grade_id=${editGrade.id}`,
                  _values
                );
                if (res.status == 200) successProcess(t('A grad has been updated successfully'));
                else throw new Error('edit grade failed');
              } else {
                const res = await axios.post('/api/grade', _values);
                if (res.status == 200) successProcess(t('A grad has been created successfully'));
                else throw new Error('created grade failed');
              }
            } catch (err) {
              console.error(err);
              showNotification(err.message, 'error');
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={0}>
                  {/* Lower mark */}
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
                      <b>{t('Lower mark')}:</b>
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
                    <TextField
                      error={Boolean(touched.lower_mark && errors.lower_mark)}
                      fullWidth
                      helperText={touched.lower_mark && errors.lower_mark}
                      name="lower_mark"
                      placeholder={t('Lower mark here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lower_mark}
                      variant="outlined"
                      type='number'
                    />
                  </Grid>

                  {/* Upper mark */}
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
                      <b>{t('Upper mark')}:</b>
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
                    <TextField
                      error={Boolean(touched.upper_mark && errors.upper_mark)}
                      fullWidth
                      helperText={touched.upper_mark && errors.upper_mark}
                      name="upper_mark"
                      placeholder={t('Upper mark here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.upper_mark}
                      variant="outlined"
                      type='number'
                    />
                  </Grid>

                  {/* point */}
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
                      <b>{t('Point')}:</b>
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
                    <TextField
                      error={Boolean(touched.point && errors.point)}
                      fullWidth
                      helperText={touched.point && errors.point}
                      name="point"
                      placeholder={t('Point here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.point}
                      variant="outlined"
                      type='number'
                    />
                  </Grid>

                  {/* grade */}
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
                      <b>{t('Grade')}:</b>
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
                    <TextField
                      error={Boolean(touched.grade && errors.grade)}
                      fullWidth
                      helperText={touched.grade && errors.grade}
                      name="grade"
                      placeholder={t('Grade here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.grade}
                      variant="outlined"
                      type='text'
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
                      {editGrade ? t('Edit grade') : t('Create grade')}
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
