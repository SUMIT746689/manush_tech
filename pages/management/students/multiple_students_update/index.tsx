import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import Head from 'next/head';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import { Button, Card, Checkbox, Chip, Dialog, DialogTitle, Grid, Typography } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';

import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Results from 'src/content/Management/Students/MultipleStudentsUpdate/Results';
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
import { DisableTextWrapper, FileUploadFieldWrapper, NewFileUploadFieldWrapper } from '@/components/TextFields';
import dayjs from 'dayjs';
import useNotistick from '@/hooks/useNotistick';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { ButtonWrapper, SearchingButtonWrapper } from '@/components/ButtonWrapper';
import { handleShowErrMsg } from 'utilities_api/handleShowErrMsg';
import { read, utils } from 'xlsx';
import { handleCreateFileObj } from 'utilities_api/handleCreateFileObject';
import CloseIcon from '@mui/icons-material/Close';
import { Prisma } from '@prisma/client';

export async function getServerSideProps(context: any) {
  let student_columns = null;
  try {
    const columns = { ...Prisma.StudentInformationScalarFieldEnum, ...Prisma.StudentScalarFieldEnum };
    const without_photo_fields = {};
    // console.log({ columns });
    for (const property in columns) {
      if (
        ![
          'user_id',
          'id',
          'father_photo',
          'mother_photo',
          'student_photo',
          'guardian_photo',
          'created_at',
          'extra_section_id',
          'school_id',
          'student_information_id'
        ].includes(columns[property])
      )
        without_photo_fields[property] = columns[property];
      // console.log(`${property}: ${columns[property]}`);
    }
    student_columns = Object.keys(without_photo_fields);
  } catch (err) {
    console.log(err);
  }
  // const parseJson = JSON.parse(JSON.stringify(blockCount));

  return { props: { student_columns } };
}
function ManagementClasses({ student_columns }) {
  const [students, setStudents] = useContext<any[]>(Students);

  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const { user } = useAuth();
  const { showNotification } = useNotistick();

  const [sections, setSections] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedUpdateColumns, setSelectedUpdateColumns] = useState([]);
  const [finalSelectedUpdateColumns, setFinalSelectedUpdateColumns] = useState([]);

  const { data: classes } = useClientFetch(`/api/class?school_id=${user?.school_id}`);

  useEffect(() => {
    if (selectedClass && academicYear && selectedSection) handleStudentList();
  }, [selectedClass, academicYear, selectedSection]);

  useEffect(() => {
    if (students?.selectedClass) {
      setSelectedClass(students?.selectedClass);
      axios.get(`/api/class/${students?.selectedClass?.id}`).then((res) => {
        const sections = res?.data?.sections?.map((i) => ({
          label: i.name,
          id: i.id
        }));
        sections.push({
          label: 'All sections',
          id: 'all'
        });
        setSections(sections);
        if (students?.selectedSection) {
          setSelectedSection(sections?.find((i) => i.id == students?.selectedSection?.id));
        }
      });
    }
  }, [!selectedClass, !selectedSection]);

  const handleStudentList = () => {
    if (selectedUpdateColumns.length === 0) return showNotification('select at least one update column', 'error');
    setFinalSelectedUpdateColumns(selectedUpdateColumns);

    if (academicYear && selectedSection) {
      axios
        .get(
          `/api/student/?${selectedSection.id == 'all' ? `class_id=${selectedClass?.id}` : `section_id=${selectedSection?.id}`}&academic_year_id=${
            academicYear?.id
          }`
        )
        .then((res) => {
          console.log('ref__', res.data);
          setStudents({ AllStudents: res.data, selectedClass, selectedSection });
        });
    }
  };

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
      });
      sections.push({
        label: 'All sections',
        id: 'all'
      });
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

  return (
    <>
      <Head>
        <title>Multipe Students Update- Management</title>
      </Head>

      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Multiple Students Update Management')}
            </Typography>
            <Typography variant="subtitle2">{t('All aspects related to the students update can be managed from this page')}</Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>

      <Card sx={{ mx: { sm: 4, xs: 1 }, pr: 1, py: 1, mb: 1, display: 'flex', flexWrap: 'wrap', columnGap: 0.5 }}>
        <SelectUpdateColumn
          student_columns={student_columns}
          selectedUpdateColumns={selectedUpdateColumns}
          setSelectedUpdateColumns={setSelectedUpdateColumns}
        />
      </Card>

      <Card
        sx={{
          mx: { sm: 4, xs: 1 },
          p: 1,
          pb: 0,
          mb: 1,
          display: 'grid',
          gridTemplateColumns: { sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr auto' },
          columnGap: 1
        }}
      >
        {/* select class */}

        <AutoCompleteWrapper
          label="Select class"
          placeholder="Class..."
          options={
            classes?.map((i) => {
              return {
                label: i.name,
                id: i.id,
                has_section: i.has_section
              };
            }) || []
          }
          value={selectedClass}
          handleChange={handleClassSelect}
        />

        {selectedClass && selectedClass.has_section && sections ? (
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
        ) : (
          <DisableTextWrapper label="Select section" touched={undefined} errors={undefined} value={undefined} />
        )}
        <ButtonWrapper disabled={!selectedSection} handleClick={handleStudentList}>
          Search
        </ButtonWrapper>

        {/* <Grid>
                    <ExportData students={students?.AllStudents} />
                </Grid> */}
      </Card>

      <Grid sx={{ px: 1 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={1}>
        <Grid item xs={12}>
          <Results
            students={
              students?.AllStudents?.map((student) => {
                const tempstd = { id: student.id };
                finalSelectedUpdateColumns?.map((field) => {
                  tempstd[field] = student[field] || student?.student_info[field];
                });
                return tempstd;
              }) || []
            }
            refetch={handleStudentList}
            selectedUpdateColumns={finalSelectedUpdateColumns}
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

const SelectUpdateColumn = ({ student_columns, selectedUpdateColumns, setSelectedUpdateColumns }) => {
  const handleSelectStudentUpdateCols = (event: any, key) => {
    const checked = event.target?.checked;
    if (typeof checked !== 'boolean') return;
    if (checked) return setSelectedUpdateColumns((alreadyCols) => [...alreadyCols, key]);
    setSelectedUpdateColumns((alreadyCols) => {
      const filteredCols = alreadyCols.filter((value) => value !== key);
      return filteredCols;
    });
  };

  return (
    <>
      <Grid container px={1} fontWeight={500}>
        Updated Column: *
      </Grid>
      {student_columns.map((key, index) => (
        <>
          <Grid key={index}>
            {' '}
            <Checkbox
              checked={selectedUpdateColumns.includes(key) ? true : false}
              size="small"
              sx={{ width: 30, height: 30 }}
              onClick={(event) => handleSelectStudentUpdateCols(event, key)}
            />{' '}
            {key}{' '}
          </Grid>
        </>
      ))}
    </>
  );
};
