module.exports = function (/* ctx */) {
    return {
      build: {
        env: {
          VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL || 'https://fallback-api-url.com'
        }
      },
    };
  };
  