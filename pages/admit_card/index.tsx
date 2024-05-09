import Head from 'next/head';
import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Grid, Typography } from '@mui/material';
import { AutoCompleteWrapperWithDebounce } from '@/components/AutoCompleteWrapper';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';
import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
import { useClientFetch } from 'src/hooks/useClientFetch';
import React, { ChangeEvent, useState } from 'react';

const AdmitCard = () => {
  const { data: classData, error: classError } = useClientFetch('/api/class');
  const [sections, setSections] = useState<Array<any>>([]);
  const [selectedSection, setSelectedSection] = useState(null);
  console.log('Hello classData');
  console.log(classData);

  const handleClassSelect = (
    event: ChangeEvent<HTMLInputElement>,
    newValue
  ) => {
    // setSessions([]);
    // setSelectedFees([]);
    // setSelectedItems([]);

    if (newValue) {
      const targetClassSections = classData.find((i) => i.id == newValue.id);

      setSections(
        targetClassSections?.sections?.map((i) => {
          return {
            label: i.name,
            id: i.id
          };
        })
      );
      if (!newValue.has_section) {
        setSelectedSection({
          label: targetClassSections?.sections[0]?.name,
          id: targetClassSections?.sections[0]?.id
        });
      } else {
        setSelectedSection(null);
      }
    } else {
      setSections([]);
      // setStudents([]);
      setSelectedSection(null);
      // setSelectedStudent(null);
    }
  };

  return (
    <>
      <Head>
        <title>Student Admit_Card</title>
      </Head>

      {/* searching part code start */}
      <Grid
        px={4}
        mt={1}
        display="grid"
        gridTemplateColumns="1fr"
        rowGap={{ xs: 1, md: 0 }}
        mx={1}
        minHeight="fit-content"
      >
        {/* split your code start */}
        <Grid
          sx={{
            borderRadius: 0.5,
            overflow: 'hidden',
            border: (themes) => `1px dashed ${themes.colors.primary.dark}`,
            backgroundColor: '#fff'
          }}
        >
          <Grid
            sx={{
              borderRadious: 0,
              background: (themes) => themes.colors.primary.dark,
              py: 1,
              px: 1,
              color: 'white',
              fontWeight: 700,
              textAlign: 'left'
            }}
          >
            Search
          </Grid>

          <Grid
            sx={{
              p: 2
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                columnGap: '20px',
                rowGap: '0',
                flexWrap: 'wrap'
              }}
            >
              {/* Exam field */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={[]}
                  value={''}
                  label="Select Exam"
                  placeholder="select an exam"
                  handleChange={() => {}}
                />
              </Grid>
              {/* Class field */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={
                    classData?.map((i) => {
                      return {
                        label: i.name,
                        id: i.id,
                        has_section: i.has_section
                      };
                    }) || []
                  }
                  value={undefined}
                  label="Select Class"
                  placeholder="select a class"
                  handleChange={handleClassSelect}
                />
              </Grid>

              {/* Section field */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={sections}
                  value={selectedSection}
                  label="Select Section"
                  placeholder="select a section"
                  handleChange={(e, v) => {
                    setSelectedSection(v);
                    // setStudents(() => []);
                    // setSessions([]);
                    // setSelectedStudent(null);
                    // setSelectedFees([]);
                    // setSelectedItems([]);
                  }}
                />
              </Grid>
              {/* Student list */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1
                }}
              >
                <AutoCompleteWrapper
                  options={[]}
                  value={''}
                  label="Select Student"
                  placeholder="select a student"
                  handleChange={() => {}}
                />
              </Grid>
              {/* Search button */}
              <Grid
                sx={{
                  flexBasis: '15%',
                  flexGrow: 1,
                  position: 'relative'
                }}
              >
                <Grid sx={{ position: 'absolute', bottom: 0 }}>
                  <SearchingButtonWrapper
                    isLoading={false}
                    handleClick={() => {}}
                    disabled={false}
                    children={'Search'}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* split your code end */}
      </Grid>
      {/* searching part code end */}
    </>
  );
};

AdmitCard.getLayout = (page) => (
  //   <Authenticated name="Admit_Card">
  <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  //   </Authenticated>
);

export default AdmitCard;
