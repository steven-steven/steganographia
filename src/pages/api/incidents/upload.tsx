const multer = require("multer");

/**
 * Credits go to https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
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

export default (req, res) => {
  upload.array("img", 3)(req, {}, (err) => {
    console.log("Error: ");
    console.log(req.files);
  });

  res
    .status(200)
    .send({ message: "post the data and return the encoded image" });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
