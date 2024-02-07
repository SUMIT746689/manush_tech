import Grid from "@mui/material/Grid";
import { handleNumberOfSmsParts } from "utilities_api/handleNoOfSmsParts";
import { verifyIsUnicode } from "utilities_api/verify";

const SmsHelpInfoWrapper = ({ value }) => {
    const isUnicode = typeof value === 'string' ? verifyIsUnicode(value) : false;
    const updatedValue = handleNumberOfSmsParts({ isUnicode, textLength: value?.length });

    return (<Grid sx={{ ml: 'auto' }}>
        {`
          ${value?.length ?? 0} characters | 
          ${1000 - (value?.length ?? 0)} characters left |
          ${updatedValue} SMS (${isUnicode ? updatedValue > 1 ? 67 : 70 : updatedValue > 1 ? 153 : 160} Char./SMS)        
          `}
    </Grid>
    )
}

export default SmsHelpInfoWrapper