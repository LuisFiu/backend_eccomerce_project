import { config } from "dotenv";

config();

export default {
  app: {
    MONGO: {
      URL: process.env.MONGO_URL,
    },
    JWT: {
      KEY: process.env.JWT_KEY,
    },
  },
};
