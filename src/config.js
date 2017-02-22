let config = {};

if (window && window.__CONFIG__) {
  try {
    config = JSON.parse(unescape(window.__CONFIG__));
  } catch (e) {} // eslint-disable-line
}

export const API_HOST = config.API_HOST || process.env.API_HOST || 'https://tokenizer-api.herokuapp.com';
export const BASIC_CREDENTIALS = config.BASIC_CREDENTIALS || process.env.BASIC_CREDENTIALS || 'REdSc01wWERDajoK';
