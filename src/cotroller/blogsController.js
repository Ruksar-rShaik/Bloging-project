// const validateNameLastName = require("../validators/validators.js");

const { log } = require("console");
const  moment  = require("moment");
const authorModel = require("../models/authorModel");
const blogsModel = require("../models/blogsModel");


const createBlog = async (req, res) => {
  try {
    const data = req.body

    let validate = /^([a-z A-Z $@&:]){2,50}$/

    let validateObjectId = /^[a-f\d]{24}$/i
    
    if(Object.keys(data).length==0) return res.status(400).send("body is empty")

    const {title,body,authorId,category} = data

    if(!title) return res.status(400).send("title is mandatory")

    if(!body) return res.status(400).send("body is mandatory")

    if(!authorId) return res.status(400).send("AuthorId is mandatory")

    if(!category) return res.status(400).send("category is mandatory")

    if(!validate.test(title)) return res.status(400).send("plz Enter valid title")

    if(!validate.test(body)) return res.status(400).send("plz Enter valid body")

    if(!validateObjectId.test(authorId)) return res.status(400).send("plz Enter valid authorId")

    if(!validate.test(category)) return res.status(400).send("plz Enter valid category")

    const checkAuthorId = await authorModel.findById(authorId)

    if(!checkAuthorId) return res.status(404).send({msg:"invalid authorId or document not found"})

    const createBlog = await blogsModel.create(data)

    res.status(201).send({blog:createBlog})
    

  } catch (error) {

    res.status(400).send({ msg: error.message });
    console.log("error in createBlog", error.message);

  }
};




const getBlogs = async (req,res)=>{
    try {
        const filter = req.query

        let keys = Object.keys(filter)

        if(keys.length==0) return res.status(400).send("Enter Query or enter valid query")

        const getData = await blogsModel.find(filter).populate("authorId")

        if(getData.length===0) return res.status(404).send("Document not found")

        const getBlogs =  getData.filter((x)=>{
            return ((x.isDeleted === false) && (x.isPublished === true))
        })
      
        if(getBlogs.length===0) return res.status(404).send("user not found")
      
        res.status(200).send({result:getBlogs})

    }   catch (error) {

        res.status(401).send(error.message)
        console.log("error in getBlogs", error.message);
    }
}

const updateBlog= async(req,res)=>{
    try {

    const data = req.body

    const blogId = req.params.blogId;

    let validate = /^([a-z A-Z ]){2,30}$/

    // let validateObjectId = /^[a-f\d]{24}$/i
   
    if(Object.keys(data).length==0) return res.status(400).send("body is empty")

    const {title,body,tags,authorId,category,subcategory} = data
            
        
    // let checkAuthorId = await authorModel.findById(authorId)
    // if(!checkAuthorId) return res.status(400).send("authorId is invalid, plz Enter valid authorId")
    // if(!validateObjectId.test(authorId)) return res.status(400).send("plz Enter valid authorId")
    if(!blogId) return res.status(400).send({msg: "id Must be present"})
    if(!validate.test(title)) return res.status(400).send("plz Enter valid title")
    if(!validate.test(body)) return res.status(400).send("plz Enter valid body")
    if(!validate.test(tags)) return res.status(400).send("plz Enter valid tags")
    if(!validate.test(category)) return res.status(400).send("plz Enter valid category")
    if(!validate.test(subcategory)) return res.status(400).send("plz Enter valid subcategory")
   

    const id= await  blogsModel.findOne({_id:blogId},{isDeleted:false})
    
    if(!id) return res.status(404).send({msg:"document not found or invalid id"})

    let currentdate=moment().format("YYYY-MM-DD HH:mm:ss")
  
    const updated=await blogsModel.findOneAndUpdate({_id:blogId},{$set:{isPublished:true,title:data.title,publishedAt:currentdate},$push:{tags:data.tags,subcategory:data.subcategory}},{new:true})
   
    res.status(202).send({status:"updated", result:updated})
    
    } catch (error) {

      res.status(500).send(error.message)
      console.log("error in updateblog", error.message);

    }

}

const deleteBlog = async (req,res)=>{
   try {
    let blogId=req.params.blogId

    if(!blogId) return res.status(400).send({msg:"BlogId Id is Not present"})

    let checkBlog= await blogsModel.find({_id:blogId})

    if(!checkBlog) return res.status(404).send({msg:"Document not found with given id "})
  
    const checkBlogStatus = checkBlog.filter((x)=>{
    return x.isDeleted == false
   })

   if(checkBlogStatus.length===0) return res.status(404).send({msg:"document is not present"})
   
    let deleted= await blogsModel.findOneAndUpdate({_id:blogId},{$set:{isDeleted:true}}, {new:true})

    res.status(200).send({status:"success",deleteData:deleted})

   } catch (error) {

    res.status(500).send(error.message)
    console.log("error in delete blog", error.message);

   }
}



const deleteByQuery = async(req,res)=>{
   try {
    let filter = req.query
    let authId=req.decodedToken.Id
    console.log(authId)
    let keys = Object.keys(filter)


    if(keys.length==0) return res.status(400).send("Enter Query")

  
    const checkBlockStatus = await blogsModel.find(filter)
    console.log(checkBlockStatus)
 
    if(checkBlockStatus.length===0) return res.status(404).send({msg:"Document not found"})
    let xyz=checkBlockStatus.authorId

    const checkauthId=checkBlockStatus.filter(x=>x.authorId==authId)
    if(checkauthId.length==0) return res.status(403).send("you are unauthorized")

    const checkDelete=checkBlockStatus.filter((x)=>(x.isDeleted==false))
    if(checkDelete.length===0) return res.status(404).send({msg:"not found"})
    
    
    const delteItem = await blogsModel.updateMany({filter,authorId:xyz,isPublished:true,isDeleted:false},{$set:{isDeleted:true}},{new:true})
   
    if(!delteItem) return res.status(404).send({msg:"Document not found"})

    res.status(200).send(delteItem)

   } catch (error) {

    res.send(error.message)
    console.log("error in delete by query", error.message);

   }
}


module.exports = {
    createBlog,
    getBlogs,deleteBlog,deleteByQuery,updateBlog
}