import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs';
import { sendMail } from '@/helpers/mailer';

connect();
export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        //SEND verification EMAIL TO USER
        await sendMail({
            email,
            emailType: 'VERIFY',
            userId: savedUser._id
        });

        return NextResponse.json({
            message: 'User registered successfully!',
            savedUser,
            success: true
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}