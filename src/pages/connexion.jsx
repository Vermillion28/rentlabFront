import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiMail, FiLock, FiLoader, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import styles from '../styles/connexion.module.css';
import Link from 'next/link';

// Créer une instance Axios avec une URL de base
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     router.push('/');
  //   }
  //   setIsMounted(true);
  // }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulaire soumis");
    setError('');
    
    // Validation simple
    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      console.log("Tentative de connexion avec:", email);
      
      // Appel à l'API de connexion
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      console.log("Réponse reçue:", response.data);

      //CORRECTION ICI : La structure est response.data directement
      const { token, user } = response.data;
      
      if (!token || !user || !user.role) {
        throw new Error('Réponse du serveur invalide');
      }
      
      const role = user.role;
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.nom);
      localStorage.setItem('userEmail', user.email);

      console.log("Token stocké, rôle:", role);
      
      // Rediriger en fonction du rôle
      const dashboardPath = role === 'proprietaire' 
        ? '/proprietaire/dashboard' 
        : '/locataire/dashboard';
      
      console.log('Redirection vers:', dashboardPath);
      router.push(dashboardPath);
      
    } catch (err) {
      console.error('Erreur de connexion complète:', err);
      console.error('Détails de la réponse:', err.response?.data);
      
      setError(
        err.response?.data?.message || 
        'Identifiants incorrects. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // // Ne rien afficher tant que la vérification n'est pas terminée
  // if (!isMounted) {
  //   return null;
  // }

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Connexion | RENTLAB</title>
        <meta name="description" content="Connectez-vous à votre espace RENTLAB" />
      </Head>
      
      <div className={styles.loginCard}>
        <div className={styles.logo}><Link href="/">RENTLAB</Link></div>
        <h1 className={styles.title}>Connectez-vous à RENTLAB</h1>
        
        {error && (
          <div className={styles.errorMessage} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{position: 'absolute',left: '12px',top: '50%',transform: 'translateY(-50%)',color: '#a0aec0',fontSize: '1.1rem'}} />
              <input 
                id="email" 
                type="email" 
                className={`${styles.input} ${error ? styles.inputError : ''}`} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isLoading} 
                autoComplete="email" 
                placeholder="votre@email.com" 
                style={{ paddingLeft: '40px' }} 
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" className={styles.label}>
                Mot de passe
              </label>
              <a href="/mot-de-passe-oublie" className={styles.forgotPassword}>
                Mot de passe oublié ?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: '1.1rem'}} />
              <input 
                id="password" 
                type="password" 
                className={`${styles.input} ${error ? styles.inputError : ''}`} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isLoading} 
                autoComplete="current-password" 
                placeholder="••••••••" 
                style={{ paddingLeft: '40px' }} 
                required
              />
            </div>
          </div>
          
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <FiLoader className={styles.loadingSpinner} />
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <FiArrowRight style={{ marginLeft: '4px' }} />
              </>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>
            Vous n'avez pas de compte ?{' '}
            <a href="/inscription" style={{ color: '#3182ce', textDecoration: 'none',fontWeight: 500}}>
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}