import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";

export function DebounceInput({ handleDebounce, debounceTimeout, label, type = 'text', required = false, disabled = false,sx={}, ...param }) {

    const [value, setValue] = useState(undefined);

    useEffect(() => {
        const getData = setTimeout(() => {
            handleDebounce(value);
        }, debounceTimeout);

        return () => clearTimeout(getData);
    }, [value]);

    return (

        <TextField
            {...param}
            size='small'
            sx={{
                [`& fieldset`]: {
                    borderRadius: 0.6,
                },
                ...sx
            }}
            label={label}
            type={type}
            required={required}
            disabled={disabled}
            fullWidth
            onChange={e => setValue(e.target.value)}

        />

    )
}