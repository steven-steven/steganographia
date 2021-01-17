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
    upload.single("myImage")(req, {}, (err) => {
      if (err) {
        return res
          .status(409)
          .end({ message: "error: image file upload failed." });
      }

      // Source: https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
      // I believe this reads the image from local file system
      let img = fs.readFileSync(req.file.path);
      let encode_image = img.toString("base64");

      // Convert the file to byte-string, which can be manipulated and stored in a DB
      let finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, "base64"),
      };
      console.log(finalImg);
      console.log(req.body);
    });

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
