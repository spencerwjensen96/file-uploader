import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  ServerSideEncryption,
} from '@aws-sdk/client-s3';

// eslint-disable-next-line import/no-cycle
import { getSecrets } from './utils';

const secrets = await getSecrets();

const client = new S3Client({
  region: secrets[secrets.activeCloudProvider].region,
  endpoint: secrets[secrets.activeCloudProvider].storageUrl,
  credentials: {
    accessKeyId: secrets[secrets.activeCloudProvider].accessKey,
    secretAccessKey: secrets[secrets.activeCloudProvider].secretKey,
  },
});

export default async function uploadToCloudflare(file: string, url: string) {
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
