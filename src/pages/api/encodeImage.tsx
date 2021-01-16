const multer = require("multer");
const fs = require("fs");

export default (req, res) => {
  switch (req.method) {
    case "POST": {
      let img = fs.readFileSync(req.file.path);
      let encode_image = img.toString("base64");

      let finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, "base64"),
      };

      console.log("finalImg: ");
      console.log(finalImg);
      res.json({ message: "post the data and return the encoded image" });
      break;
    }
  }
};
