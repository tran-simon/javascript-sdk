import OAuth from 'oauth-1.0a';

import { HmacSHA1 } from 'crypto-es/lib/sha1';
import { Base64 } from 'crypto-es/lib/enc-base64';
import { ClientConfig, ClientParams } from './types';
import { AUTH_BASE } from './constants';

function hmacSha1Hash(baseString: string, key: string) {
  return HmacSHA1(baseString, key).toString(Base64);
}

export function validateConfig({
  host: rawHost,
  ...params
}: ClientParams): ClientConfig {
  const validHostEnd = rawHost.endsWith('/')
    ? rawHost.substr(0, rawHost.length - 1)
    : rawHost;

  const configBase = {
    ...params,
    host: `https://api.${validHostEnd
      .replace('https://', '')
      .replace('http://', '')
      .replace('api.', '')}`,
  };

  if ('consumerKey' in params) {
    // oauth1
    return {
      ...configBase,
      path: `${AUTH_BASE}/oauth1/tokens`,
      oauth1: new OAuth({
        consumer: {
          key: params.consumerKey,
          secret: params.consumerSecret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function: hmacSha1Hash,
      }),
    };
  }

  return {
    ...configBase,
    path: `${AUTH_BASE}/oauth2/tokens`,
    params: {
      client_id: params.clientId,
    },
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export enum Environment {
  Web = 'web',
  ReactNative = 'ReactNative',
  Node = 'Node',
}

export function environment(): Environment {
  if (typeof document !== 'undefined') {
    return Environment.Web;
  }
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return Environment.ReactNative;
  }
  return Environment.Node;
}
