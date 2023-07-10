import { customBorder } from "@/utils/mui_style"
import { Autocomplete, Grid, TextField } from "@mui/material"

export const AutoCompleteWrapper = ({ options, value, handleChange, label, placeholder }) => {

  return (
    <Grid item pb={1}>
      <Autocomplete
        fullWidth
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