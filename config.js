const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  apiUrl: process.env.API_URL,
  
  dbUrl: process.env.DATABASE_URL,
  
  jwtSecret: process.env.JWT_SECRET,
  
  frontendUrl: process.env.FRONTEND_URL,
  
  port: process.env.PORT || 3000,
  
  isDevelopment
};

module.exports = config;