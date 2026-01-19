import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { jwtDecode } from 'jwt-decode';
import styles from '@/styles/index.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {

  const router = useRouter();
const [userRole, setUserRole] = useState(null);
const [isLoading, setIsLoading] = useState(true);

// Au lieu de stocker userRole séparément, décodez-le toujours depuis le token
// useEffect(() => {
//   if (typeof window === 'undefined') {
//     setIsLoading(false);
//     return;
//   }

//   const token = localStorage.getItem('token');
  
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       setUserRole(decoded.role);
      
//       if (decoded.role === 'proprietaire') {
//         router.push('/proprietaire/dashboard');
//       } else if (decoded.role === 'locataire') {
//         router.push('/locataire/dashboard');
//       }
//     } catch (err) {
//       console.error('Token invalide :', err);
//       localStorage.removeItem('token');
//       setUserRole(null);
//     }
//   }
  
//   setIsLoading(false);
// }, [router]);

// if (isLoading) {
//   return <div className={styles.loader}>Chargement...</div>;
// }

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <span>R</span>
              </div>
              <h1>RENTLAB</h1>
            </div>

            <nav className={styles.nav}>

              <Link href="/proprietaire/dashboard">Propriétaires</Link>
              <Link href="/locataire/dashboard">Locataires</Link>

            </nav>

            <div className={styles.authButtons}>
              <Link href="/connexion" className={`${styles.btn} ${styles.btnGhost}`} role="button">Connexion</Link>
              <Link href="/inscription-simple" className={`${styles.btn} ${styles.btnPrimary}`} role="button">Inscription</Link>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>Gérez vos biens immobiliers<br />
              <span className={styles.heroHighlight}>en toute simplicité</span>
            </h1>

            <p className={styles.heroDescription}>
              RENTLAB simplifie la gestion locative pour propriétaires et locataires.
              Contrats, paiements, documents - tout centralisé dans une plateforme moderne.
            </p>

            <div className={styles.heroButtons}>
              <Link href="/inscription" className={`${styles.btn} ${styles.btnWhite}`} role="button">Commencer maintenant</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="proprietaires" className={styles.ownerSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Pour les <span className={styles.textPrimary}>Propriétaires</span></h2>
            <p>Simplifiez la gestion de votre patrimoine immobilier avec des outils professionnels</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featuresImage}>
              <Image src="/owner-features-Bn8ofeAt-1.jpg" alt="Interface de gestion pour propriétaires" width="350" height="600" />
            </div>

            <div className={styles.featuresList}>
              <div className={`${styles.featureCard} ${styles.borderPrimary}`}>
                <h3>Gestion des biens</h3>
                <p>Centralisez tous vos biens immobiliers avec photos, documents et informations détaillées.</p>
              </div>
              <div className={`${styles.featureCard} ${styles.borderPrimary}`}>
                <h3>Contrats intelligents</h3>
                <p>Créez, modifiez et gérez vos contrats de location en quelques clics.</p>
              </div>
              <div className={`${styles.featureCard} ${styles.borderPrimary}`}>
                <h3>Suivi des locataires</h3>
                <p>Base de données complète de vos locataires avec historique et communications.</p>
              </div>
              <div className={`${styles.featureCard} ${styles.borderPrimary}`}>
                <h3>Bilan financier</h3>
                <p>Tableaux de bord et rapports détaillés de vos revenus et charges locatives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="locataires" className={styles.tenantSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Pour les <span className={styles.textSecondary}>Locataires</span></h2>
            <p>Accédez facilement à vos documents et suivez vos paiements en temps réel</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featuresList}>
              <div className={`${styles.featureCard} ${styles.borderSecondary}`}>
                <h3>Mes contrats</h3>
                <p>Accédez à tous vos contrats de location actuels et passés en un clic.</p>
              </div>
              <div className={`${styles.featureCard} ${styles.borderSecondary}`}>
                <h3>Historique complet</h3>
                <p>Consultez l&apos;historique détaillé de tous vos paiements et transactions.</p>
              </div>
              <div className={`${styles.featureCard} ${styles.borderSecondary}`}>
                <h3>Reçus PDF</h3>
                <p>Téléchargez instantanément vos reçus de loyer au format PDF.</p>
              </div>
              <div className={`${styles.featureCard} ${styles.borderSecondary}`}>
                <h3>Suivi des paiements</h3>
                <p>Visualisez l&aposétat de vos paiements et les échéances à venir.</p>
              </div>
            </div>

            <div className={styles.featuresImage}>
              <Image src="/tenant-features-C5jhgz-7.jpg" alt="Interface pour locataires" width="350" height="600" />
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <div className={`${styles.logoIcon} ${styles.white}`}>
                  <span>R</span>
                </div>
                <h3>RENTLAB</h3>
              </div>
              <p>La solution complète pour simplifier la gestion locative.
                Pour propriétaires et locataires exigeants.</p>
            </div>

            <div className={styles.footerLinks}>
              <div>
                <h4>Produit</h4>
                <ul>
                  <li><Link href="#">Fonctionnalités</Link></li>
                  <li><Link href="#">Tarifs</Link></li>
                  <li><Link href="#">Démo</Link></li>
                </ul>
              </div>

              <div>
                <h4>Support</h4>
                <ul>
                  <li><Link href="#">Centre d&aposaide</Link></li>
                  <li><Link href="#">Contact</Link></li>
                  <li><Link href="#">Documentation</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2024 RENTLAB. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}