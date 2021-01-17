const multer = require("multer");
const fs = require("fs");

/**
 * Credits go to https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
 */
/**
 * Configuration for storing image on local disk
 */
let storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage });

export default async (req, res) => {
  if (req.method === "POST") {
    let encode_image;
    upload.single("img")(req, {}, (err) => {
      if (err) {
        res.status(409).end({ message: "error: image file upload failed." });
      }
      // Source: https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
      // I believe this reads the uploaded image from local disk

      console.log("req");
      console.log(req.files);
      console.log(req.file);
      console.log(req.uploadedImage);
      console.log(req.body);
      // let img = fs.readFileSync(req.file.path);
      // encode_image = img.toString("base64");
    });

    if (encode_image) {
      console.log("req.body");
      console.log(req.body);
    } else {
      console.log("Error");
    }

    res.status(200).send({ message: "success: form submitted" });
  } else {
    res.status(404).send({ message: "error: endpoint not found" });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
