import aws from 'aws-sdk';
import crypto from 'crypto';

export default {
    async upload(file : Buffer, ext: string){
        const S3 = new aws.S3({ accessKeyId: process.env.AWS_S3_KEY, secretAccessKey: process.env.AWS_S3_SECRET });

        return S3.upload({
            Body: file,
            Key: `ul_${crypto.randomBytes(32).toString("hex")}.${ext}`,
            Bucket: process.env.AWS_S3_BUCKET || ''
        }).promise()
    },
    async renameFile(initial : string, final : string){
        const S3 = new aws.S3({ accessKeyId: process.env.AWS_S3_KEY, secretAccessKey: process.env.AWS_S3_SECRET });

        S3.copyObject({
            CopySource: process.env.AWS_S3_BUCKET + '/'+ initial,
            Key: final,
            Bucket: process.env.AWS_S3_BUCKET || ''
        }).promise()

        return S3.deleteObject({Bucket: process.env.AWS_S3_BUCKET || "", Key: initial}).promise();
    },
    async garbageCollector(initial : string, final : string){
        const S3 = new aws.S3({ accessKeyId: process.env.AWS_S3_KEY, secretAccessKey: process.env.AWS_S3_SECRET });

        const list =  S3.listObjectsV2({Bucket: process.env.AWS_S3_BUCKET || "", Prefix: 'ul_'}).promise();

        
    },
}