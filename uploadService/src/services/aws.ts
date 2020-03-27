import aws from 'aws-sdk';
import crypto, { timingSafeEqual } from 'crypto';
import logger from '../utils/logger'
import stream from 'stream';

class AwsS3 {
    private BUCKET_NAME : string;
    private AWS_S3_KEY = process.env.AWS_S3_KEY;
    private AWS_S3_SECRET = process.env.AWS_S3_SECRET;

    private S3 : aws.S3;    

    constructor(bucketName : string) {
        this.BUCKET_NAME = bucketName;

        this.S3 = new aws.S3({
            accessKeyId: this.AWS_S3_KEY,
            secretAccessKey: this.AWS_S3_SECRET
        });
    }


    public async getOrCreateBucket(bucketName ?: string) : Promise<any> {
        bucketName && (this.BUCKET_NAME = bucketName);

        const data = await this.S3.listBuckets().promise();

        if (!data.Buckets) {
            logger.warn("Failed to fetch AWS");

        } else if(!data.Buckets.find(bucket => bucket.Name === this.BUCKET_NAME)){
            var bucketParams = {
                Bucket : this.BUCKET_NAME,
                ACL : 'public-read'
            };

            return await this.S3.createBucket(bucketParams).promise();
        }


        
    }

    public async uploadFile(file : any, ext : string) : Promise<string> {
        const params = {
            Key: `${crypto.randomBytes(8).toString('HEX')}.${ext}`,
            Body: file,
            Bucket: this.BUCKET_NAME
        }

        const data = await this.S3.upload(params).promise();
        console.log(data.Location)
        return data.Location;
    }

    public async setBucketPublic(bucketName ?:  string) : Promise<void> {
    
        const policy = {
            "Version":"2012-10-17",
            "Statement":[
                {
                "Sid":"PublicRead",
                "Effect":"Allow",
                "Principal": "*",
                "Action":["s3:GetObject"],
                "Resource":[`arn:aws:s3:::${bucketName ?? this.BUCKET_NAME}/*`]
                }
            ]
        }

        const policyParams = {
            Policy: JSON.stringify(policy),
            Bucket: bucketName ?? this.BUCKET_NAME
        }

        await this.S3.putBucketPolicy(policyParams).promise();
    }
}

export default AwsS3;