import formidable from 'formidable';
import { IncomingForm } from 'formidable';
import axios from 'axios';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { writeFile } from 'fs/promises';
import { Readable } from 'stream';

// Disable body parsing as we'll handle it manually
export const dynamic = 'force-dynamic';

// This is needed to disable the built-in body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility to handle formidable in App Router
// This simulates the Pages API behavior as closely as possible
async function parseFormWithFormidable_old(req: Request): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> {
  // Create a temporary file to store the request body
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `upload-${Date.now()}.tmp`);
  // Get the request data as buffer and write to temp file
  const buffer = Buffer.from(await req.arrayBuffer());
  await writeFile(tempFilePath, buffer);
  console.log('written done');

  // Create a readable stream from the temp file
  const fileStream = fs.createReadStream(tempFilePath);

  // Set up headers for formidable
  const headers = {
    'content-type': req.headers.get('content-type') || '',
    'content-length': req.headers.get('content-length') || '',
  };

  // Create a minimal request-like object for formidable
  const mockReq: any = {
    headers: headers,
    pipe: function (destination: any) {
      fileStream.pipe(destination);
      return destination;
    },
  };
  const nodeRequest = Object.assign(Readable.fromWeb(req.body as any), {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: '', // optional, can be left empty
  });

  console.log('done yaha tk');
  const response = await new Promise((resolve, reject) => {
    const form: any = new IncomingForm();
    form.keepExtensions = true;

    form.parse(nodeRequest, (err: any, fields: any, files: any) => {
      // Clean up temp file
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.error('Failed to remove temp file:', e);
      }

      if (err) return reject({ err });
      resolve({ fields, files });
    });
  });

  console.log('response :::::', response);
  return new Promise((resolve, reject) => {
    const form: any = new IncomingForm();
    form.keepExtensions = true;

    form.parse(mockReq, (err: any, fields: any, files: any) => {
      // Clean up temp file
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.error('Failed to remove temp file:', e);
      }

      if (err) return reject({ err });
      resolve({ fields, files });
    });
  });
}

async function parseFormWithFormidable(req: Request): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> {
  const form: any = new IncomingForm();
  form.keepExtensions = true;

  // Convert the web Request body to Node.js stream WITHOUT consuming it first
  const nodeRequest = Object.assign(Readable.fromWeb(req.body as any), {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: '',
  });

  return new Promise((resolve, reject) => {
    form.parse(nodeRequest, (err: any, fields: any, files: any) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export const POST = async (req: Request) => {
  let response = { success: false };

  try {
    // Parse the multipart form data
    const data = await parseFormWithFormidable(req);
    console.log('I am reached here1234567i===============================', data);

    // Use the same session ID as original code
    const session = 'f0bf219d-a69e-11ed-9677-d8bbc109c436';

    // Handle filename exactly as in original code
    const file = (data.files.file as formidable.File[])[0];
    const originalFilename = file.originalFilename || '';
    const extension = originalFilename?.includes('.')
      ? originalFilename
      : `object-removal-${new Date().getTime()}.jpg`;

    // Create config exactly as in original code
    let config = {
      method: 'post',
      url: `${process.env.CM1_BASE_URL}post.php?token=${session}&file=${extension}`,
      data: fs.createReadStream(file.filepath),
    };

    // Make the API call
    const axiosResponse = await axios(config);

    return new Response(JSON.stringify(axiosResponse.data), {
      status: 200,
    });
  } catch (err) {
    console.error('Error in file upload:', err);

    return new Response(JSON.stringify(err), {
      status: 500,
    });
  }
};
