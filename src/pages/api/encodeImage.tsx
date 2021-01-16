const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
import { nanoid } from 'nanoid';

export default (req, res) => {
    switch (req.method) {
        case 'POST': {
            //console.log(req);

            gmCrop().then((coordinate) => {
                fsWrite(coordinate.buffer);
                console.log(`x: ${coordinate.randomXPos}`);
                console.log(`y: ${coordinate.randomYPos}`);
            }).catch((error) => {
                console.error(error);
            });

            res.json({ message: 'post the data and return the encoded image' })
            break
        }
    }
}

const gmCrop = () => {
    return new Promise<{ buffer: Buffer, randomXPos: number, randomYPos: number }>((resolve, reject) => {
        gm('/Users/bobbao/Documents/htn/sample.jpg')
            .size((error, value) => {
                if (error) {
                    reject(error);
                    return;
                }

                const CROP_WIDTH = 400;
                const CROP_HEIGHT = 400;
                const randomXPos = getRandomInt(value.width - CROP_WIDTH);
                const randomYPos = getRandomInt(value.height - CROP_HEIGHT);

                gm('/Users/bobbao/Documents/htn/sample.jpg')
                    .crop(CROP_WIDTH, CROP_HEIGHT, randomXPos, randomYPos)
                    .toBuffer('jpg', (error, buffer) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({ buffer, randomXPos, randomYPos });
                        }
                    });
            });
    });
}

/*
const gmProcess = () => {
    return new Promise<{ randomXPos: number, randomYPos: number }>((resolve, reject) => {
        gm('/Users/bobbao/Documents/htn/sample.jpg')
            .size((error, value) => {
                if (error) {
                    reject(error);
                    return;
                }

                const CROP_WIDTH = 400;
                const CROP_HEIGHT = 400;
                const randomXPos = getRandomInt(value.width - CROP_WIDTH);
                const randomYPos = getRandomInt(value.height - CROP_HEIGHT);
                const uuid = nanoid(7);

                gm('/Users/bobbao/Documents/htn/sample.jpg')
                    .crop(CROP_WIDTH, CROP_HEIGHT, randomXPos, randomYPos)
                    .write(`/Users/bobbao/Documents/htn/sample${uuid}.jpg`, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({ randomXPos, randomYPos });
                        }
                    });
            });
    });
}
*/

const fsWrite = (data) => {
    const uuid = nanoid(7);
    fs.writeFile(`/Users/bobbao/Documents/htn/sample${uuid}.jpg`, data, error => {
        if (error) {
            console.error(error);
            return;
        }
    });
}

/**
 * Returns a random number between 0 and max (inclusive)
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}