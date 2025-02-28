import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendMail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId,
                {
                    $set: {
                        verifyToken: hashedToken,
                        verifyTokenExpiry: Date.now() + 3600000
                    }
                }
            );
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId,
                {
                    $set: {
                        forgotPasswordToken: hashedToken,
                        forgotPasswordTokenExpiry: Date.now() + 3600000
                    }
                }
            );
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_EMAIL,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });

        const mailOptions = {
            from: 'rohit.ai',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a> to 
            ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'}
            or copy and paste the below link in your browser</br>
            </br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        console.log('Error in sending mail', error);
        throw new Error(error.message);
    }
}