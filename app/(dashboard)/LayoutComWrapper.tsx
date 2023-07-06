'use client';

import LayoutCom from './LayoutCom';
import ThemeProvider from './ThemeProvider';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import { useState } from 'react';

export default function LayoutComWrapper({ children }) {
  const [academicYear, setAcademicYear] = useState({});
  return (
    <>
      <ThemeProvider>
        <AcademicYearContext.Provider value={[academicYear, setAcademicYear]}>

        <LayoutCom>{children}</LayoutCom>
        </AcademicYearContext.Provider>
      </ThemeProvider>
    </>
  );
}