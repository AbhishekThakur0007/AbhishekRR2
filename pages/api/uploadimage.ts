// pages/api/uploadImage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import axios from 'axios';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

type ParsedData = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('in pages api================');
    const data: ParsedData = await new Promise((resolve, reject) => {
      const form = formidable({ keepExtensions: true });
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const uploadedFile:any = data.files.file ;

    const session = 'f0bf219d-a69e-11ed-9677-d8bbc109c436';

    const originalFilename = uploadedFile.originalFilename || '';
    const extension = originalFilename.includes('.')
      ? originalFilename
      : `object-removal-${Date.now()}.jpg`;

    console.log('Yes============================uploadedFile.filepath',uploadedFile[0]);

    const fileStream = fs.createReadStream(uploadedFile[0].filepath);

    const uploadResponse = await axios.post(
      `${process.env.CM1_BASE_URL}post.php?token=${session}&file=${extension}`,
      fileStream,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      },
    );

    return res.status(200).json({ success: true, data: uploadResponse.data });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
