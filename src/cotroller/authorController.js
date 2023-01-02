const authorModel = require("../models/authorModel");

const create = async (req,res)=>{
   try {
    const body = req.body
    
    const createAuthor = await authorModel.create(body)
    res.status(201).send(createAuthor)
   } catch (error) {
    res.status(500).send({error:error.message})
    console.log("Error while Create",error.message);
   }
}





module.exports = {
    create
}