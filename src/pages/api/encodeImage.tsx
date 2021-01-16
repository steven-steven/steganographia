const gm = require('gm').subClass({ imageMagick: true });
import { nanoid } from 'nanoid';


export default (req, res) => {
    switch (req.method) {
        case 'POST': {
            //console.log(req);
            const uuid = nanoid(7);

            //TODO: Change src to be user upload, crop to be processed image, merge to be output
            const srcImgPath = "/Users/bobbao/Documents/htn/sample2.jpg";
            const cropImgPath = `/Users/bobbao/Documents/htn/crop-${uuid}.jpg`;
            const mergeImgPath = `/Users/bobbao/Documents/htn/merge-${uuid}.jpg`

            gmCrop(srcImgPath, cropImgPath).then((cropCoordinate) => {
                // x, y crop coordinates
                //console.log(`x: ${cropCoordinate.randomXPos}`);
                //console.log(`y: ${cropCoordinate.randomYPos}`);
                return cropCoordinate;
            }).then((cropCoordinate) => {
                gmMerge(cropCoordinate.randomXPos, cropCoordinate.randomYPos, srcImgPath, cropImgPath, mergeImgPath)
            }).catch((error) => {
                console.error(error);
            });

            res.json({ message: 'post the data and return the encoded image' })
            break
        }
    }
}

const gmCrop = (srcImgPath: string, cropImgPath: string,) => {
    return new Promise<{ randomXPos: number, randomYPos: number }>((resolve, reject) => {
        gm(srcImgPath)
            .size((error, value) => {
                if (error) {
                    reject(error);
                    return;
                }

                const CROP_WIDTH = 400;
                const CROP_HEIGHT = 400;
                const randomXPos = getRandomInt(value.width - CROP_WIDTH);
                const randomYPos = getRandomInt(value.height - CROP_HEIGHT);

                gm(srcImgPath)
                    .crop(CROP_WIDTH, CROP_HEIGHT, randomXPos, randomYPos)
                    .write(cropImgPath, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({ randomXPos, randomYPos });
                        }
                    });
            });
    });
}

const gmMerge = (x: number, y: number, srcImgPath: string, cropImgPath: string, mergeImgPath: string) => {
    gm()
        .in(srcImgPath)
        .in('-page', `+${x}+${y}`)
        .in(cropImgPath)
        .flatten()
        .write(mergeImgPath, (error) => {
            if (error) console.log(error);
        });
}

/**
 * Returns a random number between 0 and max (inclusive)
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}