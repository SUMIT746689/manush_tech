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
        // boxShadow: "-1px 15px 48px 0px rgba(0,40,132,1)"
        boxShadow: "-2px 8px 21px -4px rgba(0,40,132,0.7)"
      }}
    >

      {/* search section */}
      <Grid sx={{ display: { xs: "none", md: "block" } }}>
        <TextField
          size='small'
          id="search"
          type="search"
          // label="Search"
          placeholder='search here...'
          color='primary'
          // value={""}
          // onChange={() => { }}
          // fontColor="primary"
          sx={{
            [`& fieldset`]: {
              borderRadius: 0.6
            },
            '&.Mui-focused fieldset': {
              borderColor: 'red'
            },
            display: { xs: "hidden", sm: "block" },
            maxWidth: 600,
          }}
          InputProps={{
            style: {
              color: "#FFFFFF",
              borderColor: "white",
              border: "2px solid #FFFFFF",
              borderRadius: "6px"
            },
            endAdornment: (
              <InputAdornment position="end">
                <SearchTwoToneIcon sx={{ color: "#FFFFFF" }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>


      {/* @ts-ignore */}
      {user?.role?.title !== 'SUPER_ADMIN' &&
        <Box sx={{ display: { xs: "none", sm: "block" }, backgroundColor: "white", textAlign: "center", py: 0.5, px: 1, borderRadius: 0.5, fontWeight: 600, fontSize: 12 }}>
          Customer Support <br />
          <a href="tel:+8801894884113" style={{ borderBottom: "1px solid white" }}>+880 1894 884 113</a>
        </Box>
      }

      {/* @ts-ignore */}
      {user?.role?.title !== 'SUPER_ADMIN' && (
        <Grid pt={1} minWidth={150} sx={{ display: { xs: "block", sm: "none" } }}>
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
        {user?.role?.title !== 'SUPER_ADMIN' && (
          <Grid pt={1} minWidth={150} sx={{ pr:2, display: { xs: "none", sm: "block" } }}>
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