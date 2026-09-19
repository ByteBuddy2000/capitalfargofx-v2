// app/api/verify/route.ts

import { connectToDB } from '@/lib/connectToDB';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.redirect('/error');
    }

    await connectToDB();

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
        return NextResponse.redirect('/verify?error=invalid');
    }

    user.status = 'ACTIVE';
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return NextResponse.redirect('/login?verified=true');
}