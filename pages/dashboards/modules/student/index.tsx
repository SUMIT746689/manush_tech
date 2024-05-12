import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import StudentModulesDasboard from '@/content/DashboardPages/reports/student_dashboard/modules';


function ModulesDashboardReports() {

    return (
        <StudentModulesDasboard />
    )
}

ModulesDashboardReports.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default ModulesDashboardReports;
