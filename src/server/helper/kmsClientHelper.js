import NyplDataApiClient from '@nypl/nypl-data-api-client';
import aws from 'aws-sdk';
import logger from '../../../logger';

const kmsClientHelper = (options) => {
  const {
    kmsEnvironment,
    apiBase,
    tokenUrl,
    clientId,
    clientSecret,
  } = options;
  const keys = [clientId, clientSecret];
  const CACHE = {};
  let decryptKMS;
  let kms;

  // If we want to use encrypted client id and secret strings, then we need to set up
  // AWS and the KMS decryption function.
  if (kmsEnvironment === 'encrypted') {
    kms = new aws.KMS({
      region: 'us-east-1',
    });

    decryptKMS = (key) => {
      const params = {
        CiphertextBlob: new Buffer(key, 'base64'),
      };

      return new Promise((resolve, reject) => {
        kms.decrypt(params, (err, data) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(data.Plaintext.toString());
          }
        });
      });
    };
  }

  function client() {
    // If we already instantiated the NYPL Api Data Client, then just return it.
    if (CACHE.nyplApiClient) {
      return Promise.resolve(CACHE.nyplApiClient);
    }

    // If we want to use encrypted client id and secret strings, then we first need to
    // decrypt the strings and instantiate the NyplDataApiClient with those decrypted values.
    if (kmsEnvironment === 'encrypted') {
      return Promise.all(keys.map(decryptKMS))
        .then(([decryptedClientId, decryptedClientSecret]) => {
          const nyplApiClient = new NyplDataApiClient({
            base_url: apiBase,
            oauth_key: decryptedClientId,
            oauth_secret: decryptedClientSecret,
            oauth_url: tokenUrl,
          });

          CACHE.nyplApiClient = nyplApiClient;
          return nyplApiClient;
        })
        .catch((error) => {
          logger.error('ERROR trying to decrypt using KMS.', error);
          throw ('ERROR trying to decrypt using KMS.', error);
        });
    }

    // If we are using unencrypted strings, then simply use those.
    const nyplApiClient = new NyplDataApiClient({
      base_url: apiBase,
      oauth_key: clientId,
      oauth_secret: clientSecret,
      oauth_url: tokenUrl,
    });

    CACHE.nyplApiClient = nyplApiClient;

    return Promise.resolve(nyplApiClient);
  }

  return client;
};

export default kmsClientHelper;
