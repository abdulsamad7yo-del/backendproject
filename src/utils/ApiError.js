
class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went worng",
        errors=[],
        stack=""
        
    ){
        
        super(message)
        this.statusCode=statusCode
        this.data= null
        this.message=message
        this.success=false
        this.errors=errors

        // some times need to know exact satck trace
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}