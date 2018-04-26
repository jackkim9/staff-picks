import platformConfig from '../../../platformConfig';
import kmsClientHelper from './kmsClientHelper';

const appEnvironment = platformConfig.appEnv || 'production';
const options = {
  kmsEnvironment: platformConfig.kmsEnvironment || 'encrypted',
  clientId: platformConfig.clientId || '',
  clientSecret: platformConfig.clientSecret || '',
  apiBase: platformConfig.api[appEnvironment],
  tokenUrl: platformConfig.tokenUrl,
};

export default kmsClientHelper(options);
