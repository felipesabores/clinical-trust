import * as Minio from 'minio';

// O cliente é inicializado apenas se necessário para não travar o boot da aplicação sem as chaves
let minioClient: Minio.Client | null = null;

const getMinioClient = () => {
    if (minioClient) return minioClient;

    const endPoint = process.env.MINIO_ENDPOINT;
    if (!endPoint) {
        console.warn('⚠️ MINIO_ENDPOINT não configurado. Uploads de arquivo estarão desativados.');
        return null;
    }

    minioClient = new Minio.Client({
        endPoint,
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY || '',
        secretKey: process.env.MINIO_SECRET_KEY || '',
    });
    return minioClient;
};

export class StorageService {
    private static bucketName = process.env.MINIO_BUCKET || 'avatars';

    static async uploadFile(fileName: string, buffer: Buffer, contentType: string) {
        const client = getMinioClient();
        if (!client) {
            throw new Error('Serviço de storage não configurado (MINIO_ENDPOINT ausente)');
        }

        await client.putObject(this.bucketName, fileName, buffer, buffer.length, {
            'Content-Type': contentType,
        });

        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        return `${protocol}://${process.env.MINIO_ENDPOINT}/${this.bucketName}/${fileName}`;
    }
}
