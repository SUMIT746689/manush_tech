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
  Grid,
  Autocomplete,
  TextField,
  Container,
  InputAdornment
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
import { customBorder } from '@/utils/mui_style';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import menuItems from '../Sidebar/SidebarMenu/items';
import { useRouter } from 'next/router';
import useNotistick from '@/hooks/useNotistick';
import { useClientDataFetch } from '@/hooks/useClientFetch';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background: ${"#002884"};
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
  const [academicYearList, setAcademicYearList] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [academicYear, setAcademicYear] = useContext(AcademicYearContext);
  const auth = useAuth();
  const [menulist, setMenulist] = useState([])
  const router = useRouter();
  const { showNotification } = useNotistick();
  const { data } = useClientDataFetch(`/api/academic_years`)

  const handleFetchAcademicYear = () => {
    axios
      .get(`/api/academic_years`)
      .then((res) => {
        const list = res.data?.data?.map((i) => {
          return { label: i.title, id: i.id };
        });
        setAcademicYearList(list);

        // const storedAcademicYear = JSON.parse(
        //   localStorage.getItem('academicYear')
        // );
        // if (storedAcademicYear) {

        //   const temp = list.find((i) => i.id == storedAcademicYear.id);

        //   if (temp) {
        //     setSelectedAcademicYear({ label: temp.label, id: temp.id });
        //   } else {
        //     const lastIndex = list.length;
        //     setSelectedAcademicYear(
        //       academicYear.id ? academicYear : list[lastIndex - 1]
        //     );
        //   }
        // } else {
        //   const lastIndex = list.length;
        //   setSelectedAcademicYear(
        //     academicYear.id ? academicYear : list[lastIndex - 1]
        //   );
        // }

        axios.get('/api/academic_years/current')
          .then(({ data }) => {
            console.log({ data })
            if (data?.success) setSelectedAcademicYear(() => ({ id: data.data.id, label: data.data.title }))
          })

      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    // @ts-ignore
    if (auth?.user?.role?.title !== 'SUPER_ADMIN') {
      const tempMenu = []
      for (const i of menuItems[0]?.items) {
        if (i.items) {
          for (const j of i.items) {

            j.link && tempMenu.push({
              label: j.name,
              value: j.link
            })
          }
        } else {
          tempMenu.push({
            label: i.name,
            value: i.link
          })
        }
      }


      setMenulist(tempMenu)

      handleFetchAcademicYear();

    }
  }, [auth?.user]);

  useEffect(() => {
    if (selectedAcademicYear) {
      setAcademicYear(selectedAcademicYear);
    }
  }, [selectedAcademicYear]);

  const handleAcademicYearChange = async (event: any, newValue: { id: number, label: string } | null) => {
    if (!newValue?.id && !newValue.label) return showNotification("academic year values not found", "error")
    axios.patch(`/api/academic_years/${newValue.id}/change_current`)
      .then(({ data }) => {
        if (!data?.success) return
        // localStorage.setItem('academicYear', JSON.stringify(newValue));
        setSelectedAcademicYear(newValue);
      })
      .catch((error) => { showNotification("failed to change academic year", "error") })
  }
  const permissionsArray = auth?.user?.permissions?.length > 0
    ? auth?.user?.permissions?.map((permission: any) => permission.group)
    : [];

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        // boxShadow: "-1px 15px 48px 0px rgba(0,40,132,1)"
        boxShadow: "-2px 8px 21px -4px rgba(0,40,132,0.7)"
      }}
    >

      {/* <Grid sx={{ color: "#FFFFFF", textAlign: "center", fontSize: 12 }}>Select route</Grid> */}

      {/* <CustomAutoCompleteWrapper
        minWidth={'200px'}
        label="Select route"
        placeholder="Route..."
        value={undefined}
        options={menulist}
        handleChange={(e, v) => {
          console.log(v,permissionsArray);
          if (v) {
            if (!router.isReady) {
              return;
            }
            if (auth?.error) showNotification(auth?.error, 'error');

            if (!auth.isAuthenticated) {
              router.push({
                pathname: '/login',
                query: { backTo: router.asPath }
              });
            } else if (!permissionsArray.includes(v?.label)) {
              router.back();
            } else {
              router.push(v?.value)
            }
          }
        }}
      /> */}



      {/* @ts-ignore */}
      {auth?.user?.role?.title !== 'SUPER_ADMIN' &&
        <Box sx={{ display: { xs: "none", sm: "block" }, backgroundColor: "white", textAlign: "center", py: 0.5, px: 1, borderRadius: 0.5, fontWeight: 600, fontSize: 12 }}>
          Customer Support <br />
          <a href="tel:+8801894884113" style={{ borderBottom: "1px solid white" }}>+880 1894 884 113</a>
        </Box>
      }

      {/* @ts-ignore */}
      {auth?.user?.role?.title !== 'SUPER_ADMIN' && (
        <Grid pt={1} minWidth={185} sx={{ display: { xs: "block", sm: "none" } }}>
          <Grid sx={{ color: "#FFFFFF", textAlign: "center", fontSize: 12 }}>Academic Year</Grid>
          <CustomAutoCompleteWrapper
            // label="Academic Year"
            label=""
            placeholder="select a academic year..."
            value={selectedAcademicYear}
            options={academicYearList}
            handleChange={handleAcademicYearChange}
          />
        </Grid>
      )}

      <Box display="flex" alignItems="center">
        {/* @ts-ignore */}
        {auth?.user?.role?.title !== 'SUPER_ADMIN' && (
          <Grid pt={1} minWidth={185} sx={{ pr: 2, display: { xs: "none", sm: "block" } }}>
            <Grid sx={{ color: "#FFFFFF", textAlign: "center", fontSize: 12 }}>Academic Year</Grid>
            <CustomAutoCompleteWrapper
              // label="Academic Year"
              label=""
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
          <Tooltip arrow title="Show Menu" onClick={toggleSidebar} >
            <IconButton sx={{ color: "#FFFFFF", border: "2px solid #FFFFFF" }}>
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


export const CustomAutoCompleteWrapper = ({ minWidth = null, required = false, options, value, handleChange, label, placeholder, ...params }) => {

  return (
    <Grid item pb={1} sx={
      minWidth && {
        minWidth
      }
    }
    >
      <Autocomplete
        fullWidth
        {...params}
        size='small'
        sx={{
          color: "#002884",
          [`& fieldset`]: {
            color: "#002884",
            borderRadius: 0.6,
            // backgroundColor: "#FFFFFF",
            // border:"2px solid #FFFFFF",
            // ":hover":  {border:"2px solid #FFFFFF"},
          }
        }}
        id="tags-outlined"
        options={options}
        value={value}
        filterSelectedOptions
        renderInput={(rnParams) => (
          <TextField
            size="small"
            fullWidth
            required={required}
            {...rnParams}
            sx={{
              fontWeight: 600,
              color: "#002884",
              backgroundColor: "white",
              borderRadius: 0.6
            }}
            // sx={{border:"2px solid #FFFFFF"}}
            label={label}
            placeholder={placeholder}
          />
        )}
        onChange={handleChange}
      />
    </Grid>
  )
}