/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  ServerSideEncryption,
} from '@aws-sdk/client-s3';

const client = new S3Client({
  //enter creds here
  region: '',
  endpoint:
    '',
  credentials: {
    accessKeyId: '',
    secretAccessKey:
      '',
  },
});

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, htmlFileName)}`;
}

export async function uploadToCloudflare(file: string, url: string) {
  // return `${file} uploaded to ${url}`;
  const key = file.split('/').pop();
  const bucket = url.split('/').pop();
  try {
    const input = {
      Body: file,
      Bucket: bucket,
      Key: key,
      ServerSideEncryption: 'AES256' as ServerSideEncryption, // Ensure the type matches,
      StorageClass: 'STANDARD_IA',
    } as PutObjectCommandInput;

    const command = new PutObjectCommand(input);
    const response = await client.send(command);
    console.log(response);
  } catch (error) {
    console.log('ERROR: ', error);
    throw new Error(`Failed to upload ${file} to ${url}`);
  }
  return `${url}/${key}`;
}
