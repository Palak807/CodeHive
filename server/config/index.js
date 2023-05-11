import { config } from 'dotenv';
config();



export const {
    NODE_ENV,
    PORT,
    SECRET_KEY,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    GITHUB_KEY,
    GITHUB_SECRET,
    ROOT_URL,
    JWT_SECRET
} = process.env;
