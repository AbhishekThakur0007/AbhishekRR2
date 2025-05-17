import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This method is used to upload an image (File or Blob) via FormData and get the CDN URL from response
 * @param {File} file - image file or blob to upload
 * @returns {Promise<any>} - upload response data (e.g., file URL)
 */
export const uploadImageHandler = async (file: File) => {
  console.log('=++++++++++++++++++++++++++++++=');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
console.log('===========formData',formData)
  try {
    const response = await fetch('/api/homeAi', {
      method: 'POST',
      credentials: 'include', // send cookies with the request
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      return data;
    }

    throw new Error('Upload failed: No response data');
  } catch (error) {
    console.log('error========================error', error);
  }
};
