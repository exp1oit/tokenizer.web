let config = {};

if (typeof window !== 'undefined' && window.__CONFIG__) {
  try {
    config = JSON.parse(unescape(window.__CONFIG__));
  } catch (e) {} // eslint-disable-line
}

module.exports = {
   API_HOST:  config.API_HOST || process.env.API_HOST || 'https://tokenizer-api.herokuapp.com',
   BASIC_CREDENTIALS:  config.BASIC_CREDENTIALS || process.env.BASIC_CREDENTIALS || 'REdSc01wWERDajoK'
};
