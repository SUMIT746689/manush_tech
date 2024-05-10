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
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import GridOnIcon from '@mui/icons-material/GridOn';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import TextsmsIcon from '@mui/icons-material/Textsms';
import DraftsIcon from '@mui/icons-material/Drafts';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import MoneyOffCsredSharpIcon from '@mui/icons-material/MoneyOffCsredSharp';
import JoinFullSharpIcon from '@mui/icons-material/JoinFullSharp';
import AccountBalanceWalletSharpIcon from '@mui/icons-material/AccountBalanceWalletSharp';
import BorderBottomSharpIcon from '@mui/icons-material/BorderBottomSharp';
import GradeIcon from '@mui/icons-material/Grade';
import WifiTetheringErrorIcon from '@mui/icons-material/WifiTetheringError';
import NotesIcon from '@mui/icons-material/Notes';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import FenceIcon from '@mui/icons-material/Fence';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

  items?: MenuItem[];
  name: string;
  value?: string;
}

export interface MenuItems {
  items: MenuItem[];
  // heading: string;
}

const module_dashboard: MenuItem = {
  name: 'Module Dashboard',
  icon: DashboardIcon,
  link: '/dashboards/modules/teacher',
};

const student_attendence: MenuItems[] = [
  {
    items: [
      {
        name: 'Students Attendence',
        link: '/management/attendence/normalAttendence',
        icon: AccessibilityIcon
      },
      {
        name: 'Exam Attendence',
        link: '/management/attendence/examAttendence',
        icon: ArticleIcon
      },
    ]
  }
]

const class_exam: MenuItems[] = [
  {

    items: [
      {
        name: 'Exam',
        icon: AssignmentIcon,
        items: [
          {
            name: 'Manage Exam Term',
            link: '/management/exam/exam_terms',
            icon: AssignmentIcon
          },
          {
            name: 'Manage Exam',
            link: '/management/exam',
            icon: AssignmentIcon
          },
          {
            name: 'Addtional Marks',
            link: '/management/exam/addtional_marks',
            icon: AssignmentIcon
          },
          {
            name: 'Exam seat plan',
            link: '/management/exam/seat-plan',
            icon: AssignmentIcon
          },
          {
            name: 'Exam Question',
            link: '/management/exam/question',
            icon: AssignmentIcon
          },
        ]
      },
    ]
  }
]

const mark_entry: MenuItems[] = [
  {
    items: [
      {
        name: 'Section Wise Result',
        link: '/management/result',
        icon: AssignmentIcon
      },
      {
        name: 'Exam Addtional Marks',
        link: '/management/result/addtional_result',
        icon: AutoAwesomeMotionIcon
      },
    ]
  }
]

const student_home_work: MenuItems[] = [
  {
    items: [
      {
        name: 'Home work',
        link: '/management/homework',
        icon: SummarizeIcon
      },
    ]
  }
]

const salary: MenuItems[] = [
  {
    items: [
    ]
  }
]
const notice: MenuItems[] = [
  {
    items: [
    ]
  }
]
const routine: MenuItems[] = [
  {
    items: [
      {
        name: 'Class Routine',
        link: '/management/routine/class_routine',
        icon: AccessibilityIcon
      },
      {
        name: 'Exam Routine',
        link: '/management/routine/exam_routine',
        icon: AccessibilityIcon
      },

    ]
  }
]
const study_materials: MenuItems[] = [
  {
    items: []
  }
]
const sms: MenuItems[] = [
  {
    items: [
      {
        name: 'Students Attendence',
        link: '/management/attendence/normalAttendence',
        icon: AccessibilityIcon
      },
    ]
  }
]
const my_attendence: MenuItems[] = [
  {
    items: [
    ]
  }
]
const report: MenuItems[] = [
  {
    items: [
    ]
  }
]
const leave: MenuItems[] = [
  {
    items: [
      {
        name: 'Holidays',
        link: '/management/holidays',
        icon: HolidayVillageIcon
      },
      {
        name: 'Leave Application',
        icon: WifiTetheringErrorIcon,
        link: '/management/leave',
      },
    ]
  }
]
const work_schedule: MenuItems[] = [
  {
    items: [
    ]
  }
]
const other_activities: MenuItems[] = [
  {
    items: [
      {
        name: 'Syllabus',
        link: '/management/syllabus',
        icon: SummarizeIcon
      },
      {
        name: 'Daily Notes',
        icon: NotesIcon,
        items: [
          {
            name: 'Entry Notes',
            link: '/daily_notes/entry_notes',
            icon: NoteAddIcon
          },
        ]
      },
      {
        name: 'Result',
        icon: AssignmentTurnedInIcon,
        items: [
          {
            name: 'Section Wise Result',
            link: '/management/result',
            icon: AssignmentIcon
          },
          {
            name: 'Exam Addtional Marks',
            link: '/management/result/addtional_result',
            icon: AutoAwesomeMotionIcon
          },
          {
            name: 'Student Wise Result',
            link: '/management/result/single',
            icon: AutoAwesomeMotionIcon
          },
          {
            name: 'Student Result',
            link: '/management/result/student_result',
            icon: AutoAwesomeMotionIcon
          },

        ]
      },
      {
        name: 'Certificate',
        icon: WorkspacePremiumIcon,
        items: [
          {
            name: 'Certificate Template',
            link: '/certificate/certificate_template',
            icon: DesignServicesIcon
          },
          {
            name: 'Student Certificate',
            link: '/certificate/student_certificate',
            icon: LocalPrintshopIcon
          },
          {
            name: 'Teacher Certificate',
            link: '/certificate/teacher_certificate',
            icon: LocalPrintshopIcon
          },
          {
            name: 'Employee Certificate',
            link: '/certificate/employee_certificate',
            icon: LocalPrintshopIcon
          },
        ]
      },
    ]
  }
]


export default {
  student_attendence, class_exam, mark_entry, student_home_work,
  salary, notice, routine, study_materials, sms, my_attendence, report, leave, work_schedule, other_activities,
  module_dashboard
};
