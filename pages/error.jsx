import React from 'react';
import { useRouter } from 'next/router'
const error = () => {
    const router = useRouter()
    console.log(router.query);
    return (
        <div>
            {router?.query?.message}
        </div>
    );
};

export default error;