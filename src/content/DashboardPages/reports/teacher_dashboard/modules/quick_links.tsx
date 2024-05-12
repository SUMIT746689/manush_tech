import { ModuleQuickLinkButtonWrapper } from "@/components/DashboardQuickLinkButtonWrapper"
import { AccountingIcon, AttendanceIcon, ExamIcon, FeesCollectionIcon, NoticeIcon, OnlineAddmissionIcon, ReportIcon, RoutineIcon, SmsIcon, StudentRegIcon, TeacherIcon, TeacherRoutineIcon, WebsiteSettingsIcon } from "@/components/Icon"


const quickLinksColors = [
    { dark: "#006ADC", light: "#E1F0FF" },
    { dark: "#9C2BAD", light: "#F9E5F9" },
    { dark: "#CA3214", light: "#FFE6E2" },
]

const student_attendence = [
    { color: quickLinksColors[1], linkUrl: "/management/attendence/normalAttendence", icon: < AttendanceIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Student Attendence" },
    { color: quickLinksColors[2], linkUrl: "/management/attendence/examAttendence", icon: < AttendanceIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Exam Attendence" },
]

const class_exam = [
    { color: quickLinksColors[0], linkUrl: "/management/exam/exam_terms", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Exam Terms" },
    { color: quickLinksColors[1], linkUrl: "/management/exam", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Exams" },
    { color: quickLinksColors[2], linkUrl: "/management/exam/addtional_marks", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[2].dark} />, name: "Exams Addtional Marks" },
    { color: quickLinksColors[1], linkUrl: "/management/exam/seat-plan", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Exams Seat Plan" },
    { color: quickLinksColors[0], linkUrl: "/management/exam/question", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Exam Questions" },
]

const mark_entry = [
    { color: quickLinksColors[0], linkUrl: "/management/result", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Section Wise Result" },
    { color: quickLinksColors[1], linkUrl: "/management/result/addtional_result", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Exam Addtional Mark" },

]

const student_home_work = [
    { color: quickLinksColors[0], linkUrl: "/management/homework", icon: <WebsiteSettingsIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Student Homework" },
]

const salary = [

]

const notice = [

]

const routine = [
    { color: quickLinksColors[1], linkUrl: "/management/routine/class_routine", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Class Routine" },
    { color: quickLinksColors[0], linkUrl: "/management/routine/exam_routine", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Exam Routine" },
]

const study_materials = [
]

const sms = [
    { color: quickLinksColors[0], linkUrl: "/management/attendence/normalAttendence", icon: <SmsIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Send Student Sms" },
]
const my_attendence = [

]
const report = [

]
const leave = [
    { color: quickLinksColors[0], linkUrl: "/management/holidays", icon: < NoticeIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Holidays" },
    { color: quickLinksColors[1], linkUrl: "/management/leave", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Leave Application" },
]
const work_schedule = [

]
const other_activities = [
    { color: quickLinksColors[0], linkUrl: "/daily_notes/entry_notes", icon: < NoticeIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Add Student Notes" },
    { color: quickLinksColors[0], linkUrl: "/management/result", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[0].dark} />, name: "Section Wise Result" },
    { color: quickLinksColors[1], linkUrl: "/management/result/addtional_result", icon: <ExamIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "Exam Addtional Mark" },
    { color: quickLinksColors[1], linkUrl: "/certificate/teacher_certificate", icon: <RoutineIcon style={{ margin: 'auto' }} fillColor={quickLinksColors[1].dark} />, name: "My Certificate" },
]

export default {
    student_attendence, class_exam, mark_entry, student_home_work, salary, notice, routine, study_materials, sms,
    my_attendence, report, leave ,work_schedule, other_activities
}