import { useClientFetch } from "@/hooks/useClientFetch";
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import axios from "axios";
import { FC, useEffect, useState } from "react"

const color = '#00C6FF';

type AttendanceProps = {
  todayAttendance: any;
}

export const Attendance: FC<AttendanceProps> = ({ todayAttendance }) => {

  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth + 1);
  

  const [studentsAttendPercent, setStudentsAttendPercent] = useState(0);
  const [teachersAttendPercent, setTeachersAttendPercent] = useState(0);
  const [employeesAttendPercent, setEmployeesAttendPercent] = useState(0);
  const [addtedanceFilter, setAttendancesFilter] = useState('Today');
  
  const studentsAttendance = (start_date, end_date) => {
    let url = `/api/attendance/day_wise/students?start_date=${start_date}&end_date=${end_date}`;
    axios.get(url).then((response) => {
      console.log({ response });
      if (!Array.isArray(response.data)) setStudentsAttendPercent(0);
      setStudentsAttendPercent(parseInt(response.data[0]?.attendance_percent) || 0)

    }).catch((error) => {
      console.log({ error });
    });

  }
  const teachersAttendance = (start_date, end_date) => {
    let url = `/api/attendance/day_wise/teachers?start_date=${start_date}&end_date=${end_date}`;
    axios.get(url).then((response) => {
      console.log({ response });
      if (!Array.isArray(response.data)) setTeachersAttendPercent(0);
      setTeachersAttendPercent(parseInt(response.data[0]?.attendance_percent) || 0)

    }).catch((error) => {
      console.log({ error });
    });

  }
  const employeesAttendance = (start_date, end_date) => {
    let url = `/api/attendance/day_wise/employees?start_date=${start_date}&end_date=${end_date}`;

    axios.get(url).then((response) => {
      console.log({ response });
      if (!Array.isArray(response.data)) setEmployeesAttendPercent(0);
      setEmployeesAttendPercent(parseInt(response.data[0]?.attendance_percent) || 0)

    }).catch((error) => {
      console.log({ error });
    });

  }

  useEffect(() => {
    let start_date = new Date(currentYear, currentMonth - 1, 1);
    let end_date = new Date(currentYear, currentMonth - 1, 1);

    if (addtedanceFilter === 'Today') {
      start_date = new Date(Date.now());
      end_date = new Date(Date.now());
    }
    else if (addtedanceFilter === 'Weekly') {
      start_date =  new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7);
      end_date = new Date(Date.now());
    }
    else {
      start_date = new Date(currentYear, currentMonth - 1, 1);
      end_date = new Date(currentYear, currentMonth - 1, daysInCurrentMonth + 1)
    }
    studentsAttendance(start_date, end_date);
    teachersAttendance(start_date, end_date);
    employeesAttendance(start_date, end_date);
  }, [addtedanceFilter])

  return (
    <Card sx={{ p: 2 }}>
      <Grid sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 700, pt: 2, textAlign: "center" }}>Attendance</Grid>

      <Grid display="grid" gridTemplateColumns={'1fr 1fr 1fr'} py={2} gap={1}>
        <ButtonWrapper isActive={addtedanceFilter} handleClick={() => { setAttendancesFilter('Today') }}>Today</ButtonWrapper>
        <ButtonWrapper isActive={addtedanceFilter} handleClick={() => { setAttendancesFilter('Weekly') }}>Weekly</ButtonWrapper>
        <ButtonWrapper isActive={addtedanceFilter} handleClick={() => { setAttendancesFilter('This Month') }}>This Month</ButtonWrapper>
      </Grid>

      <Grid sx={{ display: 'grid', gap: 0.5, p: 1 }} >
        <ChartCard color="#FF715B" title="Students" width={`${studentsAttendPercent || 0}%`} />
        <ChartCard color="#34D1BF" title="Teachers" width={`${teachersAttendPercent}%`} />
        <ChartCard color="#0496FF" title="Staffs" width={`${employeesAttendPercent}%`} />
      </Grid>

    </Card>
  )
}

const ButtonWrapper = ({ isActive, handleClick, children }) => {
  return (
    <Button onClick={handleClick} variant="contained"
      sx={{
        backgroundColor: isActive === children ? ' #00C6FF' : '#e6f9ff',
        color: isActive === children ? 'white' : '#00C6FF',
        ':hover': {
          backgroundColor: isActive === children ? ' #00C6FF' : '#e6f9ff',
          color: isActive === children ? 'white' : '#00C6FF',
        },
        fontSize: 10,
        borderRadius: 0.5,
        px: 0,
        py: 1
      }}>
      {children}
    </Button>
  )
}

const ChartCard = ({ width, title, color }) => {
  return (
    <>
      <Grid fontWeight={700} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid >{title}</Grid>
        <Grid fontSize={12} my="auto" color={color}>{width}</Grid>
      </Grid>

      <Grid sx={{ position: 'relative' }}>
        <Grid sx={{ zIndex: 20, top: 0, left: 0, position: 'absolute', backgroundColor: color, height: 7, width: { width }, transition: 'width 0.5s ease-in-out', borderRadius: 0.5 }}></Grid>
        <Grid sx={{ zIndex: 30, top: 0, left: 0, backgroundColor: 'lightgray', height: 7, width: '100%', transition: 'width 5sec', borderRadius: 0.5 }}></Grid>

      </Grid>
    </>
  )
}