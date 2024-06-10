import { Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { getFile } from '@/utils/utilitY-functions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const userName = (student) => {
  let fullName = '';

  if (student?.student_info?.first_name) {
    fullName += student?.student_info?.first_name + ' ';
  }
  if (student?.student_info?.middle_name) {
    fullName += student?.student_info?.middle_name + ' ';
  }
  if (student?.student_info?.last_name) {
    fullName += student?.student_info?.last_name + ' ';
  }
  return fullName;
};

const PrintAdmin = ({ displayStudent, schoolInformation, user, selectedExam }) => {
  return (
    <Grid
      mx={1}
      px={4}
      minHeight="fit-content"
      mt={1}
      sx={{
        backgroundColor: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '4vh',
        mt: '10px'
        // py: '4vh'
      }}
    >
      {displayStudent?.map((item) => {
        return (
          <Grid sx={{ border: '7px solid #f50519', height: '44vh', my: '1vh' }}>
            <Grid
              sx={{
                border: '7px solid #03fc13',
                height: '100%',
                my: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Grid sx={{ width: '100%' }}>
                <Grid px={3} mt={3} width={'100%'} display="grid" height="120px" gridTemplateColumns="120px 1fr 120px">
                  {/* school logo */}
                  <Grid alignSelf="end" width="80px">
                    {schoolInformation?.header_image ? (
                      <Image
                        src={getFile(schoolInformation?.header_image)}
                        width={100}
                        height={100}
                        alt="school logo"
                        style={{ position: 'relative', bottom: 0 }}
                      />
                    ) : (
                      ''
                    )}
                  </Grid>

                  {/* info */}
                  <Grid width="100%">
                    <Typography variant="h3" textAlign={'center'}>
                      {user?.school?.name}
                    </Typography>

                    <Typography variant="body1" textAlign={'center'}>
                      {user?.school?.address}
                    </Typography>

                    <Grid
                      mt={1}
                      mx="auto"
                      sx={{
                        backgroundColor: '#0a696e',
                        color: '#fff',
                        padding: '5px 50px',
                        textTransform: 'uppercase',
                        borderRadius: '20px',
                        width: 'fit-content',
                        border: '1px solid #000'
                      }}
                    >
                      Admit Card
                    </Grid>
                  </Grid>

                  {/* student photo */}
                  <Grid alignSelf="end" width="80px">
                    {item?.student_photo ? (
                      <Image src={getFile(item?.student_photo)} width={100} height={100} alt="user photo" />
                    ) : (
                      <Image src={'/default_user_photo.jpg'} width={100} height={100} alt="user photo" />
                    )}
                  </Grid>
                </Grid>

                {/* Table */}
                <Grid mt={3} mb={4} mx={1}>
                  <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                    <Table sx={{ minWidth: 650, maxWidth: 'calc(100%-10px)' }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            style={{
                              border: '1px solid black',
                              textTransform: 'capitalize'
                            }}
                          >
                            Name: {userName(item)}
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            style={{
                              border: '1px solid black',
                              textTransform: 'capitalize'
                            }}
                          >
                            Exam/Assesment Name: {selectedExam?.label && item ? selectedExam?.label : ''}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell component="th" scope="row" align="left" style={{ border: '1px solid black' }}>
                            Student Id: {item?.student_info?.student_id ? item?.student_info?.student_id : ''}
                          </TableCell>

                          <TableCell align="left" style={{ border: '1px solid black' }}>
                            Class: {item?.section?.class?.name}
                          </TableCell>
                          <TableCell align="left" style={{ border: '1px solid black' }}>
                            Section: {item?.section?.name}
                          </TableCell>
                          <TableCell align="left" style={{ border: '1px solid black' }}>
                            Group: {item?.group?.title}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell component="th" scope="row" align="left" style={{ border: '1px solid black' }}>
                            Shift:{' '}
                          </TableCell>

                          <TableCell align="left" style={{ border: '1px solid black' }}>
                            Roll: {item?.class_roll_no ? item?.class_roll_no : ''}
                          </TableCell>
                          <TableCell align="left" style={{ border: '1px solid black' }}>
                            Year: {item?.academic_year?.title}
                          </TableCell>
                          <TableCell align="left" style={{ border: '1px solid black' }}>
                            Mobile: {item?.student_info?.phone}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid
                  mb={3}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 160px'
                  }}
                >
                  <Grid>
                    <Typography variant="body1" textAlign="center">
                      ................................
                    </Typography>

                    <Typography variant="body1" textAlign="center">
                      Principle
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body1" textAlign="center">
                      ................................
                    </Typography>

                    <Typography variant="body1" textAlign="center">
                      Class Teacher
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PrintAdmin;
