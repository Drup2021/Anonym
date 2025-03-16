// app/api/safe-mode/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { safeMode } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { safeMode },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Safe mode updated successfully',
        safeMode: updatedUser.safeMode
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating safe mode:', error);
    return Response.json(
      { success: false, message: 'Error updating safe mode' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        safeMode: foundUser.safeMode
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving safe mode status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving safe mode status' },
      { status: 500 }
    );
  }
}