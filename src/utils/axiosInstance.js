//import axios from 'axios';
import axios from 'axios';

// Création d'une instance Axios avec une configuration de base
// const axiosInstance = axios.create({
  // Utilisation de la variable d'environnement NEXT_PUBLIC_API_URL si elle est définie
  // Sinon, utilisation de l'URL par défaut
  // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // Délai d'attente de la requête (10 secondes)
//   timeout: 10000,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       console.log('Requête vers:', config.url);
//       console.log('Token présent:', !!token);

//       const publicRoutes = ['/auth/login', '/auth/users'];
//       const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
      
//       console.log('Route publique:', isPublicRoute);

//       if (!isPublicRoute && token) {
//         console.log('Ajout du token à la requête');
//         config.headers.Authorization = `Bearer ${token}`;
//       } else if (!isPublicRoute && !token) {
//         console.warn('Token manquant pour route privée');
//       }
//     }

//     return config;
//   },
//   (error) => {
//     console.error('Erreur intercepteur requête:', error);
//     return Promise.reject(error);
//   }
// );


// // Intercepteur pour gérer les réponses
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;

//       if (status === 401 && typeof window !== 'undefined') {
//         const currentPath = window.location.pathname;

//         localStorage.removeItem('token');

//         // Redirection uniquement si pas déjà sur login ou inscription
//         if (currentPath !== '/login' && currentPath !== '/inscription') {
//           window.location.href = '/login';
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );



// export default axiosInstance;
