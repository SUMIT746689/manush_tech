export const handleShowErrMsg = (err, showNotification) => {
    return showNotification(err?.response?.data?.error || err?.response?.data?.message || err?.message, 'error');
}