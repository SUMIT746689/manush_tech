import { Box, Card, Grid, InputAdornment, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

function SearchInputWrapper({ placeholder, handleQueryChange, query }) {
  const { t }: { t: any } = useTranslation();
  return (

    <Grid container>
      <Grid item xs={12}>
        <Box pb={1}>
          <TextField
            size="small"
            sx={{
              m: 0,
              [`& fieldset`]: {
                borderRadius: 0.6,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder={t(placeholder)}
            value={query}
            fullWidth
            variant="outlined"
          />
        </Box>
      </Grid>
    </Grid>
  )
}

// function SearchInputWrapper({placeholder,handleQueryChange,query}) {
//   const { t }: { t: any } = useTranslation();
//   return (
//     <Card
//         sx={{
//           mb: 1
//         }}
//       >
//         <Grid container>
//           <Grid item xs={12}>
//             <Box p={1}>
//               <TextField
//                 sx={{
//                   m: 0
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchTwoToneIcon />
//                     </InputAdornment>
//                   )
//                 }}
//                 onChange={handleQueryChange}
//                 placeholder={t(placeholder)}
//                 value={query}
//                 fullWidth
//                 variant="outlined"
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Card>
//   )
// }




export default SearchInputWrapper