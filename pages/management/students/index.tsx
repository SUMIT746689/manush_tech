import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import Head from 'next/head';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';


import { Button, Card, Grid, Typography } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';

import PageTitleWrapper from 'src/components/PageTitleWrapper';


import Results from 'src/content/Management/Students/Results';
// import RegistrationFirstPart from '@/content/Management/Students/RegistrationFirstPart';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AcademicYearContext, Students } from '@/contexts/UtilsContextUse';
import { useRef } from 'react';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useAuth } from '@/hooks/useAuth';
import { useClientFetch } from '@/hooks/useClientFetch';
import Footer from '@/components/Footer';
import { ExportData } from '@/content/Management/Students/ExportData';
import { FileUploadFieldWrapper } from '@/components/TextFields';
import dayjs from 'dayjs';
import useNotistick from '@/hooks/useNotistick';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper, SearchingButtonWrapper } from '@/components/ButtonWrapper';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';

function ManagementClasses() {

  const [students, setStudents] = useContext<any[]>(Students);

  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth();
  const { showNotification } = useNotistick();

  const [sections, setSections] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [discount, setDiscount] = useState([]);
  const [fee, setFee] = useState([]);
  const [isLoadingBulkStdUpload, setIsLoadingBulkStdUpload] = useState(false);

  const idCard = useRef();

  const [excelFileUpload, setExcelFileUpload] = useState(null);

  const { data: classes } = useClientFetch(`/api/class?school_id=${user?.school_id}`);

  useEffect(() => {
    if (selectedClass && academicYear && selectedSection) handleStudentList()
  }, [selectedClass, academicYear, selectedSection])

  useEffect(() => {
    if (students?.selectedClass) {
      setSelectedClass(students?.selectedClass)
      axios.get(`/api/class/${students?.selectedClass?.id}`)
        .then(res => {
          const sections = res?.data?.sections?.map((i) => ({
            label: i.name,
            id: i.id
          }))
          sections.push({
            label: 'All sections',
            id: 'all'
          })
          setSections(sections);
          if (students?.selectedSection) {
            setSelectedSection(sections?.find(i => i.id == students?.selectedSection?.id))
          }
        })
    }
  }, [!selectedClass, !selectedSection])

  useEffect(() => {
    if (selectedClass && academicYear) {
      axios.get(`/api/discount?class_id=${selectedClass?.id}&academic_year_id=${academicYear?.id}`)
        .then(res => {
          console.log("discount__", res.data);
          setDiscount(res.data?.map(i => ({
            label: `${i?.title} (${i?.amt} ${i?.type})`,
            id: i.id
          }))
          )
        })
        .catch(err => console.log(err))
      axios.get(`/api/fee?class_id=${selectedClass?.id}&academic_year_id=${academicYear?.id}`)
        .then(res => setFee(res?.data?.data?.map(i => ({
          label: i.title,
          id: i.id
        }))))
        .catch(err => console.log(err));
    }

  }, [selectedClass, academicYear])

  const handleStudentList = () => {

    if (academicYear && selectedSection) {
      axios
        .get(
          `/api/student/?${selectedSection.id == 'all' ? `class_id=${selectedClass?.id}` : `section_id=${selectedSection?.id}`}&academic_year_id=${academicYear?.id}`
        )
        .then((res) => {
          console.log('ref__', res.data);
          setStudents({ AllStudents: res.data, selectedClass, selectedSection });

        });
    }

  }

  const handleClassSelect = (event, newValue) => {

    setSelectedClass(newValue);
    setSelectedSection(null);
    setStudents(null);

    if (newValue) {
      const targetClassSections = classes.find((i) => i.id == newValue.id);
      const sections = targetClassSections?.sections?.map((i) => {
        return {
          label: i.name,
          id: i.id
        };
      })
      sections.push({
        label: 'All sections',
        id: 'all'
      })
      setSections(sections);
      if (!newValue.has_section) {
        setSelectedSection({
          label: targetClassSections?.sections[0]?.name,
          id: targetClassSections?.sections[0]?.id
        });
      } else {
        setSelectedSection(null);
      }
    }
  };

  const handleSendToRegistrationPage = () => {
    router.push('/management/students/registration');
  };

  const handleExcelUpload = () => {
    // console.log(excelFileUpload);
    setIsLoadingBulkStdUpload(true);
    if (excelFileUpload) {
      const form = new FormData();
      if (!selectedClass?.id || !selectedSection?.id) {
        setIsLoadingBulkStdUpload(false);
        return showNotification("class/section not selected", "error");
      }
      if (typeof selectedSection?.id !== "number") {
        setIsLoadingBulkStdUpload(false);
        return showNotification("select a single section", "error");
      }
      form.append('students', excelFileUpload);
      form.append('class_id', selectedClass.id);
      form.append('section_id', selectedSection.id);

      axios
        .post('/api/student/bulk-admission', form)
        .then((res) => {
          setExcelFileUpload(null);
          showNotification(t('All students data inserted'))
        })
        .catch((err) => {
          handleShowErrMsg(err, showNotification);
        })
        .finally(() => { setIsLoadingBulkStdUpload(false) })
    }
  };
  const handlePrint = useReactToPrint({
    content: () => idCard.current,
    // pageStyle: `@media print {
    //   @page {
    //     size: 210mm 115mm;
    //   }
    // }`
  });
  // size: 85.725mm 53.975mm;

  return (
    <>
      <Head>
        <title>Students - Management</title>
      </Head>

      <PageTitleWrapper>

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item >
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Student Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the students can be managed from this page'
              )}
            </Typography>
          </Grid>

          <Grid item my="auto">
            <ButtonWrapper handleClick={handleSendToRegistrationPage}>
              {t('Registration student')}
            </ButtonWrapper>
          </Grid>

        </Grid>
      </PageTitleWrapper>

      <Card sx={{ mx: { sm: 4, xs: 1 }, p: 1, pb: 0, mb: 2, display: "grid", gridTemplateColumns: { sm: "1fr 1fr", md: "1fr 1fr 1fr" }, columnGap: 1 }}>

        <ButtonWrapper handleClick={undefined} href={`/Student-Bulk-Import-Sample.xlsx`}>
          Download Excel format
        </ButtonWrapper>

        <Grid >
          <FileUploadFieldWrapper
            htmlFor="excelUpload"
            label="select Excel file"
            name="excelUpload"
            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            value={excelFileUpload?.name || ''}
            handleChangeFile={(e) => {
              if (e.target?.files?.length && e.target.files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                setExcelFileUpload(e.target.files[0])
              }
            }}
            handleRemoveFile={(e) => { setExcelFileUpload(null) }}
          />
        </Grid>

        <SearchingButtonWrapper isLoading={isLoadingBulkStdUpload} disabled={excelFileUpload ? false : true} handleClick={handleExcelUpload}>
          {t('Bulk admission')}
        </SearchingButtonWrapper>

      </Card>

      <Card sx={{ mx: { sm: 4, xs: 1 }, p: 1, pb: 0, mb: 1, display: "grid", gridTemplateColumns: { sm: "1fr 1fr 1fr", md: "1fr 1fr 1fr 1fr auto" }, columnGap: 1 }}>
        {/* select class */}

        <AutoCompleteWrapper
          label="Select class"
          placeholder="Class..."
          options={classes?.map((i) => {
            return {
              label: i.name,
              id: i.id,
              has_section: i.has_section
            };
          }) || []}
          value={selectedClass}
          handleChange={handleClassSelect}
        />


        {selectedClass && selectedClass.has_section && sections && (
          <AutoCompleteWrapper
            label="Select section"
            placeholder="Section..."
            options={sections}
            value={selectedSection}
            handleChange={(e, v) => {
              setSelectedSection(v);
              setStudents(null);
            }}
          />

        )}
        {
          selectedSection &&
          <ButtonWrapper handleClick={handleStudentList}> Find</ButtonWrapper>

        }
        {students?.AllStudents?.length > 0 && (

          <ButtonWrapper
            handleClick={handlePrint}
            startIcon={<LocalPrintshopIcon />}
          >
            Print Id Card
          </ButtonWrapper>

        )}
        <Grid>
          <ExportData students={students?.AllStudents} />
        </Grid>

      </Card>

      <Grid
        sx={{ px: 1 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results students={students?.AllStudents || []}
            refetch={handleStudentList}
            discount={discount}
            fee={fee}
            idCard={idCard}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="student">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
