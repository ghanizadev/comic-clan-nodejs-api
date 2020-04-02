import express from 'express';
import AwsS3 from '../services/aws';
import streamifier from 'streamifier';
import errors, { HTTPError } from '../errors'
import multer from 'multer';
import logger from '../utils/logger';

const router = express.Router();
const upload = multer()

router.post('/', upload.array('media'), async (req, res, next) => {
    try{
    const s3 = new AwsS3('comicclanapi');
    const paths = []

    await s3.getOrCreateBucket();
    await s3.setBucketPublic();

    const publishFile = async (file, id) => {
        const stream = streamifier.createReadStream(file.buffer);
        const path = await s3.uploadFile(stream, file.originalname.split('.')[1], id);
        paths.push(path);

        return;
    }

    if(Array.isArray(req.files)) {
        if(req.files.length === 0) throw new HTTPError('empty_form', 'no files were added to request form data', 400);

        await Promise.all(req.files.map(async file => {
            await publishFile(file, req.query.id);
        }))

        return res.json(paths)
    }

    throw new HTTPError('failed_to_validate', `failed to verify files in request form, be asured it is tagged "media" in your form's field`, 400);

    } catch(e) {
        if(e instanceof HTTPError) next(e);
        else next();
    }

})

router.use(errors);

export default router;