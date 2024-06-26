import { FC, ChangeEvent, useState } from 'react';
import { Card, Divider, TableCell, TableRow, Grid, Tooltip, IconButton, Box, Dialog } from '@mui/material';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import { TableContainerWrapper, TableEmptyWrapper, TableHeadWrapper } from '@/components/TableWrapper';
import dayjs from 'dayjs';
import { GenerateCertificate, GenerateCertificateExport } from '@/components/Export/certificate';
import { DatePickerWrapper } from '@/components/DatePickerWrapper';
import CsvExport from '@/components/Export/Csv';
import { UncontrolledTextFieldWrapper } from '@/components/TextFields';
import PreviewIcon from '@mui/icons-material/Preview';

interface ResultsProps {
  student?: any;
  teacher?: any;
  templates: any;
  certificateFor: "teacher" | "student"
}

interface Filters {
  status?: ProjectStatus;
}

const applyFilters = (
  sessions: Project[],
  query: string,
  filters: Filters
): Project[] => {
  console.log({ sessions })
  return sessions?.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['title', 'id', 'amount'];
      let containsQuery = false;

      // properties.forEach((property) => {
      //   if (project[property]?.toString().toLowerCase().includes(query.toLowerCase())) {
      //     containsQuery = true;
      //   }
      // });

      // if (filters.status && project.status !== filters.status) {
      //   matches = false;
      // }

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
  sent_sms: Project[],
  page: number,
  limit: number
): Project[] => {
  return sent_sms.slice(page * limit, page * limit + limit);
};

const StudentTeacharResults: FC<ResultsProps> = ({ certificateFor, templates, student, teacher }) => {
  const [selectedItems, setSelectedschools] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [selectedTemplate, setSelectedTemplate] = useState<any>();
  const [printDate, setPrintDate] = useState<any>(dayjs(Date.now()));


  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredschools = applyFilters(templates, query, filters);
  const paginatedFees = applyPagination(filteredschools, page, limit);
  const selectedBulkActions = selectedItems.length > 0;

  const handleDateChange = (e) => setPrintDate(dayjs(e));
  const export_data = () => {
    const filter_students = student.filter(std => selectedItems.includes(std.id));
    const findTemplate = templates.find(tmp => selectedTemplate === tmp.id);
    const customize_data = filter_students.map((student, index) => ({
      SL: index + 1,
      Certificate: findTemplate?.name,
      'Applicable User': 'student',
      'Name': student.student_info?.first_name + (student.student_info?.middle_name || " ") + (student.student_info?.last_name || " "),
      'Registration No.': student.class_registration_no,
      'Roll No.': student.class_registration_no,
      'Page Layout': findTemplate?.page_layout
    }));
    return customize_data;
  }
  
  return (
    <>

      <Dialog
        fullWidth
        maxWidth="md"
        open={selectedTemplate} onClose={() => setSelectedTemplate(null)}
      >
        <Box padding={4} >
          {selectedTemplate && <GenerateCertificate _for={certificateFor === "student" ? 'student' : 'employee'} publicationDate={printDate} datas={certificateFor === "student" ? [student] : [teacher]} template={selectedTemplate} />}
        </Box>

      </Dialog>


      {certificateFor === "student"
        &&
        <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr 1fr min-content' }, gap: { sm: 1 } }}>
          <Grid>
            <UncontrolledTextFieldWrapper label="Name" value={student.student_info?.first_name + (student.student_info?.middle_name || " ") + (student.student_info?.last_name || " ")} />
          </Grid>
          <Grid>
            <UncontrolledTextFieldWrapper label="Class" value={student.section?.class?.name} />
          </Grid>
          <Grid >
            <UncontrolledTextFieldWrapper label="Batch" value={student.section.class.has_section ? student.section?.name : ''} />
          </Grid>
        </Card>
      }
      {
        certificateFor === "teacher"
        &&
        <Card sx={{ maxWidth: 900, mx: 'auto', pt: 1, px: 1, my: 1, display: 'grid', gridTemplateColumns: { sm: '1fr 1fr', md: '1fr 1fr min-content' }, gap: { sm: 1 } }}>
          <Grid>
            <UncontrolledTextFieldWrapper label="Name" value={teacher?.first_name + (teacher?.middle_name || " ") + (teacher?.last_name || " ")} />
          </Grid>
          <Grid>
            <UncontrolledTextFieldWrapper label="Department" value={student?.department?.title || ''} />
          </Grid>
        </Card >
      }

      <Card sx={{ minHeight: 'calc(100vh - 350px)' }}>

        <TableHeadWrapper
          title="templates"
          total={paginatedFees.length}
          count={filteredschools.length}
          page={page}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          children={<>
            <DatePickerWrapper label="Print Date" date={printDate} handleChange={handleDateChange} />
            <Grid item display="flex" gap={2}>
              {selectedBulkActions && (
                selectedItems.length > 0 && selectedTemplate && (
                  <>
                    <CsvExport exportData={export_data()} />
                  </>
                )
              )}

            </Grid>
          </>}
        />

        <Divider />

        {paginatedFees.length === 0 ? (
          <TableEmptyWrapper title="students" />
        )
          :
          (
            <>
              <TableContainerWrapper
                tableHead={
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllschools}
                        indeterminate={selectedSomeschools}
                        onChange={handleSelectAllschools}
                      />
                    </TableCell> */}
                    <TableCell>{t('ID')}</TableCell>
                    <TableCell>{t('Name')}</TableCell>
                    <TableCell>{t('Background Image')}</TableCell>
                    <TableCell>{t('Actions')}</TableCell>

                  </TableRow>
                }

                tableBody={
                  <>
                    {paginatedFees.map((template) => {
                      const isschoolselected = selectedItems.includes(
                        template.id
                      );
                      return (
                        <TableRow
                          hover
                          key={template.id}
                          selected={isschoolselected}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isschoolselected}
                              onChange={(event) =>
                                handleSelectOneProject(event, student.id)
                              }
                              value={isschoolselected}
                            />
                          </TableCell> */}
                          <TableCell sx={{ py: 0.5 }}>
                            {template.id}
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>
                            {template.name}
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>
                            {<img src={template.background_url} className=' h-10' alt='background_image' />}
                          </TableCell>
                          <TableCell sx={{ py: 0.5, display: 'flex', gap: 2 }}>
                            <Tooltip title={t('view')} arrow>
                              <IconButton
                                onClick={() => { setSelectedTemplate(template) }}
                                color="primary"
                              >
                                <PreviewIcon sx={{ fontSize: '40px' }} />
                              </IconButton>
                            </Tooltip>
                            <Grid mt={1.1}>
                              <GenerateCertificateExport _for={student ? 'student' : 'employee'} publicationDate={printDate} datas={certificateFor === "student" ? [student] : [teacher]} template={template} />
                            </Grid>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                }

              />
            </>
          )}
      </Card>
    </>
  );
};

export default StudentTeacharResults;
