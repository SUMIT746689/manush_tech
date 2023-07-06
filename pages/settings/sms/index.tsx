import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';

const SMSSettings = () => {
  return (
    <>
      <div>this is sms settings page</div>
    </>
  )
}

SMSSettings.getLayout = (page) => {
  return (
    <Authenticated name="SMS">
      <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
  )
}

export default SMSSettings