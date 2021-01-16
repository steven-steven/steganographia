const multer = require("multer");
const fs = require("fs");

/**
 * Credits: https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
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
    upload.single("img")(req, {}, (err) => {
      if (err) {
        res.status(409).end();
      }

      // Source: https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
      // I believe this reads the uploaded image from local disk
      let img = fs.readFileSync(req.file.path);
      let encode_image = img.toString("base64");

      // Convert the file to byte-string, which can be manipulated and stored in a DB
      let finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, "base64"),
      };

      console.log("finalImg");
      console.log(finalImg);
    });

    res
      .status(200)
      .send({ message: "post the data and return the encoded image" });
  } else {
    res.status(404).send({});
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
