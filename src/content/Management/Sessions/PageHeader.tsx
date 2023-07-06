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

// import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
// import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
// import PageTitleWrapper from 'src/components/PageTitleWrapper';

// const BoxUploadWrapper = styled(Box)(
//   ({ theme }) => `
//     border-radius: ${theme.general.borderRadius};
//     padding: ${theme.spacing(3)};
//     background: ${theme.colors.alpha.black[5]};
//     border: 1px dashed ${theme.colors.alpha.black[30]};
//     outline: none;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     transition: ${theme.transitions.create(['border', 'background'])};

//     &:hover {
//       background: ${theme.colors.alpha.white[100]};
//       border-color: ${theme.colors.primary.main};
//     }
// `
// );

// const EditorWrapper = styled(Box)(
//   ({ theme }) => `

//     .ql-editor {
//       min-height: 100px;
//     }

//     .ql-toolbar.ql-snow {
//       border-top-left-radius: ${theme.general.borderRadius};
//       border-top-right-radius: ${theme.general.borderRadius};
//     }

//     .ql-toolbar.ql-snow,
//     .ql-container.ql-snow {
//       border-color: ${theme.colors.alpha.black[30]};
//     }

//     .ql-container.ql-snow {
//       border-bottom-left-radius: ${theme.general.borderRadius};
//       border-bottom-right-radius: ${theme.general.borderRadius};
//     }

//     &:hover {
//       .ql-toolbar.ql-snow,
//       .ql-container.ql-snow {
//         border-color: ${theme.colors.alpha.black[50]};
//       }
//     }
// `
// );

// const AvatarWrapper = styled(Avatar)(
//   ({ theme }) => `
//     background: ${theme.colors.primary.lighter};
//     color: ${theme.colors.primary.main};
//     width: ${theme.spacing(7)};
//     height: ${theme.spacing(7)};
// `
// );

// const AvatarSuccess = styled(Avatar)(
//   ({ theme }) => `
//     background: ${theme.colors.success.light};
//     width: ${theme.spacing(7)};
//     height: ${theme.spacing(7)};
// `
// );

// const AvatarDanger = styled(Avatar)(
//   ({ theme }) => `
//     background: ${theme.colors.error.light};
//     width: ${theme.spacing(7)};
//     height: ${theme.spacing(7)};
// `
// );

// const projectTags = [
//   { title: 'Development' },
//   { title: 'Design Project' },
//   { title: 'Marketing Research' },
//   { title: 'Software' }
// ];

function PageHeader({ editSession, setEditSession, reFetchData }): any {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();
  const theme = useTheme();


  useEffect(() => {
    if (editSession) {
      handleCreateProjectOpen();
    }
  }, [editSession]);

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
    setEditSession(null);
  };

  const handleCreateProjectSuccess = () => {
    showNotification('A new Sessions has been created successfully');

    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Sessions')}
          </Typography>
          <Typography variant="subtitle2">
            {t('These are your active Sessions')}
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
            {t('Create new Session')}
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
            {editSession ? t('Edit Session') : t('Create new Session')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              `Use this dialog window to ${
                editSession ? 'Edit ' : 'add a new'
              } session`
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: editSession?.title ? editSession.title : '',
            school_id: editSession?.school?.id ? editSession?.school?.id : '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('The title field is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const successProcess = () => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess();
                reFetchData();
              };
              if (editSession) {
                const res = await axios.patch(
                  `/api/sessions/${editSession.id}`,
                  _values
                );
                if (res.data?.success) {
                  setEditSession(null)
                  successProcess();
                } else throw new Error('edit session failed');
              } else {
                const res = await axios.post('/api/sessions', _values);
                console.log({ res });
                if (res.data?.success) successProcess();
                else throw new Error('created session failed');
              }
            } catch (err) {
              console.error(err);
              showNotification(err.message,'error');
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
                      <b>{t('Title')}:</b>
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
                      error={Boolean(touched.title && errors.title)}
                      fullWidth
                      helperText={touched.title && errors.title}
                      name="title"
                      placeholder={t('Session title here...')}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.title}
                      variant="outlined"
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
                      {editSession ? t('Edit Session') : t('Create Session')}
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
