import { Button, Grid } from "@mui/material"

export const ButtonWrapper = ({ startIcon = undefined, handleClick, disabled = false, children, sx = {}, ...params }) => {

  return (
    <Grid container sx={{ pb: 1, justifyContent: 'center' }}>
      <Button variant="contained" size="small" disabled={disabled}
        sx={{
          ...sx,
          borderRadius: 0.5,
          minHeight: 36,
          width: '100%',
          ":disabled": {
            backgroundColor: 'lightgray'
          }
        }}
        onClick={handleClick}
        {...params}
      >
        {children}
      </Button>
    </Grid>
  )
}

export const DisableButtonWrapper = ({ startIcon = undefined, children }) => {

  return (
    <Grid container sx={{ pb: 1, justifyContent: 'center' }}>
      <Button variant="contained" size="small" disabled={true}
        startIcon={startIcon}
        sx={{
          borderRadius: 0.5,
          height: 36,
          width: '100%',
          ":disabled": {
            backgroundColor: 'lightgray'
          }
        }}
      >
        {children}
      </Button>
    </Grid>
  )
}