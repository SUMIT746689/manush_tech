export const makeCookie = (serialize: Function, cookie_name: string, data: string, maxAge: number) => {
    return serialize(cookie_name, data, {
        path: '/',
        maxAge: maxAge,
        // expires: maxAge,
        secure: process.env.NODE_ENV === 'production'
    })
}