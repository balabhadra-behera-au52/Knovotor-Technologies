
const jwt = require("jsonwebtoken");


 const verifytoken =async(req,res,next)=>{
      
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if(!token){
        return res.status(200).json({message:"unauthorized"});
    }

    try {
        const data = jwt.verify(token,SECRET_KEY);
        req.user.id = data;
        
    } catch (error) {
        res.status(500).json({message:"token is required"});
    }

    return next();
 }



 module.exports = verifytoken;