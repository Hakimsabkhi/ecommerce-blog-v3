import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Role from '@/models/Role';

export async function GET() {
  await connectToDatabase();
  try {
    const roles = await Role.find({});
    return NextResponse.json({ roles });
  } catch (err) {
    console.log(err)
  }
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { newRole } = await req.json();
    if (!newRole) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    const role = new Role({ name: newRole, access: {} });
    await role.save();
    return NextResponse.json({ role });
  } catch (err) {
    console.log(err)
  }
}
