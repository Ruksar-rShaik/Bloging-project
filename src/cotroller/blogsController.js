
const  moment  = require("moment");
const authorModel = require("../models/authorModel");


const blogsModel = require("../models/blogsModel");

const createBlog = async (req, res) => {
  try {
    const data = req.body
    const authorId = await authorModel.findById(data.authorId).select({_id:1})
    if(!authorId) return res.status(404).send({msg:"invalid authorId"})

    const createBlog = await blogsModel.create(data)
    res.status(201).send({blog:createBlog})
    

    console.log(authorId);
  } catch (error) {
    res.status(400).send({ msg: error.message });
    console.log("error in createBlog", error.message);
  }
};




const getBlogs = async (req,res)=>{
    try {
        const filter = req.query
        console.log(filter);
        const getData = await blogsModel.find(filter)
        const getBlogs =  getData.filter((x)=>{
            return ((x.isDeleted === false) && (x.isPublished === true))
        })
        console.log(getBlogs);
        res.status(200).send({result:getBlogs})
    } catch (error) {
        res.status(401).send(error.message)
    }
}

const updateBlog= async(req,res)=>{
    const BlogId =req.params.blogId;
    if(!BlogId) return res.status(400).send({msg: "id Must be present"})
    const id= await  blogsModel.find({_id:BlogId})
    const checkStatus = id.filter((x)=>{
        return x.isDeleted == false
    })

 

const today = moment().format()
console.log(today);
    
    if(checkStatus.length===0) return res.status(404).send({msg:"document not found"})
    const body =req.body
    const Updated=await blogsModel.findOneAndUpdate({_id:BlogId}, {$set:body,$set:{isPublished:true},$set:{publishedAt:today}},{new:true})
    res.send({msg:Updated})

}

const deleteBlog = async (req,res)=>{
    let blogId=req.params.blogId
    if(!blogId) return res.status(400).send({msg:"Author Id is Not present"})
    let blog= await blogsModel.find({_id:blogId})
    console.log(blog)
   const checkBlogStatus = blog.filter((x)=>{
    return x.isDeleted == false
   })
   if(checkBlogStatus.length===0) return res.status(404).send({msg:"document is not present"})
   
    
    let deleted= await blogsModel.findOneAndUpdate({_id:blogId},{$set:{isDeleted:true}}, {new:true})
    res.status(200).send({result:200})
}




module.exports = {
    createBlog,
    getBlogs,updateBlog,deleteBlog
}