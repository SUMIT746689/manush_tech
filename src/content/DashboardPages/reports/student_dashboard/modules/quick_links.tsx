import { ModuleQuickLinkButtonWrapper } from "@/components/DashboardQuickLinkButtonWrapper"
import { AccountingIcon, AttendanceIcon, ExamIcon, FeesCollectionIcon, NoticeIcon, OnlineAddmissionIcon, ReportIcon, RoutineIcon, SmsIcon, StudentRegIcon, TeacherIcon, TeacherRoutineIcon, WebsiteSettingsIcon } from "@/components/Icon"


const quickLinksColors = [
    { dark: "#006ADC", light: "#E1F0FF" },
    { dark: "#9C2BAD", light: "#F9E5F9" },
    { dark: "#CA3214", light: "#FFE6E2" },
]


const class_routine = [
    { color: quickLinksColors[1], linkUrl: "/management/routine/class_routine", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Class Routine" },
]

const view_attendence = [
    { color: quickLinksColors[2], linkUrl: "/management/attendence/show_student_attendence", icon: < AttendanceIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Exam Attendence" },

]
const home_work = [
    { color: quickLinksColors[0], linkUrl: "/management/homework", icon: <WebsiteSettingsIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "homework" },
]

const study_materials = [
    { color: quickLinksColors[0], linkUrl: "/management/syllabus", icon: <WebsiteSettingsIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Syllabus" },
    { color: quickLinksColors[1], linkUrl: "/management/leave", icon: < NoticeIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Leave Application" },
]
const notice = [
    // { color: quickLinksColors[0], linkUrl: "/front_end/notice", icon: < NoticeIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Notice" },
]

const payment_report = [
    { color: quickLinksColors[1], linkUrl: "/reports/fees/payment_history", icon: <FeesCollectionIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: 'Fees Payment History' },
    { color: quickLinksColors[2], linkUrl: "/reports/fees/recipt_report", icon: <FeesCollectionIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: 'Fees Recipt Report' }
]

const admit_card = [

]

const exam_routine = [
    { color: quickLinksColors[0], linkUrl: "/management/routine/exam_routine", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Exam Routine" },

]
const mark_sheet = [
    { color: quickLinksColors[2], linkUrl: "/management/result/student_result", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Student Result" },
]

const tabulation_sheet = [

]

const certificate = [
    { color: quickLinksColors[1], linkUrl: "/certificate/student_certificate", icon: <TeacherRoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Student Certificates" },
]

export default {
    class_routine,
    view_attendence, home_work, study_materials, notice, payment_report, admit_card, exam_routine, mark_sheet, tabulation_sheet, certificate
}