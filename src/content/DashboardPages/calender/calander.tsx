import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { Card, Grid } from "@mui/material";

const Calander = ({ holidays }) => {
  return <Card sx={{ p: 0.5, borderRadius: 0.5 }}>
    <Grid
      item
      md={12}
      direction="row"
      //  justifyContent="flex-end"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: '20%'
      }}
    >
      <FullCalendar
        // plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        plugins={[dayGridPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventMaxStack={4}
        progressiveEventRendering={true}
        events={holidays}
      />

      {/* <DemoApp /> */}
    </Grid>
  </Card>
}
export default Calander