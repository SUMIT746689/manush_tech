import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";

export function DebounceInput({ handleDebounce, debounceTimeout, label, type = 'text', required = false, disabled = false, sx = {}, handleChange, value, ...param }) {


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
            onChange={handleChange}

        />

    )
}

export function NewDebounceInput({ label, debounceTimeout, handleDebounce, name, value, type = "text", touched, errors, handleChange, handleBlur, required = false, disabled = false, ...params }) {

    useEffect(() => {
        const getData = setTimeout(() => {
            console.log({handleDebounce})
            console.log({debounce_:handleDebounce(value)})
            handleDebounce(value);
        }, debounceTimeout);

        return () => clearTimeout(getData);
    }, [value]);

    return (

        <Grid item container pb={1}>
            <TextField
                size='small'
                sx={{
                    [`& fieldset`]: {
                        borderRadius: 0.4,
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

    )
}
