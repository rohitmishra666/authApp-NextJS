import { connect } from '@/dbConfig/dbConfig'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/helpers/getDataFromToken'
import User from '@/models/userModel'

connect()

export async function POST(req: NextRequest) {
    try {
        const userId = await getDataFromToken(req)
        const user = await User.findOne({ _id: userId }).select('-password')
        
        if (!user) {
            return NextResponse.json({ error: 'User does not exist!' }, { status: 400 })
        }
        return NextResponse.json({
            message: "User data fetched successfully",
            data: user
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}