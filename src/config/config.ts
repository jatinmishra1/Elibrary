import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
};

export const config = Object.freeze(_config);

// Object.freeze --> this is used to make _config readonly as if we do not do thsi then it can be mutate outside
