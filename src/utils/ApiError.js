
class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went worng",
        errors=[],
        satck=""
        
    ){
        super(message)
        this.statusCode=statusCode
        this.data= null
        this.message=message
        this.success=false
        this.errors=errors

        // some times need to know exact satck trace
        if(stack){
            this.stack=satck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}