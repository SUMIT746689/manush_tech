export const mySqlDateConverter = (e) => {
    let date;
    date = new Date(e);
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}

export const convertToDate = (date: string = null): Date => {

    const date_ = new Date(date || Date.now());
    date_.setUTCHours(0)
    date_.setUTCMinutes(0);
    date_.setUTCSeconds(0);
    date_.setUTCMilliseconds(0);
    return date_;
} 