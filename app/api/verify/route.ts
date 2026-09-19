// app/api/verify/route.ts

import { connectToDB } from '@/lib/connectToDB';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;

    if (!token) {
        return NextResponse.redirect(new URL('/error', baseUrl));
    }

    await connectToDB();

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
        return NextResponse.redirect(new URL('/verify?error=invalid', baseUrl));
    }

    user.status = 'ACTIVE';
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return NextResponse.redirect(new URL('/login?verified=true', baseUrl));
}