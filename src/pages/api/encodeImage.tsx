import { File } from "formidable";
import Formidable from "formidable-serverless";
import fs from "fs";
import { exec } from 'child_process';
import util from "util";
import path from 'path';
import mime from 'mime';
import { nanoid } from 'nanoid';
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
    case 'POST': {
      // await testTransform();
      // res.json({ message: 'post the data and return the encoded image' })
      // break
      // generate uuid
      const uuid = nanoid(7);

      const form = new Formidable.IncomingForm({ keepExtensions: true });
      const publicFolderPath = path.join(process.cwd(), 'public');
      const modelFolderPath = path.join(publicFolderPath, 'saved_models/stegastamp_pretrained');
      const tempFolderPath = path.join(publicFolderPath, 'temp');

      // run the model on the input image, and get generated file
      const encodedFilePath: string = await new Promise(function (resolve, reject) {
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
          const { cropCoordinate } = await cropImage(originalFilePath, croppedFilePath);

          // execute command line (run model)
          const encodedFilePath = `${tempFolderPath}/out/cropped_${file.name.split('.')[0]}_hidden.png`;
          const { stdout, stderr } = await promiseExec(`python ${publicFolderPath}/encode_image.py ${modelFolderPath} --image ${croppedFilePath} --save_dir ${tempFolderPath}/out/ --secret He1234`);

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
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);
      const filestream = fs.createReadStream(encodedFilePath);
      filestream.pipe(res);
    }
  }
}

// original image -> crop
const cropImage = async (inPath, outPath) => {
  const cropCoordinate = await gmUtil.crop(inPath, outPath);
  return { cropCoordinate };
}

// cropImage to original
const mergeImage = async (cropCoordinate, inPath, outPath) => {
  await gmUtil.merge(cropCoordinate.cropX, cropCoordinate.cropY, outPath, inPath, outPath);
}