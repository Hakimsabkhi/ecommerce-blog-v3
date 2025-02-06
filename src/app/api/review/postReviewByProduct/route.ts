import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
export async function POST(req: NextRequest) {
    await connectToDatabase();
  
    try {
      // Handle form data
      const formData = await req.formData();
      const product = formData.get('product') as string | null;
      const rating = formData.get('rating') as number | null;
      const text = formData.get('text') as string | null;
      const name = formData.get('name') as string | null;
      const email = formData.get('email') as string | null;
     
      const productExist= await Product.findById(product)
      if (!productExist){
        return NextResponse.json({ message: 'Error product ' }, { status: 402 });
      }
      productExist.nbreview += 1; // Increment the review count

      productExist.save();

    
    if (!rating) {
      console.log('Rating is required');
    } else if (!text) {
      console.log('Text is required');
    } else if (!email) {
      console.log('Email is required');
    } 
    else if (!name) {
    console.log('name is required');
    } 
    else if (!/^\S+@\S+\.\S+$/.test(email)) {
      console.log('Invalid email format');
    } else if (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      console.log('Rating must be a number between 1 and 5') ;
    }
      const existingReviw = await Review.findOne({ email:email ,product:product });
      if (existingReviw) {
        return NextResponse.json({ message: 'Review already exists' }, { status: 400 });
      }

  
      const newReview = new Review({
        product,
        rating,
        text,
        name,
        email,
       
      });
  
      // Save the new review to the database
      await newReview.save();
  
      // Return a success response
      return NextResponse.json({ message: 'Review submitted successfully' }, { status: 200 });
    } catch (error) {
      return console.log('Error creating Review',error);
    }
  }