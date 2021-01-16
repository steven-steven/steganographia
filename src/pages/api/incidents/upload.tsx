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
  upload.array("iphoneAdPix", 3)(req, {}, (err) => {
    // do error handling here
    console.log(req.files); // do something with the files here
  });

  res
    .status(200)
    .send({ message: "post the data and return the encoded image" });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
