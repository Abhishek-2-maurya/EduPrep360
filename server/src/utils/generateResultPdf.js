import PDFDocument from "pdfkit";
import cloudinary from "./cloudniary.js"
import streamifier from "streamifier";

export const generateAndUploadPdf = (resultData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "exam-results",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      } catch (err) {
        reject(err);
      }
    });

    // ---- PDF CONTENT ----
    doc.fontSize(20).text("Exam Result", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Student Name: ${resultData.studentName}`);
    doc.text(`Test Title: ${resultData.testTitle}`);
    doc.text(`Score: ${resultData.score}`);
    doc.text(`Total Marks: ${resultData.totalMarks}`);
    doc.text(`Percentage: ${resultData.percentage}%`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.end();
  });
};