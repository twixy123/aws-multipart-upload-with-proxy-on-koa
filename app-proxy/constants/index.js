require('dotenv').config()

const constants = {
  PORT: process.env.PORT || 9000,
  BASE_URL: process.env.API_BASE_URL || "https://jsonplaceholder.typicode.com",
  BUCKET_REGION: process.env.BUCKET_REGION,
  BUCKET_NAME: process.env.BUCKET_NAME,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY
}

module.exports = constants