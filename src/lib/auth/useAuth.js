import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

/**
 * Hook personnalisé pour gérer l'authentification
 * @returns {Object} { user, isAuthenticated, loading, setUser, logout }
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour décoder le token et mettre à jour l'utilisateur
  const updateUserFromToken = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return null;
      }

      // Décoder le token JWT
      const decoded = jwtDecode(token);
      
      // Vérifier si le token est expiré
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        setUser(null);
        return null;
      }

      // Mettre à jour l'utilisateur avec les données décodées
      const userData = {
        id: decoded.id,
        nom: decoded.nom,
        email: decoded.email,
        role: decoded.role,
        // Ajouter d'autres champs si nécessaire
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      localStorage.removeItem('token');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Effet pour charger l'utilisateur au montage du composant
  useEffect(() => {
    updateUserFromToken();

    // Écouter les changements de stockage local pour la déconnexion depuis d'autres onglets
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        updateUserFromToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateUserFromToken]);

  // Fonction pour mettre à jour manuellement l'utilisateur
  const setUserData = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    setUser: setUserData,
    updateUser: updateUserFromToken,
    logout,
  };
};

export default useAuth;
