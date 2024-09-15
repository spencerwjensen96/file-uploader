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
//   endpoint: secrets.storageUrl,
  credentials: {
    accessKeyId: secrets[secrets.activeCloudProvider].accessKey,
    secretAccessKey: secrets[secrets.activeCloudProvider].secretKey,
  },
});

export default async function uploadToAws(
  file: string,
  url: string,
): Promise<string> {
  const key = file.split('/').pop();
  const bucket = url.split('/').pop();
  try {
    const input = {
      Body: file,
      Bucket: bucket,
      Key: key,
    //   ServerSideEncryption: 'AES256' as ServerSideEncryption, // Ensure the type matches,
    //   StorageClass: 'STANDARD_IA',
    } as PutObjectCommandInput;
    console.log("input: ", input);

    const response = await client.send(new PutObjectCommand(input));
    console.log(response);
  } catch (error) {
    console.log('ERROR: ', error);
    throw new Error(`Failed to upload ${file} to ${url}`);
  }
  return `${url}/${key}`;
}
