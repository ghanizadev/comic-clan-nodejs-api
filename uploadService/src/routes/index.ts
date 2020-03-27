import express from 'express';
import AwsS3 from '../services/aws';
import streamifier from 'streamifier';
import errors from '../errors'
import multer from 'multer';

const router = express.Router();
const upload = multer()

router.post('/', upload.array('media'), async (req, res, next) => {
    const s3 = new AwsS3('comicclanapi');
    const paths = []

    await s3.getOrCreateBucket();
    await s3.setBucketPublic();

    // try{

    const publishFile = async (file) => {
        const stream = streamifier.createReadStream(file.buffer);
        const path = await s3.uploadFile(stream, file.originalname.split('.')[1]);
        paths.push(path);

        return;
    }

        if(Array.isArray(req.files)) req.files.forEach(async file => await publishFile(file))

        res.json(paths)

    // } catch(e) {
    //     next({error: 'failed_to_upload', error_description: 'check logs for firther information', status: 500})
    // }

})

// router.use(errors);

export default router;