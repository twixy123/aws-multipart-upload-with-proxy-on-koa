const axios = require('axios');
const { BASE_URL } = require('../constants')

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 60 * 1000, // 60 sec
  headers: {
    Accept: 'application/json; charset=UTF-8',
    'Content-Type': 'application/json; charset=UTF-8'
  }
});

instance.interceptors.request.use((config) => {
  return config
}, function (error) {
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  return Promise.reject(error)
})

module.exports = instance