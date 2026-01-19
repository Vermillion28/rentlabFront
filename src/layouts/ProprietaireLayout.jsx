import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '@/lib/auth/useAuth';
import Sidebar from '@/components/Sidebar';
import styles from '@/styles/Layout.module.css';


const ProprietaireLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default ProprietaireLayout;

// const ProprietaireLayout = ({ children }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // Rediriger si l'utilisateur n'est pas un propriétaire
//   // useEffect(() => {
//   //   if (!loading && user?.role !== 'proprietaire') {
//   //     router.push('/unauthorized');
//   //   }
//   // }, [user, loading, router]);

//   // Afficher un indicateur de chargement pendant la vérification
//   if (loading || !user) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.loadingSpinner}></div>
//       </div>
//     );
//   }

//   // Si l'utilisateur n'est pas un propriétaire, ne rien afficher (la redirection est en cours)
//   // if (user.role !== 'proprietaire') {
//   //   return null;
//   // }

//   return (
//     <div className={styles.layout}>
//       <Sidebar />
//       <main className={styles.mainContent}>
//         {children}
//       </main>
//     </div>
//   );
// };

// export default ProprietaireLayout;
