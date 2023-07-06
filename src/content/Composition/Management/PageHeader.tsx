import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { wait } from 'src/utils/wait';
// import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import {
  styled,
  Grid,
  Dialog,
  DialogTitle,
  Divider,
  Alert,
  Chip,
  DialogContent,
  Box,
  Zoom,
  ListItem,
  List,
  ListItemText,
  Typography,
  TextField,
  CircularProgress,
  Avatar,
  Autocomplete,
  Button,
  useTheme,
  Select,
  MenuItem
} from '@mui/material';
// import DatePicker from '@mui/lab/DatePicker';
// import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';

// import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
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

function PageHeader(props): any {
  const { name, editData, seteditData, path } = props;
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  // const members = [
  //   {
  //     avatar: '/static/images/avatars/1.jpg',
  //     title: 'Maren Lipshutz'
  //   },
  //   {
  //     avatar: '/static/images/avatars/2.jpg',
  //     title: 'Zain Vetrovs'
  //   },
  //   {
  //     avatar: '/static/images/avatars/3.jpg',
  //     title: 'Hanna Siphron'
  //   },
  //   {
  //     avatar: '/static/images/avatars/4.jpg',
  //     title: 'Cristofer Aminoff'
  //   },
  //   {
  //     avatar: '/static/images/avatars/5.jpg',
  //     title: 'Maria Calzoni'
  //   }
  // ];

  // const {
  //   acceptedFiles,
  //   isDragActive,
  //   isDragAccept,
  //   isDragReject,
  //   getRootProps,
  //   getInputProps
  // } = useDropzone({
  //   accept: {
  //     'image/png': ['.png'],
  //     'image/jpeg': ['.jpg']
  //   }
  // });

  // const files = acceptedFiles.map((file, index) => (
  //   <ListItem disableGutters component="div" key={index}>
  //     <ListItemText primary={file.title} />
  //     <b>{file.size} bytes</b>
  //     <Divider />
  //   </ListItem>
  // ));

  // const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (editData) {
      handleCreateProjectOpen();
    }
  }, [editData]);

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
    seteditData(null);
  };

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar(t('A new Sessions has been created successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t(name)}
          </Typography>
          <Typography variant="subtitle2">
            {t(`These are your active ${name}`)}
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
            {t(`Create new ${name}`)}
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
            {editData ? t(`Edit ${name}`) : t(`Create new ${name}`)}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              `Use this dialog window to ${
                editData ? 'Edit ' : 'add a new'
              } ${name}`
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={props.initialValues()}
          validationSchema={Yup.object().shape(props.validationSchemas)}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            console.log({_values})
            try {
              const successProcess = () => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess();
              };
              if (editData) {
                const res = await axios.patch(
                  `${path}/${editData.id}`,
                  _values
                );
                console.log({ res });
                if (res.data?.success) successProcess();
                else throw new Error(`edit ${name} failed`);
              } else {
                const res = await axios.post(path, _values);
                console.log({ res });
                if (res.data?.success) successProcess();
                else throw new Error(`created ${name} failed`);
              }
            } catch (err) {
              console.error(err);
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
                  {props.render(
                    errors,
                    handleBlur,
                    handleChange,
                    isSubmitting,
                    touched,
                    values,
                    setFieldValue
                  )}

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
                      {editData ? t(`Edit ${name}`) : t(`Create ${name}`)}
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
