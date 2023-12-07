export const todayMinMaxDateTime = () => {
    const today = new Date(Date.now());
    // utc day start time 
    const min_attend_datetime = new Date(today);
    min_attend_datetime.setHours(0, 0, 0, 0);

    // utc day end time
    const max_attend_datetime = new Date(today);
    max_attend_datetime.setHours(23, 59, 59, 999);

    return { min_attend_datetime, max_attend_datetime };
};