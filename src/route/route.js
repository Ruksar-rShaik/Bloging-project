
const express = require("express")

const router = express.Router()


router.post("/authors", (req,res)=>{
    res.send("hello")
})


module.exports=router