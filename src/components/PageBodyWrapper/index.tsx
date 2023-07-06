import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, styled } from '@mui/material';

interface PageBodyWrapperProps {
  children?: ReactNode;
}

const PageBodyWrapper: FC<PageBodyWrapperProps> = ({ children }) => {
  return (
    <>
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ minHeight: 'calc(100vh - 80px )' }}
      >
        {children}
      </Grid>
    </>
  );
};

PageBodyWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageBodyWrapper;
