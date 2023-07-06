export const NewHTTPClient = () => {
  return new HTTPClient()
}

class HTTPClient {
  private path: string
  private readonly url: string
  private method: string
  private body: Object

  public SetPath(path:string){
    this.path = path
    return this
  }
  public SetBody(body:Object){
    this.body = body
    return this
  }
  public Post(){
    this.method = "POST"
    return this.call()
  }

  private async call() {
    try {
      let options:RequestInit = {
        method: this.method,
        cache: 'no-store'
      }

      if (this.body) options = {...options, body: JSON.stringify(this.body)}

      const res = await fetch(this.path, options)
      if (!res.ok) {
        return [null, await res.json()]
      }
      return [{
        data: await res.json(),
        status: res.status,
        ok: res.ok
      }, null]
    } catch (err) {
      return [null, err]
    }
  }
}