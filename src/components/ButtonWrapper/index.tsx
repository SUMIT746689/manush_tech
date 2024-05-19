import { Button, Grid } from "@mui/material"
import { LoadingIcon } from "../Loading/Loading"

export const ButtonWrapper = ({ startIcon = undefined, handleClick, disabled = false, children, sx = {}, pb = 1, ...params }) => {

  return (
    <Grid container sx={{ pb, justifyContent: 'center' }}>
      <Button variant="contained" size="small" disabled={disabled}
        startIcon={startIcon}
        sx={{
          ...sx,
          color: theme => theme.colors.warning,
          borderRadius: 0.5,
          minHeight: 36,
          width: '100%',
          ":disabled": {
            backgroundColor: 'lightgray'
          },
        }}
        onClick={handleClick}
        {...params}
      >
        {children}
      </Button>
    </Grid>
  )
}
export const SearchingButtonWrapper = ({ isLoading, startIcon = undefined, handleClick, disabled = false, children, sx = {},pb=1, ...params }) => {

  return (
    <Grid container sx={{ pb, justifyContent: 'center' }}>
      <Button variant="contained" size="small" disabled={disabled}
        startIcon={startIcon}
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
        {isLoading ?
          <LoadingIcon color='inherit' />
          : children
        }
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
