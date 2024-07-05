export const todayMinMaxDateTime = () => {
    const today = new Date(Date.now());
    // utc day start time 
    const min_attend_datetime = new Date(today);
    min_attend_datetime.setHours(0, 0, 0, 0);

    // utc day end time
    const max_attend_datetime = new Date(today);
    max_attend_datetime.setHours(23, 59, 59, 999);

    return { today, min_attend_datetime, max_attend_datetime };
};

export const customizeDateWithTime = (date) => {
    // if (typeof date !== 'string') return '';
    const dateObj = new Date(date)
    const formateDate_ = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: "short" })
    return formateDate_.format(dateObj)
}


export const todayMinMaxDateTimeUtcZeroFormat = () => {
    const today = new Date(Date.now());
    if (today.getTimezoneOffset !== 0) {
        // utc day start time
        const min_attend_datetime = new Date(today);
        min_attend_datetime.setHours(0, 0, 0, 0);

        // utc day end time
        const max_attend_datetime = new Date(today);
        max_attend_datetime.setHours(23, 59, 59, 999);

        return { today, min_attend_datetime, max_attend_datetime };
    }

    // utc day start time (bd wise)
    const min_attend_datetime = new Date(today);
    min_attend_datetime.setHours(6, 0, 0, 0);

    // utc day end time (bd wise)
    const max_attend_datetime = new Date(today);
    max_attend_datetime.setHours(17, 59, 59, 999);

    return { today, min_attend_datetime, max_attend_datetime };

};
