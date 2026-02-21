import { Request, Response } from 'express';
import { StorageService } from '../services/StorageService';
import { v4 as uuidv4 } from 'uuid';

export class UploadController {
    static async uploadAvatar(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const file = req.file;
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;

            const publicUrl = await StorageService.uploadFile(fileName, file.buffer, file.mimetype);

            res.json({ url: publicUrl });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload file' });
        }
    }
}
