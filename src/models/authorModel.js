const { default: mongoose } = require("mongoose");

const authorSchema = new mongoose.Schema({
    fname : {
        type:String,
        required:true,
        minlength : 3
        
    },
    lname:{
        type:String,
        required:true,
        minlength : 3
    },

    title : {
        type:String,
        required:true,
        enum : ["Mr","Mrs","Miss"]
    },

    email : {
        type : String,
        required:true,
        unique:true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    }
})


module.exports = mongoose.model("Authors", authorSchema)