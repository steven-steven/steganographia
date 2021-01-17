import Formidable from "formidable-serverless";
import fs from "fs";
import { exec } from 'child_process';
import util from "util";
import path from 'path';
import mime from 'mime';
import { customAlphabet } from 'nanoid';
import dateformat from 'dateformat';
const { selectAll, selectOne, insert, shutdown } = require("../../handler/dbHandler");
const gmUtil = require("../../imageUtil/gmUtil");

// allow async await
const promiseExec = util.promisify(exec);

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)

export const config = {
  api: {
    bodyParser: false,
  },
};

type data = {
  message: string;
  name: string;
}

export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      // generate uuid
      const uuid = nanoid();

      const form = new Formidable.IncomingForm({ keepExtensions: true });
      const publicFolderPath = path.join(process.cwd(), 'public');
      const modelFolderPath = path.join(publicFolderPath, 'saved_models/stegastamp_pretrained');
      const tempFolderPath = path.join(publicFolderPath, 'temp');

      // run the model on the input image, and get generated file
      const encodedFilePath: string = await new Promise(function (resolve, reject) {
        form.parse(req, async (err, fields, { file }) => {
          const { message, name }: data = JSON.parse(fields.stampData);

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
          const { stdout, stderr } = await promiseExec(`python '${publicFolderPath}/encode_image.py' '${modelFolderPath}' --image '${croppedFilePath}' --save_dir '${tempFolderPath}/out/' --secret ${uuid}`);

          // encoded cropped image -> original
          const newFilePath = `${tempFolderPath}/new_${file.name}`;
          await mergeImage(cropCoordinate, encodedFilePath, originalFilePath, newFilePath);

          // insert to db
          const res = await insert(uuid, name, message, dateformat(new Date(), "yyyy-mm-dd"));

          if (stderr) {
            console.log(`stderr: ${stderr}`);
          }
          // console.log(`stdout: ${stdout}`);
          resolve(newFilePath);
        });
      });

      console.log(encodedFilePath);

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
const mergeImage = async (cropCoordinate, toPastePath, inPath, outPath) => {
  await gmUtil.merge(cropCoordinate.cropX, cropCoordinate.cropY, inPath, toPastePath, outPath);
}