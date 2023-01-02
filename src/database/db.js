const { default: mongoose } = require("mongoose");

const dbConnection = async (url)=>{
    try {
        // const url = "mongodb+srv://Ashish:94SCYHhauNyG7Fbl@project-1-bloggingproje.h7kuu09.mongodb.net/test"
        await mongoose.connect(url,{useNewUrlParser:true})
        console.log("batabase connected");
    } catch (error) {
        console.log("error while connecting database", error.message);
    }
}

module.exports = {dbConnection}