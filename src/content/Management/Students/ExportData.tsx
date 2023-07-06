import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import CsvFileExport from 'src/components/Export/Csv';
import { PdfExport } from 'src/components/Export/Pdf';

export const ExportData = ({ students }) => {

  const [loading, setLoading] = useState(true)
  const [exportData, setExportData] = useState([]);
  console.log({ students })
  console.log({ exportData })
  useEffect(() => {
    setLoading(true);
    const exportData = [];
    if (Array.isArray(students)) {
      const customizeStudentData = students.map(student => ({
        id: student.id,
        "class roll": student.class_roll_no,
        "first name": student.student_info.first_name,
        "middle name": student.student_info.middle_name || '',
        "last name": student.student_info.last_name || '',
        "registration no": student.class_registration_no || '',
        class: student.section.class?.name,
        section: student.section?.name || '',
        guardian_phone: student.guardian_phone || '',
        "present address": student.student_present_address || '',
      }))
      console.log({ customizeStudentData })
      setExportData(() => customizeStudentData)
      setLoading(false);
    }
    else setLoading(false)
  }, [students])

  return (<>
    {
      setLoading && <Grid display={"flex"} >
        <CsvFileExport exportData={exportData} />
        <PdfExport title="Stident List" exportData={exportData} />
      </Grid>
    }
  </>
  )
} 