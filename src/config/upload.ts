import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  uploadFolder: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: path.resolve(__dirname, '..', '..', 'tmp'),
      filename(request, file, callback) {
        const originalNameNoSpaces = file.originalname.replace(/\s/g, '');
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${originalNameNoSpaces}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {},
    aws: {
      bucket: process.env.AWS_S3_BUCKET_NAME,
    },
  },
} as IUploadConfig;
