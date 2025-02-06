import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Products from "@/models/Product";
import Category from '@/models/Category';
import Brand from "@/models/Brand";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import User from "@/models/User";
import { getToken } from 'next-auth/jwt';

interface CloudinaryUploadResult {
  secure_url: string;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  // Check token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });
  if (!user || !(user.role === 'Admin'  || user.role === 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  try {
    // Handle form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const ref = formData.get('ref') as string;
    const category = formData.get('category') as string;
    let subcategory = formData.get('subcategory') as string | null;
    let boutique = formData.get('boutique') as string | null;
    let brand = formData.get('brand') as string | null;  // Brand can be null or a string
    const stock = formData.get('stock') as string;
    const discount = formData.get('discount') as string;
    const tva = formData.get('tva') as string;
    const price = formData.get('price') as string;
    const info = formData.get('info') as string;
    const material = formData.get('material') as string;
    const dimensions = formData.get('dimensions') as string;
    const color = formData.get('color') as string;
    const weight = formData.get('weight') as string;
    const warranty = formData.get('warranty') as string;
    const statuspage = formData.get('statuspage') as string;

    // Handle multiple image files
    const imageFiles: File[] = [];
    const entries = Array.from(formData.entries());
    for (let i = 0; i < entries.length; i++) {
      const file = formData.get(`images[${i}]`) as File;
      if (file) {
        imageFiles.push(file);
      }
    }

    // Validate required fields
    if (!name || !ref || !info || !category || !stock || !price ||!tva) {
      return NextResponse.json({ message: 'Required fields: name, info, ref, category, stock, price' }, { status: 400 });
    }

    // If brand is not provided or empty, set it to null
    if (!brand || brand.trim() === "") {
      brand = null;
    } else {
      const validBrand = await Brand.findOne({ _id: brand });
      if (!validBrand) {
        return NextResponse.json({ message: 'Invalid brand selected' }, { status: 400 });
      }
      brand = validBrand._id.toString(); // Ensure it stores as a string
    }
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }
    existingCategory.numberproduct += 1;
    await existingCategory.save();

    const existingProduct = await Products.findOne({ ref });
    if (existingProduct) {
      return NextResponse.json({ message: 'Product with this ref already exists' }, { status: 400 });
    }
    if(!subcategory){
      subcategory=null
    }
    if(!boutique){
      boutique=null
    }
    // Upload a single image
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;
    if (imageFile) {
      const imageBuffer = await imageFile.arrayBuffer();
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(imageBuffer));

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'Products', format: 'webp' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result as CloudinaryUploadResult);
          }
        );
        bufferStream.pipe(uploadStream);
      });
      imageUrl = result.secure_url;
    }

    // Upload multiple images
    const uploadedImages = await Promise.all(
      imageFiles.map(async (imageFile) => {
        const imageBuffer = await imageFile.arrayBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(imageBuffer));

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'Products/images', format: 'webp' },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result as CloudinaryUploadResult);
            }
          );
          bufferStream.pipe(uploadStream);
        });

        return result.secure_url;
      })
    );
    
    const newProduct = new Products({
      name,
      info,
      description,
      ref,
      material,
      color,
      warranty,
      dimensions,
      category,
      subcategory,
      boutique,
      brand,
      stock,
      tva,
      price,
      discount,
      imageUrl,
      user,
      weight,
      images: uploadedImages,
      statuspage
    });

    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error('Error creating Product:', error);
    return NextResponse.json({ message: 'Error creating Product' }, { status: 500 });
  }
}
