import Formidable from "formidable-serverless";
import fs from "fs";
import { exec } from 'child_process';
import util from "util";
import path from 'path';
const { selectAll, selectOne, insert, shutdown } = require("../../handler/dbHandler");
const gmUtil = require("../../imageUtil/gmUtil");

// allow async await
const promiseExec = util.promisify(exec);

export const config = {
  api: {
    bodyParser: false,
  },
};

type data = {
  name: string,
  message: string,
  date: string
}
type error = {
  error: string
}
export default async (req, res) => {
  switch (req.method) {
    case 'POST': {

      const form = new Formidable.IncomingForm({ keepExtensions: true });
      const publicFolderPath = path.join(process.cwd(), 'public');
      const modelFolderPath = path.join(publicFolderPath, 'saved_models/stegastamp_pretrained');
      const tempFolderPath = path.join(publicFolderPath, 'temp');

      // parse image, store in /temp, then call python model
      // run the model on the input image, and get generated file
      const userData: data | error = await new Promise(function (resolve, reject) {
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
          await cropImage(originalFilePath, croppedFilePath);

          // execute command line (run model)
          const encodedFilePath = `${tempFolderPath}/out/cropped_${file.name.split('.')[0]}_hidden.png`;
          const { stdout, stderr } = await promiseExec(`python '${publicFolderPath}/decode_image.py' '${modelFolderPath}' --image '${croppedFilePath}'`);

          // get id (last word)
          const outputs = stdout.trim().split(' ');
          const id: string = outputs[outputs.length - 1];

          // search db to get data
          const rows = await selectOne(id);
          if (!rows.length) resolve({ error: 'verification failed' })
          const userData: data = rows[0];

          if (stderr) {
            console.log(`stderr: ${stderr}`);
          }
          console.log(`stdout: ${stdout}`);
          resolve(userData);
        });
      });
      res.json(userData)
      break
    }
  }
}

// original image -> crop
const cropImage = async (inPath, outPath) => {
  await gmUtil.crop(inPath, outPath);
}