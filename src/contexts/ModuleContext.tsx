import { useState, ReactNode, createContext, useEffect } from 'react';

type ModuleContext = {
  selectModule: any;
  handleChangeModule: (value) => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ModuleContext = createContext<ModuleContext>({} as ModuleContext);

type Props = {
  children: ReactNode;
};

export function ModuleProvider({ children }: Props) {
  const [selectModule, setSelectModule] = useState('');

  useEffect(() => {
    const curModuleName = window.localStorage.getItem('moduleName') || '';
    setSelectModule(curModuleName);
    // if (!curModuleName) handleDrawerClose();
  }, []);

  const handleChangeModule = (value) => {
    setSelectModule(value);
    window.localStorage.setItem('moduleName', value);
  };

  return (
    <ModuleContext.Provider value={{ selectModule, handleChangeModule }}>
      {children}
    </ModuleContext.Provider>
  );
}
