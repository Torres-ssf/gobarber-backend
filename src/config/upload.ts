import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadFolder: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp'),
    filename(request, file, callback) {
      const originalNameNoSpaces = file.originalname.replace(/\s/g, '');
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${originalNameNoSpaces}`;

      return callback(null, fileName);
    },
  }),
};
