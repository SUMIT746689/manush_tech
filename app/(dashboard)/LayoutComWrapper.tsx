'use client';

import LayoutCom from './LayoutCom';
import ThemeProvider from './ThemeProvider';
import { AcademicYearContext, Students } from '@/contexts/UtilsContextUse';
import { useState } from 'react';

export default function LayoutComWrapper({ children }) {
  return (
    <>
      <ThemeProvider>
        <LayoutCom>{children}</LayoutCom>
      </ThemeProvider>
    </>
  );
}