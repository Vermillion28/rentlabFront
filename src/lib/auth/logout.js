// utils/logout.js
/**
 * Fonction utilitaire pour gérer la déconnexion de l'utilisateur
 */
const logout = () => {
  return new Promise((resolve) => {
    try {
      // Afficher ce qu'il y a avant
      console.log('AVANT déconnexion - localStorage:', 
        Object.keys(localStorage).length > 0 ? 
        Object.keys(localStorage).map(key => `${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`) : 
        'vide'
      );
      
      // Méthode 1: Supprimer item par item
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        keysToRemove.push(key);
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Méthode 2: Vider complètement
      localStorage.clear();
      sessionStorage.clear();
      
      // Afficher ce qu'il y a après
      console.log('APRÈS déconnexion - localStorage length:', localStorage.length);
      
      // Nettoyer les cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Événement pour notifier
      window.dispatchEvent(new Event('authChange'));
      
      // Attendre un peu pour s'assurer que tout est nettoyé
      setTimeout(() => {
        console.log('Redirection...');
        // Utiliser replace pour éviter de pouvoir revenir en arrière
        window.location.replace('/connexion');
        resolve(true);
      }, 200);
      
    } catch (error) {
      console.error('Erreur:', error);
      window.location.href = '/connexion';
      resolve(false);
    }
  });
};

export default logout;