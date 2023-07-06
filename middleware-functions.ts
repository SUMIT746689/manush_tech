export function middleware1 (handler){
    //   return NextResponse.redirect(new URL('/about-2', request.url))
    console.log("hitted");
    return (req, res) => {
        console.log("hitted", req.url);

        handler(req, res)
    }

}
export function middleware2 (second){
    
return (req, res) => {  
    console.log("second");
    
    second(req,res)
}    
}
