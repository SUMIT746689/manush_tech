import { Avatar, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { getFile } from '@/utils/utilitY-functions';

const RightBox = ({ userInformation }) => {
  return (
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
        Student Information
      </Grid>
      <Grid
        sx={{
          display: 'Grid',
          gridTemplateColumns:"20vh auto",
          columnGap:1,
          padding: 1,
        }}
      >
        {/* user profile image */}
        {/* <Grid
          sx={{
            flexBasis: '30%'
          }}
        > */}
          <Grid
            sx={{
              // width: '150px',
              // height: '150px',
              backgroundColor: 'white'
            }}
          >
            {/* {userInformation?.student_photo ? (
              <Image
                src={getFile(userInformation?.student_photo)}
                height={100}
                width={100}
                alt={`${userInformation?.first_name} photo`}
                loading="lazy"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              ''
            )} */}
            <Avatar src={getFile(userInformation?.student_photo)} sx={{height:'100%', maxHeight:100,width:"auto",objectFit:"contain"}} />
          </Grid>
        {/* </Grid> */}

        <Grid
          sx={{
            flexGrow: 1
          }}
        >
          <Grid
            sx={{
              display: 'flex',
              gap: '20px'
            }}
          >
            <Grid
              sx={{
                flexBasis: '40%'
              }}
            >
              {userInformation?.first_name ? (
                <Typography
                  component="p"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}
                >
                  Student Name:
                </Typography>
              ) : (
                ''
              )}
              {userInformation?.father_name ? (
                <Typography
                  component="p"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}
                >
                  Fathers Name:
                </Typography>
              ) : (
                ''
              )}

              {userInformation?.class_name ? (
                <Typography
                  component="p"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}
                >
                  Class:
                </Typography>
              ) : (
                ''
              )}

              {userInformation?.group_title ? (
                <Typography
                  component="p"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}
                >
                  Group:
                </Typography>
              ) : (
                ''
              )}

              {userInformation?.section_name ? (
                <Typography
                  component="p"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}
                >
                  Section:
                </Typography>
              ) : (
                ''
              )}

              {userInformation?.class_roll_no ? (
                <Typography
                  component="p"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}
                >
                  Roll No:
                </Typography>
              ) : (
                ''
              )}
            </Grid>
            <Grid
              sx={{
                flexBasis: '40%'
              }}
            >
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                {`${
                  userInformation?.first_name ? userInformation?.first_name : ''
                } ${
                  userInformation?.middle_name
                    ? userInformation?.middle_name
                    : ''
                } ${
                  userInformation?.last_name ? userInformation?.last_name : ''
                }`}
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                {userInformation?.father_name
                  ? userInformation?.father_name
                  : ''}
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                {userInformation?.class_name ? userInformation.class_name : ''}
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                {userInformation?.group_title
                  ? userInformation?.group_title
                  : ''}
              </Typography>
              {/* <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                Morning
              </Typography> */}
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                {userInformation?.section_name
                  ? userInformation?.section_name
                  : ''}
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                {userInformation?.class_roll_no
                  ? userInformation.class_roll_no
                  : ''}
              </Typography>
              {/* <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                2023
              </Typography> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RightBox;
