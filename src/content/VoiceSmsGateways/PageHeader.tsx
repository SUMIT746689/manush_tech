import { Formik } from 'formik';
import { Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import useNotistick from '@/hooks/useNotistick';
import { TextFieldWrapper } from '@/components/TextFields';
import { verifyIsMasking } from 'utilities_api/verify';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { useEffect, useState } from 'react';
import { PageHeaderTitleWrapper } from '@/components/PageHeaderTitle';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import { DebounceInput } from '@/components/DebounceInput';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';


const SMSSettings = ({ schools, editData, seteditData, reFetchData }) => {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotistick();

  useEffect(() => {
    if (editData) handleCreateClassOpen();
  }, [editData]);

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    seteditData(null);
  };

  const handleCreateUserSuccess = () => {
    seteditData(null);
    setOpen(false);
  };
  const [searchValue, setSearchValue] = useState();
  const [query, setQuery] = useState();
  return (
    <>
      <PageHeaderTitleWrapper
        name="Voice SMS Gateways"
        handleCreateClassOpen={handleCreateClassOpen}
      />
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleCreateClassClose}
      >
        <Formik
          enableReinitialize
          initialValues={{
            id: editData?.id || null,
            sms_gateway: editData?.details?.sms_gateway || '',
            sender_id: editData?.details?.sender_id || '',
            school: schools.find((school) => school?.id === editData?.school_id) || null,
            school_id: editData?.school_id || null,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            school_id: Yup.number().required(t('The school id field is required')),
            sender_id: Yup.string().max(13).required(t('The sender_id field is required')),
          })}
          onSubmit={async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              const successResponse = (message) => {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
              };

              const v = {
                id: _values.id,
                school_id: _values.school_id,
                details: {
                  sender_id: _values.sender_id
                }
              }
              if (editData?.id) {
                axios.patch(`/api/voice_msgs/gateways/${editData?.id}`, v)
                  .then(res => {
                    showNotification('sms information updated!');
                    seteditData(() => { })
                    reFetchData();
                    handleCreateClassClose()
                  })
                  .catch(err => {
                    handleShowErrMsg(err, showNotification)
                    console.log(err);
                  })
              } else {
                axios.post('/api/voice_msgs/gateways', v)
                  .then(res => {
                    showNotification('sms information created successfully');
                    seteditData(() => { })
                    reFetchData();
                    handleCreateClassClose()
                  })
                  .catch(err => {
                    handleShowErrMsg(err, showNotification)
                    console.log(err);

                  })
              }

            } catch (err) {
              console.error(err);

              setStatus({ success: false });
              //@ts-ignore
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
            return (
              <>

                <form onSubmit={handleSubmit}>
                  <Grid container direction={'column'} alignItems={'center'} gap={1} marginTop={3}>
                    <DialogTitle sx={{ px: 3, py: 1 }} >
                      <Typography variant="h4" gutterBottom>
                        Voice Sms Gateway
                      </Typography>
                      <Typography variant="subtitle2">
                        {t(`Fill in the fields below to add or update voice sms gateway `)}
                      </Typography>
                    </DialogTitle>

                    <DialogContent dividers sx={{ minWidth: '100%', display: "grid", gap: 2 }} >
                      <Grid />

                      <AutoCompleteWrapper
                        minWidth="100%"
                        label={t('Select School')}
                        placeholder={t('select a school...')}
                        limitTags={2}
                        // getOptionLabel={(option) => option.id}
                        options={schools}
                        value={values.school}
                        handleChange={(e, v) => {
                          setFieldValue("school", v ? v : null);
                          setFieldValue("school_id", v ? v.id : null);
                        }}
                      />

                      <Grid>
                        {/* sender_id */}
                        <TextFieldWrapper
                          label="Sender Id"
                          errors={errors?.sender_id}
                          touched={touched?.sender_id}
                          name="sender_id"
                          //  placeholder={t(`sender_id here...`)}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          value={values?.sender_id}
                        />
                      </Grid>

                    </DialogContent>

                    <Grid ml={"auto"}>
                      <DialogActionWrapper
                        title="Voice Sms gateways"
                        handleCreateClassClose={handleCreateClassClose}
                        editData={editData}
                        errors={errors}
                        isSubmitting={isSubmitting}
                      />
                    </Grid>

                  </Grid>
                </form>
              </>
            );
          }}
        </Formik >
      </Dialog>
    </>
  );
};

// SMSSettings.getLayout = (page) => {
//   return (
//     <Authenticated requiredPermissions={['create_sms_gateway']}>
//       <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
//     </Authenticated>
//   );
// };

export default SMSSettings;