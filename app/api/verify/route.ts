// app/api/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.redirect('/error');
    }

    await connectDB();

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
        return NextResponse.redirect('/verify?error=invalid');
    }

    user.status = 'active';
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return NextResponse.redirect('/signin?verified=true');
}