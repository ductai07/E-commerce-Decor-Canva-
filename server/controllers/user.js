const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const register = asyncHandler(async(req,res)=>{
    const {email,password,firstname,lastname} = req.body
    // console.log(req.body); 
    if( !email || !password || !lastname || !firstname){
        return res.status(400).json({
            succes: false,
            mes :'mising inputs'
        })
    }
    const response = await User.create(req.body)
    return res.status(200).json({
        succes : response ? true : false,
        response 
    })
})

module.exports = {
    register
}