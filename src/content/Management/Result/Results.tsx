import { ChangeEvent, useState, ReactElement, Ref, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Autocomplete, Grid, Slide, Divider, TablePagination, TextField, Button, Dialog, styled, useTheme, DialogTitle, DialogContent, CircularProgress, Checkbox, Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useNotistick from '@/hooks/useNotistick';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { registration_no_generate } from '@/utils/utilitY-functions';
import { AutoCompleteWrapper, EmptyAutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper, DisableButtonWrapper } from '@/components/ButtonWrapper';
import { CA } from 'country-flag-icons/react/3x2';
import { TableEmptyWrapper } from '@/components/TableWrapper';
import { TextFieldWrapper } from '@/components/TextFields';
import { DialogActionWrapper } from '@/components/DialogWrapper';


const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

interface Filters {
  status?: ProjectStatus;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});


const applyFilters = (
  schools: Project[],
  query: string,
  filters: Filters
): Project[] => {
  return schools?.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && project.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && project[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (
  schools: Project[],
  page: number,
  limit: number
): Project[] => {
  return schools.slice(page * limit, page * limit + limit);
};

const Results = ({ result, classes, selectClasses, setSelectClasses, setSections, sections, selectedSection, setSelectedSection, exams, setSelectedExam, selectedExam, handleSearchResult, academicYear, academicYearList, pdf }) => {
  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const [selectedItems, setSelectedUsers] = useState([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({ status: null });
  const theme = useTheme();

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredExams = applyFilters(result, query, filters);
  const paginatedExams = applyPagination(filteredExams, page, limit);
  const selectedSomeUsers =
    selectedItems.length > 0 && selectedItems.length < result.length;
  const selectedAllUsers = selectedItems.length === result.length;
  const selectedBulkActions = selectedItems.length > 0;


  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteSchoolId, setDeleteSchoolId] = useState(null);

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setDeleteSchoolId(null);
  };
  const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedUsers(event.target.checked ? result.map((i) => i.id) : []);
  };

  const handleDeleteCompleted = async () => {
    try {
      const result: any = await axios.delete(`/api/teacher/${deleteSchoolId}`);
      if (!result.data?.success) throw new Error('unsuccessful delete');
      setOpenConfirmDelete(false);
      showNotification('The schools has been deleted successfully');
    } catch (err) {
      setOpenConfirmDelete(false);
      showNotification('The school falied to delete ', 'error');
    }
  };

  const handleClassSelect = (event, newValue) => {
    setSelectClasses(newValue)
    if (newValue) {
      const targetClassSections = classes.find(i => i.id == newValue.id)
      setSections(targetClassSections?.sections?.map(i => {
        return {
          label: i.name,
          id: i.id
        }
      }))
      if (!newValue.has_section) {
        setSelectedSection({
          label: targetClassSections?.sections[0]?.name,
          id: targetClassSections?.sections[0]?.id
        })
      }
    }
  }
  const handleSelectOneUser = (
    _event: ChangeEvent<HTMLInputElement>,
    userId: string
  ): void => {
    if (!selectedItems.includes(userId)) {
      setSelectedUsers((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };
  // useEffect(() => {
  //   console.log("selected students__", selectedItems);

  // }, [selectedItems])
  return (
    <>
      <Card sx={{ display: "grid", maxWidth: 1000, mx: 'auto', gridTemplateColumns: { sm: "1fr 1fr 1fr auto" }, pt: 1, px: 1, columnGap: 1 }}>

        {/* select class */}
        {/* 
          <Grid
            sx={{
              mb: `${theme.spacing(3)}`
            }}
            item
            xs={12} sm={6} md={3}
            justifyContent="flex-end"
            textAlign={{ sm: 'right' }}
          >
            <Autocomplete
              id="tags-outlined"
              options={classes?.map(i => {
                return {
                  label: i.name,
                  id: i.id,
                  has_section: i.has_section
                }
              })}
              value={selectClasses}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  label={t('Select class')}
                />
              )}
              onChange={handleClassSelect}
            />

          </Grid> */}

        <AutoCompleteWrapper
          label={t('Select class')}
          placeholder={"selec a class..."}
          options={classes?.map(i => {
            return {
              label: i.name,
              id: i.id,
              has_section: i.has_section
            }
          })}
          value={selectClasses}
          filterSelectedOptions
          handleChange={handleClassSelect}
        />

        {
          (selectClasses && selectClasses.has_section && sections) ? <>
            {/* <Grid
                sx={{
                  mb: `${theme.spacing(3)}`
                }}
                item
                xs={12} sm={6} md={3}
                justifyContent="flex-end"
                textAlign={{ sm: 'right' }}
              >
                <Autocomplete
                  id="tags-outlined"
                  options={sections}
                  value={selectedSection}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select section"
                      placeholder="Favorites"
                    />
                  )}
                  onChange={(e, v) => {
                    setSelectedSection(v)
                  }}
                />

              </Grid> */}

            <AutoCompleteWrapper
              label="Select section"
              placeholder="select a section..."
              options={sections}
              value={selectedSection}
              filterSelectedOptions
              handleChange={(e, v) => {
                setSelectedSection(v)
              }}
            />
          </>
            :
            <EmptyAutoCompleteWrapper
              label="Select section"
              placeholder="select a section..."
              options={[]}
              value={undefined}
            />
        }
        {
          exams ? <>
            {/* <Grid
                sx={{
                  mb: `${theme.spacing(3)}`
                }}
                item
                xs={12} sm={6} md={3}
                justifyContent="flex-end"
                textAlign={{ sm: 'right' }}
              >
                <Autocomplete
                  id="tags-outlined"
                  options={exams}
                  value={selectedExam}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select exam"
                      placeholder="Favorites"
                    />
                  )}
                  onChange={(e, newvalue) => {
                    setSelectedExam(newvalue)
                  }}
                />

                
              </Grid> */}

            <AutoCompleteWrapper
              label="Select Exam"
              placeholder="select a exam..."
              options={exams}
              value={selectedExam}
              filterSelectedOptions
              handleChange={(e, newvalue) => {
                setSelectedExam(newvalue)
              }}
            />
          </>
            :
            <EmptyAutoCompleteWrapper
              label="Select Exam"
              placeholder="select a exam..."
              options={[]}
              value={undefined}
            />
        }
        {
          selectedExam ?
            <ButtonWrapper handleClick={handleSearchResult}>
              Find
            </ButtonWrapper>
            :
            <DisableButtonWrapper >
              Find
            </DisableButtonWrapper>
        }
      </Card>

      <Card sx={{ mt: 1 }}  >
        {selectedBulkActions && !pdf && (
          <Box p={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Typography variant="h5" color="text.secondary">
                  {t('Bulk actions')}:
                </Typography>
                <Button
                  sx={{
                    ml: 1
                  }}
                  variant="contained"
                  onClick={() => {
                    showNotification('Not possible for now !', 'error')
                  }}
                >
                  {t('Upgrate')}
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {paginatedExams.length === 0 ? (
          <>
            <TableEmptyWrapper
              title={"result"}
            />
          </>
        )
          :
          (
            <>
              {
                !selectedBulkActions && <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography component="span" variant="subtitle1">
                      {t('Showing')}:
                    </Typography>{' '}
                    <b>{paginatedExams.length}</b> <b>{t('result')}</b>
                  </Box>
                  <TablePagination
                    component="div"
                    count={filteredExams.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 15]}
                  />
                </Box>
              }

              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAllUsers}
                          indeterminate={selectedSomeUsers}
                          onChange={handleSelectAllUsers}
                        />
                      </TableCell>
                      <TableCell />
                      <TableCell>{t('class roll')}</TableCell>
                      <TableCell>{t('Total marks obtained')}</TableCell>
                      <TableCell>{t('Grade')}</TableCell>
                      {
                        !selectedBulkActions && !pdf && <TableCell>{t('Upgrade class')}</TableCell>
                      }

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedExams?.map((row) => {
                      const isUserSelected = selectedItems.includes(row.id);
                      return (
                        <>

                          <Row key={row.id}
                            selectedBulkActions={selectedBulkActions}
                            row={row}
                            classes={classes}
                            selectClasses={selectClasses}
                            academicYear={academicYear}
                            academicYearList={academicYearList}
                            isUserSelected={isUserSelected}
                            handleSelectOneUser={handleSelectOneUser}
                            pdf={pdf}
                          />
                        </>

                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
      </Card>

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this project')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

function Row(props) {
  const { row, classes, selectClasses, academicYear, academicYearList, selectedBulkActions,
    isUserSelected, handleSelectOneUser, pdf } = props;
  const [open, setOpen] = useState(false);
  const [rowSectionOpen, setRowSectionOpen] = useState(false);
  const [selectedUpgradeClass, setSelectedUpgradeClass] = useState(null);
  const { t }: { t: any } = useTranslation();
  const [sections, setSections] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const theme = useTheme();
  const { showNotification } = useNotistick();

  const handleClassSelect = (event, newValue, setFieldValue) => {

    setFieldValue('class_id', newValue ? newValue.id : undefined)


    setSelectedSection(null)
    setSelectedUpgradeClass(newValue)

    if (newValue) {
      const targetClassSections = classes.find(i => i.id == newValue.id)
      setSections(targetClassSections?.sections?.map(i => {
        return {
          label: i.name,
          id: i.id
        }
      }))
      if (!newValue.has_section) {
        setSelectedSection({ label: targetClassSections?.sections[0]?.name, id: targetClassSections?.sections[0]?.id })
        setFieldValue('section_id', targetClassSections?.sections[0]?.id)
      } else {
        setFieldValue('section_id', undefined)
      }
    } else {
      setFieldValue('section_id', undefined)
    }
  }

  const handleSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const successProcess = () => {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        setOpen(false)
      };
     
      _values['student_information_id'] = row.student.student_information?.id;
      
      if(!row.student.student_information?.id) throw new Error("failed to get student information id")
      
      const res = await axios.post(`/api/student/${row.student.student_information_id}/upgradeStudent`, _values)

      showNotification(res.data.message)
      successProcess();
    } catch (err) {

      showNotification(err?.response?.data?.message, 'error');
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t(`Upgrade Class`)}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to upgrade a student to a new class')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            section_id: undefined,
            academic_year_id: undefined,
            class_registration_no: registration_no_generate(),
            discount: 0,
            class_roll_no: undefined,
            submit: null
          }}
          validationSchema={Yup.object().shape({

            section_id: Yup.number().required(t('section_id is required')).nullable(false),
            academic_year_id: Yup.number().required(t('academic_year_id field is required')).nullable(false),
            class_registration_no: Yup.string().required(t('class_registration_no field is required')).nullable(false),
            class_roll_no: Yup.string().required(t('class_roll_no field is required')).nullable(false),
            discount: Yup.number().required(t('discount is required')).nullable(false),

          })}
          onSubmit={handleSubmit}
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

                  {/* select new academic year */}
                 
                  <AutoCompleteWrapper
                    minWidth="100%"
                    required={true}
                    label="Select new academic year"
                    placeholder="select a new academic year..."
                    errors={errors.academic_year_id}
                    filterSelectedOptions
                    touched={errors.academic_year_id}
                    options={academicYearList.filter(i => i.id !== academicYear.id).map(i => i)}
                    value={academicYearList.find((aca) => aca.id === values.academic_year_id) || null}
                    handleChange={(e, v) => setFieldValue('academic_year_id', v ? v.id : undefined)}
                  />
                  {/* Select class */}

                  <AutoCompleteWrapper
                    label="Select Class"
                    placeholder="select a class..."
                    minWidth="100%"
                    options={classes?.filter(i => i.id !== selectClasses.id)?.map(i => {
                      return {
                        label: i.name,
                        id: i.id,
                        has_section: i.has_section
                      }
                    })}
                    value={selectedUpgradeClass}
                    filterSelectedOptions
                    handleChange={(e, v) => handleClassSelect(e, v, setFieldValue)}
                  />

                  {/* Select section */}
                  {
                    (selectedUpgradeClass && selectedUpgradeClass.has_section && sections) ? <>

                      <AutoCompleteWrapper
                        minWidth="100%"
                        label="Select Section"
                        placeholder="select a section..."
                        options={sections}
                        value={selectedSection}
                        filterSelectedOptions
                        handleChange={(e, v) => {
                          setSelectedSection(v)
                          setFieldValue('section_id', v ? v.id : undefined)
                        }}
                      />
                    </>
                      :
                      <EmptyAutoCompleteWrapper
                        minWidth="100%"
                        label="Select Section"
                        placeholder="select a section..."
                        options={[]}
                        value={undefined}
                      />
                  }
                  {/* class roll */}

                  <TextFieldWrapper
                    errors={errors.class_roll_no}
                    touched={touched.class_roll_no}
                    name="class_roll_no"
                    label={t('New Roll No')}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.class_roll_no}
                  />

                  {/* class_registration_no */}

                  <TextFieldWrapper
                    errors={errors.class_registration_no}
                    touched={touched.class_registration_no}
                    name="class_registration_no"
                    label={t('Class Registration')}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.class_registration_no}
                  />

                  {/* discount */}

                  <TextFieldWrapper
                    errors={errors.discount}
                    touched={touched.discount}
                    name="discount"
                    label={t('Discount')}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.discount}
                    type='number'
                  />

                </Grid>

              </DialogContent>

              <DialogActionWrapper
                titleFront="Upgrade"
                title="Class"
                errors={errors}
                editData={undefined}
                handleCreateClassClose={() => setOpen(false)}
                isSubmitting={isSubmitting}

              />
            </form>
          )}
        </Formik>
      </Dialog >

      <TableRow >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isUserSelected}
            onChange={(event) => handleSelectOneUser(event, row.id)}
            value={isUserSelected}
          />
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setRowSectionOpen(!rowSectionOpen)}
          >
            {rowSectionOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row?.student?.class_roll_no}
        </TableCell>
        <TableCell >{row?.total_marks_obtained?.toFixed(2)}</TableCell>
        <TableCell >{row?.grade}</TableCell>
        {
          !selectedBulkActions && !pdf && <TableCell >
            {/* {row?.student?.id} */}
            <ButtonWrapper handleClick={() => setOpen(true)}>upgrade</ButtonWrapper>
          </TableCell>
        }

      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={rowSectionOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Subject wise marks
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject Nama</TableCell>
                    <TableCell>Subject Obtain marks</TableCell>
                    <TableCell >Subject Total marks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {
                    row?.result_details?.map(markRow =>
                      <TableRow key={markRow.id}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {markRow?.exam_details?.subject?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {markRow?.mark_obtained?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell ><Typography noWrap variant="h5">
                          {markRow?.exam_details?.subject_total?.toFixed(2)}
                        </Typography></TableCell>
                      </TableRow>

                    )
                  }
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Results.propTypes = {
  schools: PropTypes.array.isRequired
};

Results.defaultProps = {
  schools: []
};

export default Results;