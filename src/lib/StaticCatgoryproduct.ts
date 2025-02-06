
import connectToDatabase from "@/lib/db";
import Boutique from "@/models/Boutique";
import Brand from "@/models/Brand";
import Category, { ICategory } from "@/models/Category";
import Product, { IProduct } from "@/models/Product";
import Subcategory, { ISubcategory } from "@/models/Subcategory";


export async function searchcategory(id:string) {
    await connectToDatabase();
    const category=id;
    if (!category || typeof category !== 'string') {
       
         console.error('Category name is required and should be a string');
      
    }

      const foundCategory = await Category.findOne({ slug: category, vadmin: 'approve' }).exec();
      let search: ICategory | ISubcategory | null;
      if (foundCategory===null){
        search= await Subcategory.findOne({ slug: category, vadmin: 'approve' }).exec();
      }else{
        search=foundCategory
      }
     
 
    return JSON.stringify(search );
}

export async function getProductById(id:string) {


    await connectToDatabase();

    if (!id ) { 
        console.error("Invalid or missing product ");
    }
   
   
    await Category.find();
    await Brand.find();
    await Boutique.find();
    const product = await Product.findOne({ slug: id,vadmin:"approve" })
      .populate("category")
      .populate("boutique")
      .populate("brand").exec();



      return JSON.stringify(product );
}
export async function getproductbycatgory(categorySlug:string){

    // Ensure database connection
    await connectToDatabase();
  
    // Await the params object

    // Validate and ensure `categorySlug` is available
    if (!categorySlug) {
      console.error('Category slug is required');
      
    }

    let products:IProduct[]
    await Brand.find();
    // Find the category by slug with "approve" status
    const foundCategory = await Category.findOne({ slug: categorySlug, vadmin: 'approve' });

    if (!foundCategory) {
      const foundsubCategory = await Subcategory.findOne({ slug: categorySlug, vadmin: 'approve' });
      products= await Product.find({
        subcategory: foundsubCategory?._id,
        vadmin: 'approve',
      })
        .populate('category', 'name slug') // Populate category with only needed fields
        .populate('brand', 'name')  // Populate brand with only needed fields
        .populate("boutique", 'nom')      // Populate boutique with only needed fields
        .populate('user', 'name email')  // Populate user with only needed fields
        .exec();
      
    }else{

      products= await Product.find({
        category: foundCategory?._id,
        vadmin: 'approve',
      })
        .populate('category', 'name slug') // Populate category with only needed fields
        .populate('brand', 'name')        // Populate brand with only needed fields
        .populate("boutique", 'nom')      // Populate boutique with only needed fields
        .populate('user', 'name email')  // Populate user with only needed fields
        .exec();
    }
   /*  
    // Check if products exist for the category
    const productCount = await Product.countDocuments({
      category: foundCategory?._id,
      vadmin: 'approve',
    });

    if (productCount === 0) {
      console.error('No products found for this category.');
        
    } */

    // Fetch the products with populated references
   
      return JSON.stringify(products );
}

export async function getproductpromotionData() {

    await connectToDatabase();

    await Category.find();
    await Boutique.find();
    await Brand.find();
    const product = await Product.find({
      discount: { $gt: 0 },
      vadmin: "approve",
    })
      .populate("category")
      .populate("boutique")
      .populate("brand")
      .exec();

    

    return JSON.stringify(product);
  
  
}
