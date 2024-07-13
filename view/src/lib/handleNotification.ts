export const handleNotification = (notifications: any, error: any) => {
    notifications.show({ message: error.data.message, color: 'red' })
}