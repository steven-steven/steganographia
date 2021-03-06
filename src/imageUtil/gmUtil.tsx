const gm = require('gm');
import fs from 'fs';

module.exports = {
    crop: (srcImgPath: string, cropImgPath: string,) => {
        return new Promise<{ cropX: number, cropY: number }>((resolve, reject) => {
            gm(srcImgPath)
                .size((error, value) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const CROP_WIDTH = 400;
                    const CROP_HEIGHT = 400;
                    const cropX = 0; //getRandomInt(value.width - CROP_WIDTH);
                    const cropY = 0; //getRandomInt(value.height - CROP_HEIGHT);

                    gm(srcImgPath)
                        .crop(CROP_WIDTH, CROP_HEIGHT, cropX, cropY)
                        .write(cropImgPath, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({ cropX, cropY });
                            }
                        });
                });
        });
    },

    merge: (cropX: number, cropY: number, srcImgPath: string, cropImgPath: string, mergeImgPath: string) => {
        return new Promise<void>((resolve, reject) => {
            gm()
                .in(srcImgPath)
                // move the crop process image at cropX and cropY. (0 and 0 by default)
                .in('-page', `+${cropX}+${cropY}`)
                // crop to remove slight boarder of the crop process image (<width>x<height>{+-}<x>{+-}<y>)
                .in('-crop', `395x395+0+0`)
                .in(cropImgPath)
                .flatten()
                .write(mergeImgPath, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
        });
    }
}

/**
 * Returns a random number between 0 and max (inclusive)
 */
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max + 1));
}