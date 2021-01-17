const gm = require('gm');

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
                    const cropX = getRandomInt(value.width - CROP_WIDTH);
                    const cropY = getRandomInt(value.height - CROP_HEIGHT);

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
        gm()
            .in(srcImgPath)
            .in('-page', `+${cropX}+${cropY}`)
            .in(cropImgPath)
            .flatten()
            .write(mergeImgPath, (error) => {
                if (error) console.log(error);
            });
    }
}

/**
 * Returns a random number between 0 and max (inclusive)
 */
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max + 1));
}