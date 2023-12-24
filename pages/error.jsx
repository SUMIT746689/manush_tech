import React from 'react';
import { useRouter } from 'next/router'
import { Grid } from '@mui/material';
const error = () => {
    const router = useRouter()
    console.log(router.query);
    return (
        <Grid >
            {router?.query?.message}
        </Grid>
    );
};

export default error;