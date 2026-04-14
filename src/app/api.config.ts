// COMENTA Y DESCOMENTA SEGÚN LO QUE NECESITES

// --- CONFIGURACIÓN LOCALHOST ---
export const FRONTEND_LOGIN_URL = 'http://localhost:4300/Login';
export const API_BASE_URL = 'http://localhost:8084/api/auth';
export const REDIRECT_URLS = {
  agricultor: 'http://localhost:4201',
  pesocabal: 'http://localhost:4202',
  beneficio: 'http://localhost:4203'
}



// --- CONFIGURACIÓN HOST (Netlify) ---
/*
export const FRONTEND_LOGIN_URL = 'https://loginsingenio.netlify.app';
export const API_BASE_URL = 'https://login-backends-1b6c2f35caf3.herokuapp.com/api/auth/login';
export const REDIRECT_URLS = {
   agricultor: 'https://agricultor.netlify.app',
   pesocabal: 'https://pesocabal.netlify.app',
   beneficio: 'https://beneficiofront.netlify.app'
};
*/
