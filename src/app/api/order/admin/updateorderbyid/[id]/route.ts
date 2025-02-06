import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Order from "@/models/order";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const existingOrder = await Order.findOne({ ref: id });
    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const ordersItems = existingOrder.orderItems;

    for (let i = 0; i < ordersItems.length; i++) {
      // Your loop body here
      const oldproduct = await Product.findOne({ _id: ordersItems[i].product });
      if (oldproduct) {
        if (ordersItems[i].quantity) {
          oldproduct.stock += ordersItems[i].quantity;

          oldproduct.save();
        }
      }
    }
    const {
      customer,
      itemList,
      totalCost,
      paymentMethod,
      address,
      deliveryMethod,
      deliveryCost,
      statustimbre,
    } = body;

    if (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        // Your loop body here
        
        const oldproduct = await Product.findOne({ _id: itemList[i].product });
        if (oldproduct) {
          if (oldproduct.stock >= itemList[i].quantity) {
            oldproduct.stock -= itemList[i].quantity;

            oldproduct.save();
          }
        }
      }
    }

    existingOrder.user = customer;
    existingOrder.address = address;
    existingOrder.orderItems = itemList;
    existingOrder.paymentMethod = paymentMethod;
    existingOrder.deliveryMethod = deliveryMethod;
    existingOrder.deliveryCost = deliveryCost;
    existingOrder.total = totalCost;
    existingOrder.statustimbre = statustimbre;
    await existingOrder.save();

    return NextResponse.json(
      {
        success: true,
        ref: existingOrder.ref, // Return the order reference
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
