const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const verifyAccessToken = async (req, res, next) => {
    // Kiểm tra header có chứa token không
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                // Gán thông tin user vào req
                req.user = decoded
                next()
            }
        } catch (error) {
            return res.status(401).json({
                success: false,
                mes: 'Token không hợp lệ hoặc hết hạn'
            })
        }
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Không tìm thấy token xác thực'
        })
    }
}
const isAdmin = asyncHandler(async(req,res)=>{
    const {role} = req.user 
    if(role != 'admin')
        return res.status(401).json({
            success : false,
            mes : 'REQUIRE ADMIN ROLE'
        })
    next()    
})

module.exports = { verifyAccessToken,
    isAdmin
}