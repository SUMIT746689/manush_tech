import { Button, Card, FormControl, Grid, InputLabel, TextField } from '@mui/material';
import { FC } from 'react';

export const TextFieldWrapper = ({ label, name, value, type = "string", touched, errors, handleChange, handleBlur, required = false, disabled = false, ...params }) => {
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
        {...params}
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
      // focused={focused}
      />
    </Grid>
  )
}

export const TextAreaWrapper = ({ name, value, touched, errors, handleChange, handleBlur, minRows = 6, required = false, sx = {} }) => {
  return (
    <Grid item container pb={1}>
      <TextField
        sx={{ maxlength: 10 }}
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

export const NewFileUploadFieldWrapper = ({ htmlFor, accept = "image", multiple = false, handleChangeFile }) => {

  return (
    <Grid pb="1" mb={1} sx={{ position: "relative", height: 60 }} >
      <label htmlFor={htmlFor}>
        <input
          accept={`${accept}/*`}
          style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1, opacity: 0, cursor: "pointer" }}
          id={htmlFor}
          multiple={multiple}
          type="file"
          onChange={handleChangeFile}
        />
        <Button
          variant="outlined"
          component="span"
          sx={{ width: "100%", height: "100%", borderStyle: "dashed", position: "absolute", borderRadius: 0.5 }}
        >
          + Upload
        </Button>
      </label>
    </Grid>
  )
}

export const PreviewImageCard = ({ data, index, handleRemove }) => {
  const { src, name } = data;
  return (
    <Grid height={180} width={150} display="flex" flexDirection="column" justifyContent="end" gridTemplateColumns={"auto"}
      sx={{
        border: "1px solid skyblue", borderRadius: 0.6, borderStyle: "dashed", p: 0.5, ":hover": {
          scale: 1.5,
          cursor: "pointer"
        }
      }}
    >
      <Grid maxHeight={140} m={"auto"}>
        <img src={src} style={{ height: "100%", objectFit: "contain" }} />
      </Grid>
      <Grid sx={{ height: 20, fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>
        File name: <span style={{ color: "darkcyan" }}>{name}</span>
      </Grid>
      <Button onClick={() => handleRemove(index)} size='small' color="error" sx={{ borderRadius: 0.5, height: 30 }}>Remove</Button>
    </Grid>
  )
}

type ImageCardType = {
  url: string,
  handleRemove: (arg: string) => void
}
export const ImageCard: FC<ImageCardType> = ({ url, handleRemove }) => {
  return (
    <Card sx={{
      height: 180, width: 150, display: "flex", flexDirection: "column", justifyContent: "end", gridTemplateColumns: "auto",
      border: "1px solid lightgray", borderRadius: 0.5, boxShadow: "1px solid black", p: 0.5, ":hover": {
        scale: 1.5,
        cursor: "pointer"
      }
    }}
    >
      <Grid maxHeight={150} m={"auto"}>
        <img src={`/api/get_file/${url}`} style={{ height: "100%", objectFit: "contain" }} />
      </Grid>
      <Button onClick={() => handleRemove(url)} size='small' color="error" sx={{ borderRadius: 0.5, height: 30 }}>Remove</Button>
    </Card>
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