import { useContext, useEffect, useState } from 'react';

import {
  Box,
  alpha,
  Stack,
  lighten,
  Divider,
  IconButton,
  Tooltip,
  styled,
  useTheme,
  Grid
} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import HeaderSearch from './Search';
import HeaderMenu from './Menu';
import { AcademicYearContext } from '@/contexts/UtilsContextUse';
import axios from 'axios';
import { getOneCookies } from '@/utils/utilitY-functions';
import { useAuth } from '@/hooks/useAuth';
import { AutoCompleteWrapper } from '@/components/AutoCompleteWrapper';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();
  const [academicYearList, setAcademicYearList] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);

  const { user } = useAuth();

  const handleFetchAcademicYear = () => {
    axios
      .get(`/api/academic_years`)
      .then((res) => {
        const list = res.data?.data?.map((i) => {
          return { label: i.title, id: i.id };
        });
        setAcademicYearList(list);

        const storedAcademicYear = JSON.parse(
          localStorage.getItem('academicYear')
        );

        if (storedAcademicYear) {

          const temp = list.find((i) => i.id == storedAcademicYear.id);

          if (temp) {
            setSelectedAcademicYear({ label: temp.label, id: temp.id });
          } else {
            const lastIndex = list.length;
            setSelectedAcademicYear(
              academicYear.id ? academicYear : list[lastIndex - 1]
            );
          }
        } else {
          const lastIndex = list.length;
          setSelectedAcademicYear(
            academicYear.id ? academicYear : list[lastIndex - 1]
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // @ts-ignore
    user?.role?.title !== 'SUPER_ADMIN' && handleFetchAcademicYear();
  }, [user]);

  useEffect(() => {
    if (selectedAcademicYear) {
      setAcademicYear(selectedAcademicYear);
    }
  }, [selectedAcademicYear]);

  const handleAcademicYearChange = (event: any, newValue: string | null) => {

    if (newValue) {
      localStorage.setItem(
        'academicYear',
        JSON.stringify(newValue)
      );
      setSelectedAcademicYear(newValue);
    }
  }

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
              lighten(theme.colors.primary.main, 0.7),
              0.15
            )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
              theme.colors.alpha.black[100],
              0.2
            )}, 0px 5px 22px -4px ${alpha(
              theme.colors.alpha.black[100],
              0.1
            )}`
      }}
    >
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        spacing={2}
      >
        {/* <HeaderSearch /> */}
        {/* <HeaderMenu /> */}
      </Stack>

      <Box display="flex" alignItems="center">
        {/* @ts-ignore */}
        {user?.role?.title !== 'SUPER_ADMIN' && (
          <Grid pt={1} minWidth={150}>
            <AutoCompleteWrapper
              label="Academic Year"
              placeholder="select a academic year..."
              value={selectedAcademicYear}
              options={academicYearList}
              handleChange={handleAcademicYearChange}
            />
          </Grid>
        )}
        {/* <HeaderButtons /> */}
        <HeaderUserbox />
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Show Menu" onClick={toggleSidebar}>
            <IconButton color="primary">
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small" />
              ) : (
                <CloseTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
