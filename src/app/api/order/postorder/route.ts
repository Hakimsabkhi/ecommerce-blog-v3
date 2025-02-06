import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";
import Notifications from "@/models/Notifications";

// Define an interface for items
interface Item {
  _id: string;
  ref: string;
  name: string;
  tva: number;
  quantity: number;
  imageUrl: string;
  price: number;
  discount: number;
}

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    const body = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Missing required connect" },
        { status: 505 }
      );
    }

    const {
      items,
      totalWithShipping,
      paymentMethod,
      address,
      selectedMethod,
      deliveryCost,
    }: {
      items: Item[];
      totalWithShipping: number;
      paymentMethod: string;
      address: string;
      selectedMethod: string;
      deliveryCost: number;
    } = body;

    // Validate required fields
    if (
      !user ||
      !address ||
      !items ||
      !paymentMethod ||
      !selectedMethod ||
      !totalWithShipping
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map items to order items
    const orderItems = items.map((item: Item) => ({
      product: item._id,
      refproduct: item.ref,
      name: item.name,
      tva: item.tva,
      quantity: item.quantity,
      image: item.imageUrl,
      price: item.price,
      discount: item.discount,
    }));

    // Adjust product stock for each item
    for (const orderItem of orderItems) {
      console.log(orderItem.product); // Log product ID
      const product = await Product.findOne({ _id: orderItem.product });
      if (product) {
        if (product.stock >= orderItem.quantity) {
          product.stock -= orderItem.quantity;
          await product.save();
        } else {
          return NextResponse.json(
            { success: false, message: `Insufficient stock for product ${product._id}` },
            { status: 400 }
          );
        }
      }
    }

    // Create a new order
    const newOrder = new Order({
      user,
      address,
      orderItems,
      paymentMethod,
      deliveryMethod: selectedMethod,
      deliveryCost,
      total: totalWithShipping + 1,
      ref: `ORDER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      orderStatus: "Processing",
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Create a notification
    const newNotification = new Notifications({
      order: savedOrder,
    });
    await newNotification.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        ref: savedOrder.ref, // Return the order reference
      },
      { status: 200 }
    );
  } catch (error) {
    // Cast error as Error type to access its message property
    const err = error as Error;

    console.error("Error creating order:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
