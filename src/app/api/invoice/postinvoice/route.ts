// /app/api/order/route.ts

import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/Invoice";
import Order from "@/models/order"; // Adjust path to where your Order model is located
import  connectDB  from "@/lib/db"; // MongoDB connection utility
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Counterinvoice from "@/models/Counterinvoice";

// POST - Create a new order
export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const order = await req.json();
    
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findOne({ email:token.email});
    // Parse the request body
    if (!user){
        return NextResponse.json({ success: false, message: "Missing required connect" }, { status: 505 });
    }

   
  
    // Validate required fields
    if (!user || !order ) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
const infoder = await Order.findById(order)
if(!infoder){
  return NextResponse.json({success:false,message:"no infomation order"},{status:401})
}
  const invoice = await Invoice.findOne({nborder:order})
  if(!invoice && infoder.statustimbre==true){
    const invoiceRef = await generateInvoiceRef();
   const newinvoice = new Invoice({
      user:infoder.user,
      nborder:infoder._id,
      address:infoder.address,
      Items:infoder.orderItems,
      paymentMethod:infoder.paymentMethod,
      deliveryMethod:infoder.deliveryMethod,
      deliveryCost:infoder.deliveryCost,
      total:infoder.total,
      ref:invoiceRef, // Example ref generation
      orderStatus: 'Processing',
    });

    // Save the order to the database
     const invoice = await newinvoice.save();

     return NextResponse.json({
      success: true,
      ref:invoice
     // ref: savedOrder.ref, // Return the order reference
  
    }, { status: 200});
  }else if(!invoice && infoder.statustimbre==false){
    const invoiceRef = await generateInvoiceRef();
    const newinvoice = new Invoice({
       user:infoder.user,
       nborder:infoder._id,
       address:infoder.address,
       Items:infoder.orderItems,
       paymentMethod:infoder.paymentMethod,
       deliveryMethod:infoder.deliveryMethod,
       deliveryCost:infoder.deliveryCost,
       total:infoder.total+1,
       ref:invoiceRef, // Example ref generation
       orderStatus: 'Processing',
     });
 
     // Save the order to the database
      const invoice = await newinvoice.save();
 
      return NextResponse.json({
       success: true,
       ref:invoice
      // ref: savedOrder.ref, // Return the order reference
   
     }, { status: 200});
  }


    return NextResponse.json({
      success: true,
      ref:invoice
     // ref: savedOrder.ref, // Return the order reference
  
    }, { status: 200});
  }  catch (error) {
    // Cast error as Error type to access its message property
    const err = error as Error;

    console.error("Error creating order:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
const generateInvoiceRef = async () => {
  try {
    // Get the current counter or create one if it doesn't exist
    let counter = await Counterinvoice.findOne({ name: 'invoiceRef' });

    if (!counter) {
      // If no counter exists, create one starting from 1
      counter = await Counterinvoice.create({ name: 'invoiceRef', value: 1 });
    } else {
      // Increment the counter value
      counter.value += 1;
      await counter.save();
    }
// Get the current year (YYYY)
const today = new Date();
const year = today.getFullYear();
    // Generate the reference number using the incremented counter value
    const ref = `FC-${counter.value.toString().padStart(6, '0')}-${year}`; // Pads with leading zeros

    return ref;
  } catch (error) {
    console.error('Error generating invoice reference:', error);
  }
};