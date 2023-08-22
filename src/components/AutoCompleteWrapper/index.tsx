import { customBorder } from "@/utils/mui_style"
import { Autocomplete, Grid, TextField } from "@mui/material"

export const AutoCompleteWrapper = ({ minWidth = null, options, value, handleChange, label, placeholder,...params }) => {

  return (
    <Grid item pb={1} sx={
      minWidth && {
        minWidth
      }
    }
    >
      <Autocomplete
        fullWidth
        {...params}
        size='small'
        sx={customBorder}
        id="tags-outlined"
        options={options}
        value={value}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            size="small"
            fullWidth
            {...params}
            label={label}
            placeholder={placeholder}
          />
        )}
        onChange={handleChange}
      />
    </Grid>
  )
}