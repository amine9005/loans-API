import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { mkdirp } from "mkdirp";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) {
    const dir = "./uploads/";
    mkdirp(dir).then(() => {
      cb(null, dir);
    });
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      console.log("should be able to upload");

      callback(null, true);
    } else {
      console.log("only jpg,png and jpeg files are supported");
      callback(null, false);
    }
  },

  limits: { fileSize: 1024 * 1024 * 2 },
});

export default upload;
