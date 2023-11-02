import CircularProgress, { circularProgressClasses, CircularProgressProps } from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

export const LoadingIcon = (props: CircularProgressProps) => {
  return (
    <Grid sx={{ position: 'relative',display:'flex',flexDirection:'column', justifyContent:'center'}}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[200],
            // theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={20}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          // color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
          color: (theme) =>'#1a90ff' ,
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={20}
        thickness={4}
        {...props}
      />
    </Grid>
  );
}
