declare class AwsS3 {
    private BUCKET_NAME;
    private AWS_S3_KEY;
    private AWS_S3_SECRET;
    private S3;
    private isPublic;
    constructor(bucketName: string);
    getOrCreateBucket(bucketName?: string): Promise<any>;
    uploadFile(file: any, ext: string, id?: string): Promise<string>;
    deleteFile(id: string): Promise<boolean>;
    renameFile(initial: string, final: string): Promise<boolean>;
    setBucketPublic(bucketName?: string): Promise<void>;
    allowBucketAddress(ip: string): Promise<void>;
}
export default AwsS3;
