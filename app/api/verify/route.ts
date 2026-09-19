// app/api/verify/route.ts

import { connectToDB } from '@/lib/connectToDB';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXTAUTH_URL ;
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/error', BASE_URL));
    }

    await connectToDB();

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
        return NextResponse.redirect(new URL('/verify?error=invalid', BASE_URL));
    }

    user.status = 'ACTIVE';
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return NextResponse.redirect(new URL('/login?verified=true', BASE_URL));
}