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

export const menuItems: MenuItems[] = [
  {
    items: [
      {
        name: 'Dashboard',
        icon: DashboardIcon,
        link: '/dashboards/',

      },
      {
        name: 'Academic',
        icon: HouseSidingIcon,
        items: [
          {
            name: ' Classes',
            icon: ClassIcon,
            link: '/management/classes'
          },
          {
            name: ' Sections',
            link: '/management/sections',
            icon: AllInboxIcon
          },
          {
            name: ' Subjects',
            link: '/management/subjects',
            icon: MenuBookIcon
          },
          {
            name: ' Group',
            link: '/management/group',
            icon: GroupsIcon
          },
          {
            name: 'Addtional Marking Categories',
            link: '/management/addtional_marking_categories',
            icon: PostAddIcon
          }
        ]
      },
      {
        name: 'Administrator',
        icon: AdminPanelSettingsIcon,
        items: [
          {
            name: 'Academic Years',
            link: '/management/academic_years',
            icon: CalendarMonthIcon
          },
          {
            name: 'Grading system',
            link: '/management/grade',
            icon: GradeIcon
          },
          {
            name: 'Users',
            icon: AssignmentIndTwoToneIcon,
            link: '/management/users',
          },
        ]
      },
      {
        name: 'Schools',
        link: '/management/schools',
        icon: SchoolIcon
      },
      {
        name: 'Exam',
        icon: AssignmentIcon,
        items: [
          {
            name: 'Manage Exam',
            link: '/management/exam',
            icon: AssignmentIcon
          },
          // {
          //   name: 'Addtional Marks',
          //   link: '/management/exam/addtional_marks',
          //   icon: AssignmentIcon
          // },
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
      {
        name: 'Syllabus',
        link: '/management/syllabus',
        icon: SummarizeIcon
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
        name: 'Teachers',
        icon: AccountBalanceIcon,
        items: [
          {
            name: 'Manage Teacher',
            link: '/management/teachers',
            icon: RecordVoiceOverIcon
          },
          {
            name: ' Department',
            icon: GridOnIcon,
            link: '/management/department',
          },
          {
            name: 'Teachers recruitment',
            link: '/management/teachers/teachers-recruitment',
            icon: RecordVoiceOverIcon
          },
        ]
      },
      {
        name: 'Students',
        icon: AccessibilityIcon,
        items: [
          {
            name: 'Manage Student',
            link: '/management/students',
            icon: RecordVoiceOverIcon
          },
          {
            name: 'Online admission',
            link: '/management/students/online-admission',
            icon: RecordVoiceOverIcon
          },

        ]
      },
      {
        name: 'Discount',
        link: '/management/discount',
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
        name: 'Daily Notes',
        icon: NotesIcon,
        items: [
          {
            name: 'Entry Notes',
            link: '/daily_notes/entry_notes',
            icon: NoteAddIcon
          },
          {
            name: 'Show Notes',
            link: '/daily_notes/show_notes',
            icon: FormatListBulletedIcon
          },
        ]
      },
      {
        name: 'Attendence',
        icon: CheckCircleOutlineIcon,
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
          {
            name: 'Employee Attendence',
            link: '/management/attendence/employeeAttendence',
            icon: GroupIcon
          },
          {
            name: 'Student Exam Attendence',
            value: 'show_student_exam_attendence',
            link: '/management/attendence/show_student_attendence',
            icon: GroupIcon
          }
        ]
      },
      {
        name: 'Routine',
        icon: CalendarTodayIcon,
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
      },
      {
        name: 'Reports',
        icon: AssessmentIcon,
        items: [
          {
            name: 'Attendence',
            icon: CheckCircleOutlineIcon,
            items: [
              {
                name: 'Students',
                link: '/reports/attendence/student/normal',
                icon: AccessibilityIcon
              },
              {
                name: 'Exam',
                link: '/reports/attendence/student/exam',
                icon: ArticleIcon
              },
              {
                name: 'Employee',
                link: '/reports/attendence/employee',
                icon: GroupIcon
              }
            ]
          },
          {
            name: 'Fees',
            icon: PaidIcon,
            items: [
              {
                name: 'Payment history',
                link: '/reports/fees/payment_history',
                icon: HistoryIcon
              },
              {
                name: 'Recipt report',
                link: '/reports/fees/recipt_report',
                icon: HistoryIcon
              },

            ]
          },
          {
            name: 'Exam',
            icon: ArticleIcon,
            items: [
              {
                name: 'Report card',
                link: '/reports/exam/report_card',
                icon: DescriptionIcon
              },
              {
                name: 'Tabulation sheet',
                link: '/reports/exam/tabulation_sheet',
                icon: DescriptionIcon
              },
              {
                name: 'Merit List',
                link: '/reports/exam/merit_list',
                icon: DescriptionIcon
              },
              {
                name: 'Progress Report',
                link: '/reports/exam/progress_report',
                icon: DescriptionIcon
              },
              {
                name: 'Result sheet',
                link: '/reports/exam/result_sheet',
                icon: DescriptionIcon
              },

            ]
          },
          {
            name: 'Financial Reports',
            icon: LocalAtmIcon,
            items: [
              {
                name: 'Account Statement',
                link: '/reports/financial_reports/account_statement',
                icon: AccountBalanceWalletIcon
              },
              {
                name: 'Income Report',
                link: '/reports/financial_reports/income_report',
                icon: AttachMoneySharpIcon
              },
              {
                name: 'Expence Report',
                link: '/reports/financial_reports/expense_report',
                icon: MoneyOffCsredSharpIcon
              },
              {
                name: 'Transactions Report',
                link: '/reports/financial_reports/transactions_report',
                icon: JoinFullSharpIcon
              },
              {
                name: 'Balance Sheet',
                link: '/reports/financial_reports/balance_sheet',
                icon: AccountBalanceWalletSharpIcon
              },
              {
                name: 'Income VS Expense',
                link: '/reports/financial_reports/income_vs_expense',
                icon: BorderBottomSharpIcon
              },

            ]
          },
        ]
      },
      {
        name: 'Fees',
        icon: AccountBalanceIcon,
        items: [
          {
            name: 'Fees',
            link: '/management/fees',
            icon: PaidIcon
          },
          {
            name: 'Payment',
            link: '/management/fees/student_payment',
            icon: PaidIcon
          },
          {
            name: 'Payment History',
            icon: AccountTreeTwoToneIcon,
            link: '/management/fees/student_payment_history',
          },
          {
            name: 'Collect Fee',
            icon: AccountTreeTwoToneIcon,
            link: '/management/student_fees_collection',
          },
        ]
      },
      {
        name: 'Office Accounting',
        icon: AccountBalanceIcon,
        items: [
          {
            name: 'Account',
            link: '/management/accounting/account',
            icon: PaidIcon
          },
          {
            name: 'Voucher Head',
            link: '/management/accounting/voucher_head',
            icon: PaidIcon
          },

          {
            name: 'New Deposit',
            link: '/management/accounting/voucher_deposit',
            icon: PaidIcon
          },
          {
            name: 'New Expense',
            link: '/management/accounting/voucher_expense',
            icon: PaidIcon
          },
          {
            name: 'All transactions',
            link: '/management/accounting/all_transactions',
            icon: PaidIcon
          },
          {
            name: 'Profit and loss',
            link: '/management/accounting/profit_and_loss',
            icon: PaidIcon
          },
        ]
      },
      {
        name: 'Holidays',
        link: '/management/holidays',
        icon: HolidayVillageIcon
      },
      {
        name: 'Package',
        icon: ShoppingBagIcon,
        link: '/packages',
      },
      {
        name: 'Pending Package',
        icon: ShoppingBagIcon,
        link: '/pending_packages',
      },
      {
        name: 'Pending Buy Sms',
        icon: ShoppingBagIcon,
        link: '/pending_sms_requests',
      },
      {
        name: 'Front End',
        icon: CameraFrontIcon,
        link: '/front_end',
      },

      {
        name: 'Notice',
        icon: WifiTetheringErrorIcon,
        link: '/front_end/notice',
      },
      {
        name: 'Leave Application',
        icon: WifiTetheringErrorIcon,
        link: '/management/leave',
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
      {
        name: 'Send Sms / Email',
        icon: NotificationsActiveIcon,
        items: [
          {
            name: 'Send SMS ',
            link: '/bulk_sms_and_email/send_sms',
            icon: SendIcon
          },
          {
            name: 'Send EMAIL',
            link: '/bulk_sms_and_email/send_email',
            icon: SendIcon
          },
          {
            name: 'SMS / EMAIL Report',
            link: '/bulk_sms_and_email/sent_sms_or_email_report',
            icon: LocalPrintshopIcon
          },
          {
            name: 'SMS Template',
            link: '/bulk_sms_and_email/sms_template',
            icon: TextsmsIcon
          },
          {
            name: 'EMAIL Template',
            link: '/bulk_sms_and_email/email_template',
            icon: DraftsIcon
          },
        ]
      },
      {
        name: 'System',
        icon: SettingsSuggestIcon,
        items: [
          {
            name: 'Package Request',
            link: '/settings/package_request',
            icon: RequestQuoteIcon
          },
          {
            name: 'Sms Request',
            link: '/settings/sms_request',
            icon: RequestQuoteIcon
          },
          {
            name: 'SMS',
            link: '/settings/sms',
            icon: RequestQuoteIcon
          },
        ]
      },
    ]
  }
];

export default menuItems;
