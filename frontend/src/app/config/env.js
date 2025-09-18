export const config = {
 API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
 APP_NAME: import.meta.env.VITE_APP_NAME || 'SellMate',
 IS_DEVELOPMENT: import.meta.env.DEV,
 IS_PRODUCTION: import.meta.env.PROD,
};

export default config;