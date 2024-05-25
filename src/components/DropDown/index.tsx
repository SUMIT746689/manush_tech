import { customBorder } from '@/utils/mui_style';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'next-i18next';

export function DropDownSelectWrapper({ value, name = '', label, handleChange, menuItems, required = false }) {
  const { t }: { t: any } = useTranslation();
  return (

    <Grid container sx={{ pb: 1 }}>
      <FormControl size='small' fullWidth sx={customBorder}>
        <InputLabel id="demo-simple-select-label">{required ? label + ' *' : label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name={name}
          value={value}
          label={required ? label + ' *' : label}
          onChange={handleChange}
          sx={{textTransform:"capitalize"}}
        >
          {menuItems.map((menuItem, index) => <MenuItem key={index} value={menuItem} sx={{textTransform:"capitalize"}}>{menuItem.split('_').join(' ')}</MenuItem>)}
        </Select>
      </FormControl>
    </Grid>
  )
}

export function DynamicDropDownSelectWrapper({ value, name, label, handleChange, menuItems, required = false }) {
  const { t }: { t: any } = useTranslation();
  return (

    <Grid container sx={{ pb: 1 }}>
      <FormControl
        fullWidth
        size='small'
        sx={customBorder}
      >
        <InputLabel id="demo-simple-select-label">{required ? label + ' *' : label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name={name}
          value={value}
          label={required ? label + ' *' : label}
          onChange={handleChange}
        >
          {menuItems?.map(menuItem => <MenuItem value={menuItem.value}>{menuItem.title}</MenuItem>)}
        </Select>
      </FormControl>
    </Grid>
  )
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function DynamicDropDownMuilipleSelectWrapper({ value, name, label, handleChange, menuItems, required = false }) {
  const { t }: { t: any } = useTranslation();
  return (

    <Grid container sx={{ pb: 1 }}>
      <FormControl
        fullWidth
        size='small'
        sx={customBorder}
      >
        <InputLabel id="demo-simple-select-label">{required ? label + ' *' : label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple
          name={name}
          value={value}
          label={required ? label + ' *' : label}
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {menuItems?.map(menuItem => <MenuItem value={menuItem.value}>{menuItem.title}</MenuItem>)}
        </Select>
      </FormControl>
    </Grid>
  )
}

