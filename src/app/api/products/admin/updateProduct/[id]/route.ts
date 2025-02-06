import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";

interface ProductUpdates {
  name?: string;
  description?: string;
  ref?: string;
  category?: string;
  subcategory?:string|null;
  boutique?:string;
  brand?: string;
  stock?: number;
  price?: number;
  tva?: number;
  discount?: number;
  info?: string;
  color?: string;
  material?: string;
  weight?: string;
  warranty?: string;
  dimensions?: string;
  imageUrl?: string;
  images?: string[];
  updatedAt?: Date;
}


export async function PUT(
  req: NextRequest,
  { params }:{ params: Promise<{ id: string }> } 
) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const {id} = await params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const updates: ProductUpdates = {};

    // Extract and validate form data
    const name = (formData.get("name") as string | undefined) || undefined;
    const description = (formData.get("description") as string | undefined) || undefined;
    const ref = (formData.get("ref") as string | undefined) || undefined;
    const category = (formData.get("category") as string | undefined) || undefined;
    const subcategory = (formData.get("subcategory") as string | undefined) || undefined;
    const boutique = (formData.get("boutique") as string | undefined) || undefined;
    const brandId = (formData.get("brand") as string | undefined) || undefined;
    const stock = (formData.get("stock") as string | undefined) || undefined;
    const price = (formData.get("price") as string | undefined) || undefined;
    const tva = (formData.get("tva") as string | undefined) || undefined;
    const discount = (formData.get("discount") as string | undefined) || undefined;
    const info = (formData.get("info") as string | undefined) || undefined;
    const color = (formData.get("color") as string | undefined) || undefined;
    const material = (formData.get("material") as string | undefined) || undefined;
    const weight = (formData.get("weight") as string | undefined) || undefined;
    const warranty = (formData.get("warranty") as string | undefined) || undefined;
    const dimensions = (formData.get("dimensions") as string | undefined) || undefined;
    const imageFile = formData.get("image") as File | null;

    // Update fields if provided
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (ref) updates.ref = ref;
    if (stock) updates.stock = parseInt(stock, 10);
    if (price) updates.price = parseFloat(price);
    if (tva) updates.tva = parseFloat(tva);
    if (discount) updates.discount = parseFloat(discount);
    if (info) updates.info = info;
    if (color) updates.color = color;
    if (material) updates.material = material;
    if (weight) updates.weight = weight;
    if (warranty) updates.warranty = warranty;
    if (dimensions) updates.dimensions = dimensions;
  
    // Validate and handle category
    if (category) {
      const oldCategory = await Product.findById(id).select("category");
      const newCategory = await Category.findById(category);
      if (oldCategory?.category.toString() !== category) {
        if (newCategory) {
          newCategory.numberproduct += 1;
          await newCategory.save();
        }
        if (oldCategory) {
          const oldCategoryDoc = await Category.findById(oldCategory.category);
          if (oldCategoryDoc) {
            oldCategoryDoc.numberproduct -= 1;
            await oldCategoryDoc.save();
          }
        }
      }
      updates.category = category;
    }
    const existproduct= await Product.findById(id);
    if(existproduct?.subcategory){
    if(subcategory){
      const exstsubcategory = await Subcategory.findById(subcategory)
      if(exstsubcategory?.category===category){
        updates.subcategory = subcategory;
      }else{
        updates.subcategory = null;
      }
    }}else{
      updates.subcategory = subcategory;
      console.log(subcategory)
    }

    // Validate brand
// Validate brand
if (brandId) {
  const validBrand = await Brand.findById(brandId.trim()) as { _id: string };
  if (!validBrand) {
    return NextResponse.json({ message: "Invalid brand selected" }, { status: 400 });
  }
  updates.brand = validBrand._id;
}


    // Handle image upload
    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageStream = new stream.PassThrough();
      imageStream.end(imageBuffer);

      const { secure_url: newImageUrl } = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "Products", format: "webp" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        imageStream.pipe(uploadStream);
      });

      updates.imageUrl = newImageUrl;
    }

    // Handle multiple image uploads
    const imageFiles: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("images[") && value instanceof File) {
        imageFiles.push(value);
      }
    });

    if (imageFiles.length > 0) {
      const uploadedImages = await Promise.all(
        imageFiles.map(async (imageFile) => {
          const imageBuffer = await imageFile.arrayBuffer();
          const bufferStream = new stream.PassThrough();
          bufferStream.end(Buffer.from(imageBuffer));

          const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "Products/images", format: "webp" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result as { secure_url: string });
              }
            );
            bufferStream.pipe(uploadStream);
          });

          return result.secure_url;
        })
      );
      updates.images = uploadedImages;
    }

    updates.updatedAt = new Date();
   if(boutique===undefined){
   await Product.findByIdAndUpdate(id, {boutique:null})
  }else{
    updates.boutique=boutique;
  }
    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
  }
}
