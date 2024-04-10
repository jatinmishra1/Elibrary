import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  dataBaseURL: process.env.MONGO_CONNECTION_URL,
  env: process.env.NODE_ENV,
};

export const config = Object.freeze(_config);

// Object.freeze --> this is used to make _config readonly as if we do not do thsi then it can be mutate outside
