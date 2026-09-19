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

    const existing = await User.findOne({
        emailVerificationToken: token,
    })

    if (existing?.status === "ACTIVE") {
        return NextResponse.redirect(
            new URL('/login?verified=true', baseUrl)
        )
    }

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
        return NextResponse.redirect(new URL('/verify?error=invalid', baseUrl));
    }

    await User.updateOne(
        { _id: user._id },
        {
            $set: { status: "ACTIVE" },
            $unset: {
                emailVerificationToken: 1,
                emailVerificationExpires: 1,
            },
        }
    )

    await user.save();

    return NextResponse.redirect(new URL('/login?verified=true', baseUrl));
}