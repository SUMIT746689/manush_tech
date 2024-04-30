import { Grid, Typography } from '@mui/material';

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
          display: 'flex',
          gap: '20px',
          padding: '18px'
        }}
      >
        {/* user profile image */}
        <Grid
          sx={{
            flexBasis: '30%'
          }}
        >
          <Grid
            sx={{
              width: '200px',
              height: '200px',
              backgroundColor: '#ccc'
            }}
          ></Grid>
        </Grid>
        {/* user details information */}
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
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px',
                  textAlign: 'right'
                }}
              >
                Shift:
              </Typography>
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
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px',
                  textAlign: 'right'
                }}
              >
                Year:
              </Typography>
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
                Rakibul Islam
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                Md. Nurul Islam
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                One
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                PC-C
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                Morning
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                A
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                100
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: '#223354b3',
                  fontSize: '14px'
                }}
              >
                2023
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RightBox;
