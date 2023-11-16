import { Grid, Input } from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";

export function DebounceInput({ handleDebounce, debounceTimeout, label, type = 'text', value, required = false, disabled = false, ...param }) {

    const timerRef = React.useRef<number>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
            handleDebounce(event.target.value);
        }, debounceTimeout);
    };

    return (
        
            <TextField
                {...param}
                size='small'
                sx={{
                    [`& fieldset`]: {
                        borderRadius: 0.6,
                    }
                }}
                label={label}
                type={type}
                required={required}
                disabled={disabled}
                fullWidth
                onChange={handleChange}

            />
        
    )
}