import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || '',
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
});

export class StorageService {
    private static bucketName = process.env.MINIO_BUCKET || 'avatars';

    static async uploadFile(fileName: string, buffer: Buffer, contentType: string) {
        await minioClient.putObject(this.bucketName, fileName, buffer, buffer.length, {
            'Content-Type': contentType,
        });

        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        return `${protocol}://${process.env.MINIO_ENDPOINT}/${this.bucketName}/${fileName}`;
    }
}
