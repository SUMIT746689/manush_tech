import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import TeacherModulesDashboard from '@/content/DashboardPages/reports/teacher_dashboard/modules';


function ModulesDashboardReports() {

    return (
        <TeacherModulesDashboard />
    )
}

ModulesDashboardReports.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default ModulesDashboardReports;
