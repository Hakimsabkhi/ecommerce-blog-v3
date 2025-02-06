import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise< { id: string } >}
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

    const {id} = await params; // Get ID from params
    const body = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "ID  are required" },
        { status: 400 }
      );
    }

    const existinginvoice = await Invoice.findOne({ _id: id });
    if (!existinginvoice) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const invoiceItems = existinginvoice.Items;

    for (let i = 0; i < invoiceItems.length; i++) {
      // Your loop body here
    
      const oldproduct = await Product.findOne({
        _id: invoiceItems[i].product,
      });
      if (oldproduct) {
        if (invoiceItems[i].quantity) {
          oldproduct.stock += invoiceItems[i].quantity;

          oldproduct.save();
        }
      }
    }
    const {
      customer,
      companies,
      itemList,
      totalCost,
      paymentMethod,
      address,
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
  if(companies){
    existinginvoice.companies=companies;
  }
    if(customer){
    existinginvoice.user = customer;
  }
  if(address){
    existinginvoice.address = address;
  }
  
    existinginvoice.Items = itemList;
    existinginvoice.paymentMethod = paymentMethod;
    existinginvoice.deliveryMethod = deliveryMethod;
    existinginvoice.deliveryCost = deliveryCost;
    existinginvoice.total = totalCost;
    await existinginvoice.save();

    return NextResponse.json(
      {
        success: true,
        ref: existinginvoice._id, // Return the order reference
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
