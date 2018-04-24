// Read local .env file. The environment variables will be assigned with process.env in the beginning
import dotEnv from 'dotenv';
dotEnv.config();

const platformConfig = {
  loginUrl: 'https://login.nypl.org/auth/login',
  tokenUrl: 'https://isso.nypl.org/',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  appEnv: process.env.APP_ENV,
  kmsEnvironment: process.env.KMS_ENV,
  api: {
    development: 'https://dev-platform.nypl.org/api/v0.1',
    qa: 'https://qa-platform.nypl.org/api/v0.1',
    production: 'https://platform.nypl.org/api/v0.1',
  },
  endpoints: {
    allStaffPicksLists: '/book-lists?type=staff-picks',
    allTeensLists: '/book-lists?type=teens',
    allKidsPicksLists: '/book-lists?type=kids',
    staffPicksPath: '/book-lists/staff-picks/',
  },
};

export default platformConfig;
