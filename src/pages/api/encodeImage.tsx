import { nanoid } from 'nanoid';
const gmUtil = require("../../imageUtil/gmUtil");

export default (req, res) => {
    switch (req.method) {
        case 'POST': {
            // Test image crop and merging 

            //console.log(req);
            const uuid = nanoid(7);

            //TODO: Change src to be user upload, crop to be processed image, merge to be output
            const srcImgPath = "/Users/bobbao/Documents/htn/sample.jpg";
            const cropImgPath = `/Users/bobbao/Documents/htn/crop-${uuid}.jpg`;
            const mergeImgPath = `/Users/bobbao/Documents/htn/merge-${uuid}.jpg`

            gmUtil.crop(srcImgPath, cropImgPath).then((cropCoordinate) => {
                return cropCoordinate;
            }).then((cropCoordinate) => {
                gmUtil.merge(cropCoordinate.cropX, cropCoordinate.cropY, srcImgPath, cropImgPath, mergeImgPath)
            }).catch((error) => {
                console.error(error);
            });

            res.json({ message: 'post the data and return the encoded image' })
            break
        }
    }
}