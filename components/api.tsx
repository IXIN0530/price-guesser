import axios from 'axios'

const api = axios.create({
  baseURL: 'https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch',
  // baseURL: 'http://localhost:8000/',
  timeout: 10000,
});

api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default api;