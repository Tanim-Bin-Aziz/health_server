import multer from "multer";
import path from "path";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dshyf27co",
  api_key: "743122863663612",
  api_secret: "nVuM171YNyy7ex0JzmukJhDZsdI",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: any) => {
  cloudinary.uploader.upload(
    "D:/Software/project_health/uploads/_titan eren yeager.jpg",
    { public_id: "user_picture" },
    function (error, result) {
      console.log(result);
    }
  );
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
