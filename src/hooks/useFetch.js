
export default function useFetch() {
    
    
    const HTTPCall = async (path, method = "GET", body = null) => {
        let options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
        }

        if (body) {
            options = {...options, body: JSON.stringify(body),}
        }

        return new Promise(async (resolve, reject) => {
            try {
                // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}${path}`, options)
                const res = await fetch(`${path}`, options)
                
                if (res.ok) {
                    // return resolve([{
                    //     data: await res.json(),
                    //     status: res.status,
                    //     ok: res.ok
                    // }, null])
                    return resolve(await res.json())
                } else {
                    // resolve([null, {data: await res.json(), status: res.status}])
                    resolve(await res.json())
                }
            }catch (e) {
                // resolve([null, e])
                reject(e)
            }
        })
    }

    return {HTTPCall}
}