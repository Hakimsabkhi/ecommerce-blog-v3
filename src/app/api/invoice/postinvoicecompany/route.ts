import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Counterinvoice from "@/models/Counterinvoice";
import Product from "@/models/Product";

export async function POST(
  req: NextRequest,
) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //fatcg the user

  // Find the user by email
  const user = await User.findOne({ email: token.email });

  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 404 }
    );
  }
  try {
    // Handle form data

 
    const body = await req.json();
 
    const {
      company,
      itemList,
      totalCost,
      paymentMethod,
      deliveryMethod,
      deliveryCost,
    } = body;
    if (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        // Your loop body here
        console.log(itemList[i].product); // Example: access each item in orderItems
        const oldproduct = await Product.findOne({ _id: itemList[i].product });
        if (oldproduct) {
          if (oldproduct.stock >= itemList[i].quantity) {
            oldproduct.stock -= itemList[i].quantity;

            oldproduct.save();
          }
        }
      }
    }
    const invoiceRef = await generateInvoiceRef();
    const newinvoice = new Invoice({
      companies: company,
      Items: itemList,
      paymentMethod: paymentMethod,
      deliveryMethod: deliveryMethod,
      deliveryCost: deliveryCost,
      total: totalCost,
      ref:invoiceRef,
    });
    
   const invoice= await newinvoice.save();
    

    return NextResponse.json(
      {
        success: true,
       ref:invoice._id, // Return the order reference
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Log error for debugging
    return NextResponse.json(
      { message: "Error updating product status", error },
      { status: 500 }
    );
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