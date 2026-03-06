import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudniary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "exam-notes",
    resource_type: "raw", 
  },
});

const upload = multer({ storage });

export default upload;