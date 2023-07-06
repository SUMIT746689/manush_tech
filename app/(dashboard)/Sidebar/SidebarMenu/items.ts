import type { ReactNode } from 'react';

import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SchoolIcon from '@mui/icons-material/School';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsInputCompositeIcon from '@mui/icons-material/SettingsInputComposite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  // heading: string;
}

const menuItems: MenuItems[] = [
  {
    items: [
      {
        name: 'Dashboard',
        icon: DashboardIcon,
        items: [
          {
            name: 'Reports',
            link: '/dashboards/reports'
          }
        ]
      },
      {
        name: 'Users',
        icon: AssignmentIndTwoToneIcon,
        link: '/management/users',
        items: [
          { 
            name: 'List',
            link: '/management/users'
          }
        ]
      },
      {
        name: 'Classes',
        icon: ClassIcon,
        link: '/management/classes'
      },
      {
        name: 'Sections',
        link: '/management/sections',
        icon: AllInboxIcon
      },
      {
        name: 'Subjects',
        link: '/management/subjects',
        icon: MenuBookIcon
      },
      {
        name: 'Academic Years',
        link: '/management/academic_years',
        icon: CalendarMonthIcon
      },
      {
        name: 'Schools',
        link: '/management/schools',
        icon: SchoolIcon
      },
      {
        name: 'Exam',
        link: '/management/exam',
        icon: ArticleIcon
      },
      {
        name: 'Result',
        link: '/management/result',
        icon: AssignmentTurnedInIcon,
        items: [
          {
            name: 'Section wise result',
            link: '/management/result'
          },
          {
            name: 'Single student result',
            link: '/management/result/single'
          }
        ]
      },
      {
        name: 'certification',
        link: '/management/certificate',
        icon: WorkspacePremiumIcon
      },
      {
        name: 'Teachers',
        link: '/management/teachers',
        icon: RecordVoiceOverIcon
      },
      {
        name: 'Students',
        link: '/management/students',
        icon: AccessibilityIcon
      },
      {
        name: 'Rooms',
        link: '/management/rooms',
        icon: RoomPreferencesIcon
      },
      {
        name: 'Period',
        icon: AccessTimeIcon,
        link: '/management/period'
      },
      {
        name: 'Attendence',
        icon: CheckCircleOutlineIcon,
        link: '/management/attendence'
      },
      {
        name: 'Routine',
        link: '/management/routine',
        icon: CalendarTodayIcon
      },
      {
        name: 'Sessions',
        link: '/management/sessions',
        icon: SettingsInputCompositeIcon
      },
      {
        name: 'Fees',
        link: '/management/fees',
        icon: AccountTreeTwoToneIcon
      },
      {
        name: 'CollectFee',
        link: '/management/student_fees_collection',
        icon: AccountTreeTwoToneIcon
      },
      {
        name: 'Holidays',
        link: '/management/holidays',
        icon: AccountTreeTwoToneIcon
      },
      {
        name: 'Package',
        icon: AssignmentIndTwoToneIcon,
        link: '/packages',
      },
    ]
  }
];

export default menuItems;
