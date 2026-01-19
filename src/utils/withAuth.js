import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Higher Order Component pour protéger les routes privées
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * 
 * @param {React.Component} WrappedComponent - Le composant à envelopper
 * @param {Object} options - Options de configuration
 * @param {string} [options.redirectTo='/connexion'] - URL de redirection si non authentifié
 * @param {string} [options.requireRole] - Rôle requis pour accéder à la page (optionnel)
 * @returns {React.Component} Le composant enveloppé avec la protection d'authentification
 */
const withAuth = (WrappedComponent, options = {}) => {
  const {
    redirectTo = '/connexion',
    requireRole = null,
  } = options;

  const WithAuth = (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        // Vérifier côté client (dans le navigateur)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const userRole = localStorage.getItem('userRole');
          
          // Vérifier si un token est présent
          if (!token) {
            router.push(redirectTo);
            return false;
          }
          
          // Vérifier le rôle si nécessaire
          if (requireRole && userRole !== requireRole) {
            // Rediriger vers le tableau de bord par défaut selon le rôle
            const defaultDashboard = userRole === 'proprietaire' 
              ? '/proprietaire/dashboard' 
              : '/locataire/dashboard';
            router.push(defaultDashboard);
            return false;
          }
          
          return true;
        }
        
        return false;
      };

      // Exécuter la vérification d'authentification
      const isAuthenticated = checkAuth();
      setIsAuthorized(isAuthenticated);
      setIsLoading(false);
    }, [router, requireRole]);

    // Pendant le chargement, afficher un indicateur de chargement ou null
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          backgroundColor: '#f8f9fa'
        }}>
          <div>Vérification de l'authentification...</div>
        </div>
      );
    }

    // Si autorisé, afficher le composant enveloppé
    // Sinon, retourner null (la redirection est gérée dans useEffect)
    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  // Ajouter le nom du composant pour le débogage
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuth.displayName = `withAuth(${displayName})`;

  return WithAuth;
};

export default withAuth;
