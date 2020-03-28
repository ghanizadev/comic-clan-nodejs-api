import aws from 'aws-sdk';
import crypto from 'crypto';
import logger from '../utils/logger'
import stream from 'stream';
import { isIP } from 'net';
import { HTTPError } from '../errors';

class AwsS3 {
    private BUCKET_NAME : string;
    private AWS_S3_KEY = process.env.AWS_S3_KEY;
    private AWS_S3_SECRET = process.env.AWS_S3_SECRET;

    private S3 : aws.S3;    

    private isPublic : boolean = false;

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
        try {
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

            this.isPublic = true;
        
        } catch(e) {
            this.isPublic = false;
            throw new HTTPError('aws_error', `failed to make "${this.BUCKET_NAME}" bucket public.`);
        }
    }

    public async allowBucketAddress(ip : string) : Promise<void> {

        try {
            const check = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,3}\d{1,3})?\b/g.test(ip);

            if(!check){
                throw new Error(`invalid IP: ${ip}.`);
            }
    
            if(this.isPublic){
                throw new HTTPError('aws_error', `current AWS S3 Bucket "${this.BUCKET_NAME}" 
                is public already. If you want to set permission to a single ip 
                address only, please remove "PublicRead" policy in console panel.`);
            }
            const statement = {
                "Version": "2012-10-17",
                "Id": `Allow${ip}`,
                "Statement": [{
                    "Sid": "AllowSingleIp",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:*",
                    "Resource": [
                        `arn:aws:s3:::${this.BUCKET_NAME}`,
                        `arn:aws:s3:::${this.BUCKET_NAME}/*`,
                    ],
                    "Condition": {
                        "IpAddress": {
                        "aws:SourceIp": [
                            ip,
                        ]
                        }
                    }
                }]
            }

            const policyParams = {
                Policy: JSON.stringify(statement),
                Bucket: this.BUCKET_NAME
            }
    
            await this.S3.putBucketPolicy(policyParams).promise();

        } catch(e) {
            throw new HTTPError('aws_error', `failed to permit "${ip}" to "${this.BUCKET_NAME}" bucket access policies.`);
        }

    }
}

export default AwsS3;