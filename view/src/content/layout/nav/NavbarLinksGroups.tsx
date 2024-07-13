import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { NavLink, useLocation } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : 'white',
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.orange[9],
      color: theme.colorScheme === 'dark' ? theme.white : theme.colors.orange[1],
    },
    '&:active': {
      opacity:0.75
    },
  },
  activeControl: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    fontSize: theme.fontSizes.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.orange[9],
    // color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.orange[1],
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.white,
    borderLeft: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.orange[0]
      }`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.orange[9],
      color: theme.colorScheme === 'dark' ? theme.white : theme.colors.orange[1],
    },
    '&:active': {
     opacity:0.75
    },
  },

  text: {
    // color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.orange[8],
  },
  activeText: {
    // color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.orange[8],
  },

  activeLink: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.orange[1],
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.orange[8],
  },

  chevron: {
    transition: 'transform 200ms ease',
  },

  themeIcon: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.orange[1],
    // color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.orange[8],
  }
}));

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
}

export function LinksGroup({ link, icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
  const { classes, theme } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  const { pathname } = useLocation();
  console.log({ pathname })

  const items = (hasLinks ? links : []).map((link) => (
    <NavLink to={link.link} className={({ isActive }) => isActive ? `${classes.activeLink} ${classes.link}` : classes.link}
      key={link.label}
    >
      {/* <Text<'a'> component="a" > */}
      {link.label}
      {/* </Text> */}
    </NavLink>
  ));

  return (
    <>
    
      {
        label !== "Users" ?
        hasLinks ? <>
          <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
            <Group position="apart" spacing={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThemeIcon variant="light" size={30} className={classes.themeIcon}>
                  <Icon size="1.1rem" />
                </ThemeIcon>
                <Box ml="md">{label}</Box>
              </Box>
              {hasLinks && (
                <ChevronIcon
                  className={classes.chevron}
                  size="1rem"
                  stroke={1.5}
                  style={{
                    transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                  }}
                />
              )}
            </Group>
          </UnstyledButton>
          {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
          :
          <NavLink to={link || ''}
            className={({ isActive }) => isActive ?  classes.activeControl : classes.control} 
          >
            {
              // ({ isActive }) => (
                <UnstyledButton 
                sx={{color:'white'}}
                // className={isActive ? classes.control : classes.activeControl}
                >
                  <Group position="apart" spacing={0}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThemeIcon variant="light" size={30} className={classes.themeIcon}>
                        <Icon size="1.1rem" />
                      </ThemeIcon>
                      <Box ml="md" >{label}</Box>
                    </Box>
                  </Group>
                </UnstyledButton>
              // )
            }
          </NavLink>
          :
          <></>
      }
    </>
  );
}

// const mockdata = {
//   label: 'Releases',
//   icon: IconCalendarStats,
//   links: [
//     { label: 'Upcoming releases', link: '/' },
//     { label: 'Previous releases', link: '/' },
//     { label: 'Releases schedule', link: '/' },
//   ],
// };

// export function NavbarLinksGroup() {
//   return (
//     <Box
//       sx={(theme) => ({
//         minHeight: rem(220),
//         padding: theme.spacing.md,
//         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.orange[8],
//       })}
//     >
//       <LinksGroup {...mockdata} />
//     </Box>
//   );
// }