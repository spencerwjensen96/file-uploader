import path from 'path';
import * as fs from 'fs';

import { app } from 'electron';

// eslint-disable-next-line import/no-cycle
import uploadToAws from './aws';
// eslint-disable-next-line import/no-cycle
import uploadToCloudflare from './cloudflare';

// export const CONFIG_FILE_PATH =

export async function getSecrets() {
  const data = await fs.promises.readFile(
    path.join(app.getPath('userData'), 'config.json'),
    'utf-8',
  );
  return JSON.parse(data);
}

// eslint-disable-next-line consistent-return
export function chooseProvider(
  provider: string,
): (file: string, url: string) => Promise<string> {
  if (provider === 'cloudflare') {
    return uploadToCloudflare;
  }
  if (provider === 'aws') {
    return async (): Promise<string> => {
      return 'amazon.com';
    };
    // return uploadToAws;
  }
  if (provider === 'azure') {
    return async (): Promise<string> => {
      return 'azure.com';
    };
  }
  return async (): Promise<string> => {
    return '';
  };
}
