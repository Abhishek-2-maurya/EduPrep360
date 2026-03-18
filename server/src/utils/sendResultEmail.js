import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});


export const sendResultEmail = async ({
    email,
    name,
    testTitle,
    score,
    totalMarks,
    percentage,
    status,
}) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `EduPrep360 Result - ${testTitle}`,
            html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #4f46e5, #06b6d4); padding: 20px; text-align: center;">
        <img src="cid:logo" alt="EduPrep360 Logo" width="60" style="margin-bottom: 10px;" />
        <h1 style="color: #ffffff; margin: 0;">EduPrep360</h1>
        <p style="color: #e0f2fe; margin: 5px 0;">Your Learning Partner</p>
      </div>

      <!-- Body -->
      <div style="padding: 25px;">
        <h2 style="color: #333;">Hi ${name},</h2>

        <p style="color: #555; font-size: 15px;">
          Your test <strong>${testTitle}</strong> has been successfully submitted.
        </p>

        <!-- Result Card -->
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111;">📊 Result Summary</h3>

          <p><strong>Score:</strong> ${score} / ${totalMarks}</p>
          <p><strong>Percentage:</strong> ${percentage}%</p>
          <p><strong>Status:</strong> 
            <span style="
              color: white; 
              padding: 4px 10px; 
              border-radius: 5px; 
              background: ${status === "pass" ? "#16a34a" : "#dc2626"};
            ">
              ${status.toUpperCase()}
            </span>
          </p>
        </div>

        <!-- Performance Message -->
        <p style="font-size: 16px; color: #444;">
          ${percentage >= 80
                    ? "🎉 Excellent performance! Keep shining!"
                    : percentage >= 50
                        ? "👍 Good job! You’re on the right track."
                        : "💪 Keep practicing — you’ll improve!"
                }
        </p>

        <p style="color: #555;">
          Keep learning and pushing your limits with EduPrep360 🚀
        </p>

        <br/>

        <p style="color: #777; font-size: 14px;">
          Regards,<br/>
          <strong>EduPrep360 Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} EduPrep360. All rights reserved.
      </div>

    </div>
  </div>
`,
            attachments: [
                {
                    filename: "logo.svg",
                    path: "./public/logo.svg",
                    cid: "logo",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log("Result email sent");
    } catch (error) {
        console.log("Email error:", error);
    }
};