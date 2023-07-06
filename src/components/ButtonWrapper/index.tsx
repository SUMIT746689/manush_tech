import { Button, Grid } from "@mui/material"

export const ButtonWrapper = ({ handleClick, disabled = false, children }) => {

  return (
    <Grid container sx={{ pb: 1, justifyContent: 'center' }}>
      <Button variant="contained" size="small" disabled={disabled}
        sx={{
          borderRadius: 0.5,
          height: 36,
          width: '100%',
          ":disabled": {
            backgroundColor: 'lightgray'
          }
        }}
        onClick={handleClick}
      >
        {children}
      </Button>
    </Grid>
  )
}