//see! I'm making this not "is logged in admin" because my backend only have this login feature for admin not for any other personality

export const isLoggedin = (req, res, next)=>{
    try{
        const authCookie = req.cookies.admin;
        if(authCookie == 'success'){
            next();
        }
        return res.json({message:"Admin is not logged in"})
    }
    catch(err){
        res.status(504).json({
            message: "Something error occured in cookie getting",
            error: err.message
        })
    }
}