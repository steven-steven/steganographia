/**
 * Configuration for storing image on local disk
 */
// let storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "./public/uploads");
//   },
//   filename(req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// let upload = multer({ storage });

// export default async (req, res) => {
//   if (req.method === "POST") {
//     upload.single("myImage")(req, {}, (err) => {
//       if (err) {
//         return res
//           .status(409)
//           .end({ message: "error: image file upload failed." });
//       }

//       // Source: https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
//       // I believe this reads the image from local file system
//       let img = fs.readFileSync(req.file.path);
//       let encode_image = img.toString("base64");

//       // Convert the file to byte-string, which can be manipulated and stored in a DB
//       let finalImg = {
//         contentType: req.file.mimetype,
//         image: new Buffer(encode_image, "base64"),
//       };
//       console.log(finalImg);
//       console.log(req.body);
//     });

//     res.status(200).send({ message: "success: form submitted" });
//   } else {
//     res.status(404).send({ message: "error: endpoint not found" });
//   }
// };

import { File } from "formidable";
import Formidable from "formidable-serverless";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
import path from "path";
import mime from "mime";
import { nanoid } from "nanoid";

const multer = require("multer");
const fs = require("fs");

const gmUtil = require("../../imageUtil/gmUtil");

// allow async await
const promiseExec = util.promisify(exec);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  switch (req.method) {
    case "POST": {
      // await testTransform();
      // res.json({ message: 'post the data and return the encoded image' })
      // break
      // generate uuid
      const uuid = nanoid(7);

      const form = new Formidable.IncomingForm({ keepExtensions: true });
      console.log("Form");
      console.log(form);
      const publicFolderPath = path.join(process.cwd(), "public");
      const modelFolderPath = path.join(
        publicFolderPath,
        "saved_models/stegastamp_pretrained"
      );
      const tempFolderPath = path.join(publicFolderPath, "temp");

      // run the model on the input image, and get generated file
      const encodedFilePath: string = await new Promise(function (
        resolve,
        reject
      ) {
        form.parse(req, async (err, fields, { file }) => {
          if (err) {
            reject(err);
            return;
          }

          // write the file locally
          const data = fs.readFileSync(file.path);
          const originalFilePath = `${tempFolderPath}/${file.name}`;
          fs.writeFileSync(originalFilePath, data);
          fs.unlinkSync(file.path);

          // original -> cropped image
          const croppedFilePath = `${tempFolderPath}/cropped_${file.name}`;
          const { cropCoordinate } = await cropImage(
            originalFilePath,
            croppedFilePath
          );

          // execute command line (run model)
          const encodedFilePath = `${tempFolderPath}/out/cropped_${
            file.name.split(".")[0]
          }_hidden.png`;
          const { stdout, stderr } = await promiseExec(
            `python ${publicFolderPath}/encode_image.py ${modelFolderPath} --image ${croppedFilePath} --save_dir ${tempFolderPath}/out/ --secret He1234`
          );

          // encoded cropped image -> original
          await mergeImage(cropCoordinate, encodedFilePath, originalFilePath);

          if (stderr) {
            console.log(`stderr: ${stderr}`);
          }
          // console.log(`stdout: ${stdout}`);
          resolve(originalFilePath);
        });
      });

      const filename = path.basename(encodedFilePath);
      const mimetype = mime.getType(encodedFilePath);
      res.setHeader("Content-disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-type", mimetype);
      const filestream = fs.createReadStream(encodedFilePath);
      filestream.pipe(res);
    }
  }
};

// original image -> crop
const cropImage = async (inPath, outPath) => {
  const cropCoordinate = await gmUtil.crop(inPath, outPath);
  return { cropCoordinate };
};

// cropImage to original
const mergeImage = async (cropCoordinate, inPath, outPath) => {
  await gmUtil.merge(
    cropCoordinate.cropX,
    cropCoordinate.cropY,
    outPath,
    inPath,
    outPath
  );
};
