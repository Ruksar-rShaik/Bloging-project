const authorController = require("../cotroller/authorController.js")
const blogsController = require("../cotroller/blogsController.js")
const express = require("express")

const router = express.Router()


router.post("/authors", authorController.create)
router.post("/blogs", blogsController.createBlog)
router.get("/blogs", blogsController.getBlogs)
router.put("/blogs/:blogId", blogsController.updateBlog)
router.delete("/blogs/:blogId", blogsController.deleteBlog)




module.exports=router