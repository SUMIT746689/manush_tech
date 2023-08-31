import { Button, FormControl, Grid, InputLabel, TextField } from '@mui/material';

export const TextFieldWrapper = ({ label, name, value, type = "string", touched, errors, handleChange, handleBlur, required = false, disabled = false }) => {
  return (
    <Grid item container pb={1}>
      <TextField
        size='small'
        sx={{
          [`& fieldset`]: {
            borderRadius: 0.6,
          }
        }}
        id="outlined-basic"
        label={label}
        variant="outlined"
        type={type}
        error={Boolean(touched && errors)}
        fullWidth
        helperText={touched && errors}
        name={name}
        placeholder={`${name} here...`}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        required={required}
        disabled={disabled}
      />
    </Grid>
  );
};

export const UncontrolledTextFieldWrapper = ({ label, value, type = "string", disabled = false }) => {
  return (
    <Grid item container pb={1}>
      <TextField
        size='small'
        sx={{
          [`& fieldset`]: {
            borderRadius: 0.6,
          }
        }}
        id="outlined-basic"
        label={label}
        variant="outlined"
        type={type}

        fullWidth
        placeholder={`${name} here...`}
        value={value}
        disabled={disabled}
      />
    </Grid>
  );
};

export const DisableTextWrapper = ({ label, touched, errors, value }) => {
  return (
    <Grid item container pb={1}>
      <TextField
        id="outlined-basic"
        size='small'
        sx={{
          [`& fieldset`]: {
            borderRadius: 0.6,
          }
        }}
        label={label}
        value={value}
        variant="outlined"
        error={Boolean(touched && errors)}
        fullWidth
        helperText={touched && errors}
        disabled
      />
    </Grid>
  )
}

export const TextAreaWrapper = ({ name, value, touched, errors, handleChange, handleBlur, minRows = 6, required = false }) => {
  return (
    <Grid item container pb={1}>
      <TextField
        id="outlined-multiline-static"
        label={name}
        variant="outlined"
        error={Boolean(touched && errors)}
        fullWidth
        helperText={touched && errors}
        name={name}
        placeholder={`${name} here...`}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        required={required}
        minRows={minRows}
        maxRows={8}
        multiline
      />
    </Grid>
  );
};

export const FileUploadFieldWrapper = ({ htmlFor, label, name, value, accept = "image", multiple = false, handleChangeFile, handleRemoveFile }) => {

  return (
    <Grid pb="1" mb={1}>
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        size='small'

        name={name}
        value={value}
        sx={{
          borderTopRightRadius: 1,
          [`& fieldset`]: {
            py: 1.85,
            borderRadius: 0.8,
            borderTopRightRadius: 0,
            // borderTopLeftRadius:0.6,
            // borderBottomRightRadius:0.6,
            // borderBottomLeftRadius:0.6,
            // fontSize: 0.2
          },
        }}
        disabled
      />

      <label htmlFor={htmlFor}>
        <input
          accept={`${accept}/*`}
          style={{ display: 'none' }}
          id={htmlFor}
          multiple={multiple}
          type="file"
          onChange={handleChangeFile}
        />
        <Button variant='contained' component="span" sx={{ borderTopLeftRadius: 0, ml: 0.1, cursor: 'pointer' }}>
          Upload
        </Button>
      </label>
      <Button onClick={handleRemoveFile} variant='contained' component="span" sx={{ borderTopLeftRadius: 0, ml: 0.1, bgcolor: 'gray', ":hover": { bgcolor: 'lightgrey' } }}>
        Remove
      </Button>
    </Grid>
  )
}

// export const NumberFieldWrapper = () => {

//   return (
//     <FormControl focused className="col " variant="outlined">
//       <InputLabel className="mText">your label</InputLabel>
//       <NumberFormat customInput={TextField}
//         variant="outlined"
//         thousandSeparator={true}
//         onChange={handleChange}
//         autoComplete="off" />
//     </FormControl>
//   )
// }