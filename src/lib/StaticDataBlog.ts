import User from "@/models/User";
import connectToDatabase from "./db";
import PostCategory from "@/models/PostSections/PostCategory";
import PostMainSection from "@/models/PostSections/PostMainSectionModel";

export async function getBlogs() {
await connectToDatabase();

await User.find({});
await PostCategory.find({});
const Posts = await PostMainSection.find({ vadmin: 'approve' })
  .populate('postcategory')
  .populate('user', '_id username')
  .exec();
  return JSON.stringify(Posts );


}



export async function fetchBlogData(
   id:string
  ) {
    await connectToDatabase();

      const postcategory = id;
  
      if (!postcategory || typeof postcategory !== 'string') {
      console.log("PostCategory is required and should be a string")
      }
  
      // Find the category by name const blog = await BlogMainSection.findOne({ slug: slugblog, vadmin: "not-approve" })
      const foundCategory = await PostCategory.findOne({ slug: postcategory,vadmin: "approve" });

      if (!foundCategory) {
        console.log("PostCategory")
      }
     
      // Find products by the category ID
      const blog = await PostMainSection.find({ postcategory: foundCategory?._id ,vadmin: "approve"}).populate('postcategory' , 'slug').exec();
  
      return JSON.stringify(blog );
   
  }


  export async function fetchDatapostid(
    id:string
   ) {
    // Ensure the database connection is established
    await connectToDatabase(); 
    const slugblog = id;

    // Validate the slugblog parameter
    if (!slugblog || typeof slugblog !== 'string') {
     
   console.log('Blog name is required and should exist' )
    }

    // Fetch all necessary data
    await User.find();
    await PostCategory.find();
    

    // Fetch the blog with the given slug
   
     const blog = await PostMainSection.findOne({ slug: slugblog, vadmin: "approve" })
    .populate('postcategory')
    .populate('user','_id username')
    .exec();
   

    // Check if the blog was found
    if (!blog) {
      console.log('Blog not found' )
     
    }
    return JSON.stringify(blog );
    
  }

  export async function getCategorypost() {
  await connectToDatabase(); // Ensure the database connection is established

    // Fetch all categories but only return the name and imageUrl fields
    const categories = await PostCategory.find({}) // Only select the 'name' and 'imageUrl' fields

    // Return the fetched category names and image URLs

    return  categories.map((categorie) => ({
      ...categorie,
      name:categorie.name,
      slug:categorie.slug,
      vadmin: categorie.vadmin ,
    }));
   }
