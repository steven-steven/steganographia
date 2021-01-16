const multer = require("multer");

/**
 * Credits go to https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
 */
let upload = multer(/* { storage } */);

export default (req, res) => {
  upload.single("img")(req, {}, (err) => {
    console.log("Error ");
  });

  console.log("req");
  console.log(req.file);

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
