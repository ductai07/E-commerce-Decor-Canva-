const { CURSOR_FLAGS } = require("mongodb")
const {default: mongoose, model} = require("mongoose")
mongoose.set("strictQuery",false)
const dbConnect = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        if(conn.connection.readyState ==1 ){
            console.log("Ket noi DB thanh cong")
        }
        else console.log("Db connecting")
    } catch (error) {
        console.log("DB connect fail")
        throw new Error(error)
    }
}

module.exports = dbConnect