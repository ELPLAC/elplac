import { Injectable } from '@nestjs/common';
import * as toStream from 'buffer-to-stream';
import { UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class FileService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto', 
          folder: 'user_profiles', 
          public_id: `${Date.now()}`, 
          use_filename: true,
          unique_filename: false, 
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
