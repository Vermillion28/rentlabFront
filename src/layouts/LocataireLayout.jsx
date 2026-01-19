import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '@/lib/auth/useAuth';
import LocataireSidebar from '@/components/locataireSidebar';
import styles from '@/styles/Layout.module.css';

const LocataireLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Rediriger si l'utilisateur n'est pas un locataire
  useEffect(() => {
    if (!loading && user?.role !== 'locataire') {
      router.push('/unauthorized');
    }
  }, [user, loading, router]);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas un locataire, ne rien afficher (la redirection est en cours)
  if (user.role !== 'locataire') {
    return null;
  }

  return (
    <div className={styles.layout}>
      <LocataireSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default LocataireLayout;
