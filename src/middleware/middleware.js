const { log } = require("console");
const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel");


const tokenVerify = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
   
    if (!token)
      return res.send({ status: false, msg: "token must be present" });

  jwt.verify(token, "Bloging-site-is-very-secure", function(err,decodedToken){
    if (err) return res.status(401).send({msg:"Invalid Token"})
    req.decodedToken=decodedToken
    
    next();
  })

  } catch (error) {
    res.status(500).send(error.message);
  }
};

const userVerify = async (req,res,next) => {
  let blogId = req.params.blogId

  let token = req.headers["x-api-key"];
 
  let validateObjectId = /^[a-f\d]{24}$/i

  if(!blogId) return res.status(400).send({msg:"BlogId Id is Not present"})
 
  if(!validateObjectId.test(blogId)) return res.status(400).send("invalid id")
  
  let decodedToken = jwt.verify(token, "Bloging-site-is-very-secure");

  let id  = decodedToken.Id

  let findAuthor = await blogsModel.findOne({_id:blogId})
   
  if(!findAuthor) return res.send("invalid blog id")

  let authorId = findAuthor.authorId

  if(id!=authorId) return res.status(404).send("user not found")

  next()

}


// const userQueryVerify = async (req,res,next) => {
    
//   let body = req.query

//   let token = req.headers["x-api-key"];
 
//   let validateObjectId = /^[a-f\d]{24}$/i
  
//   let decodedToken = jwt.verify(token, "Bloging-site-is-very-secure");

//   let id  = decodedToken.Id
//   let findAuthor = await blogsModel.find(body)
//   console.log(findAuthor)
  
//   if(!findAuthor) return res.send("invalid blog id")

//   let authorId = findAuthor.authorId

//   if(id!=authorId) return res.status(404).send("user not found")

//   next()

// }



 module.exports = { tokenVerify,userVerify};
