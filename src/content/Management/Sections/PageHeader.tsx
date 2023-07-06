import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

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
  Button,
  Select,
  MenuItem,
  Chip,
  Box,
  SelectChangeEvent,
  InputLabel,
  FormControl
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'axios';
import useNotistick from '@/hooks/useNotistick';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function PageHeader({ editSection, setEditSection, reFetchData }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassGroup, setSelectedClassGroup] = useState(null);
  const { showNotification } = useNotistick();

  const [personName, setPersonName] = React.useState<string[]>([]);

  useEffect(() => {
    if (!editSection) return;
    handleCreateClassOpen();
    setPersonName(
      editSection.groups?.map((group) => ({
        label: group.title,
        value: group.id
      }))
    );
    getSelectedClassGroup(editSection.class_id);
  }, [editSection]);

  const getSelectedClassGroup = (class_id) => {
    axios
      .get(`/api/group?class_id=${class_id}`)
      .then((res) =>
        setSelectedClassGroup(
          res.data?.map((i) => {
            return {
              label: i.title,
              value: i.id
            };
          })
        )
      )
      .catch((err) => console.log(err));
  };

  const handleCreateClassOpen = () => {
    setOpen(true);
  };

  const handleCreateClassClose = () => {
    setOpen(false);
    setEditSection(null);
    setPersonName([]);
    setSelectedClassGroup(null);
  };

  const handleCreateUserSuccess = (message) => {
    showNotification(message, 'success');
    setOpen(false);
    setEditSection(null);
    setPersonName([]);
    setSelectedClassGroup(null);
  };

  useEffect(() => {
    axios
      .get('/api/class')
      .then((res) =>
        setClasses(
          res.data?.map((i) => {
            return {
              label: i.name,
              value: i.id
            };
          })
        )
      )
      .catch((err) => console.log(err));

    axios
      .get('/api/teacher')
      .then((res) => {
        setTeachers(
          res.data?.map((teacher) => {
            return {
              label: teacher.user.username,
              value: teacher.id
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      if (editSection)
        axios
          .patch(`/api/section/${editSection.id}`, {
            ..._values,
            group_ids: Array.from(personName, (v: any) => v.value)
          })
          .then((res) => {
            console.log({ res });
            if (res.data.success) {
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateUserSuccess(
                t('The section was updated successfully')
              );
              reFetchData();
            } else throw new Error(' Updated Unsuccessfull');
          });
      else
        axios
          .post(`/api/section`, {
            ..._values,
            group_ids: Array.from(personName, (v: any) => v.value)
          })
          .then(() => {
            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            handleCreateUserSuccess(t('The section was created successfully'));
            reFetchData();
          });
    } catch (err) {
      console.error(err);
      showNotification(t('There was an error, try again later'), 'error');
      setStatus({ success: false });
      // @ts-ignore
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleChangePerson = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event;
    // @ts-ignore
    setPersonName((groups:any) =>{
      // const find = groups.find(group => group.value === value.value);
      // if(!find) return ([...groups,...value])
      // return groups
      return value
    })
      // On autofill we get a stringified value.
      // typeof value === 'string' ? value.split(',') : value))
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Section Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the sections can be managed from this page'
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateClassOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t(editSection ? 'Edit Section' : 'Create Section')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateClassClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(editSection ? 'Edit a Section' : 'Add new Section')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new section')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: editSection?.name || undefined,
            class_id: editSection?.class_id || undefined,
            // group_id: editSection?.group_id || null,
            class_teacher_id: editSection?.class_teacher_id || null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(255)
              .required(t('The Section name field is required')),
            class_id: Yup.number().positive().integer()
          })}
          onSubmit={handleFormSubmit}
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
          }) => {
            return (
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
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label={t('Section name')}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        disablePortal
                        value={
                          classes.find(
                            (cls) => cls.value === values.class_id
                          ) || null
                        }
                        options={classes}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label={t('Select class')}
                          />
                        )}
                        // @ts-ignore
                        onChange={(event, value) => {
                          setFieldValue('class_id', value?.value || null);
                          setFieldValue('group_id', null);
                          if (value) {
                            getSelectedClassGroup(value.value);
                          } else {
                            setSelectedClassGroup(null);
                          }
                        }}
                      />
                    </Grid>

                    {selectedClassGroup && (
                      <Grid item xs={12} md={6}>
                        <FormControl
                          variant="outlined"
                          style={{ width: '100%' }}
                          // size="small"
                        >
                          <InputLabel id="test-select-label">
                            Select Groups
                          </InputLabel>
                          <Select
                            labelId="test-select-label"
                            id="test-select"
                            fullWidth
                            // size="small"
                            label="Select Groups"
                            multiple
                            value={personName}
                            onChange={handleChangePerson}
                            variant="outlined"
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5
                                }}
                              >
                                {selected?.map((value: any) => (
                                  <Chip key={value.value} label={value.label} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {selectedClassGroup?.map((group) => (
                              <MenuItem
                                key={group.value}
                                value={group}
                                // style={getStyles(selectedClassGroup, personName, theme)}
                              >
                                {group?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    {/* {selectedClassGroup && (
                      <Grid item xs={12} md={6}>
                        {' '}
                        <Autocomplete
                          disablePortal
                          value={
                            selectedClassGroup.find(
                              (grp) => grp.value === values.group_id
                            ) || null
                          }
                          options={selectedClassGroup}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label={t('Select Group')}
                            />
                          )}
                          // @ts-ignore
                          onChange={(event, value) => {
                            if (value) {
                              setFieldValue('group_id', value.value);
                            } else {
                              setFieldValue('group_id', null);
                            }
                          }}
                        />
                      </Grid>
                    )} */}

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        disablePortal
                        value={
                          teachers.find(
                            (teacher) =>
                              teacher.value === values.class_teacher_id
                          ) || null
                        }
                        options={teachers}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label={t('Select class teacher')}
                          />
                        )}
                        // @ts-ignore
                        onChange={(event, value) =>
                          setFieldValue(
                            'class_teacher_id',
                            value?.value || null
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{
                    p: 3
                  }}
                >
                  <Button color="secondary" onClick={handleCreateClassClose}>
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
                    {t(editSection ? 'Edit Section' : 'Add new section')}
                  </Button>
                </DialogActions>
              </form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
