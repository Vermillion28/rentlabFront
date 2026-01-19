import { useState, useEffect } from 'react'; // Ajoutez useEffect
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiCheck, FiArrowRight, FiHome, FiUserCheck } from 'react-icons/fi';
import axios from 'axios';
import styles from '@/styles/auth.module.css';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function Inscription() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [prefilledEmail, setPrefilledEmail] = useState("");
  const [invitationDetails, setInvitationDetails] = useState(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // États pour la gestion de l'interface
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [userType, setUserType] = useState('proprietaire'); // 'proprietaire' ou 'locataire'

  // Vérifier si on a un token d'invitation dans l'URL
  useEffect(() => {
    if (router.query.token) {
      const tokenValue = router.query.token;
      setToken(tokenValue);
      setUserType('locataire'); // Automatiquement locataire si token présent
      fetchInvitationDetails(tokenValue);
    }
    
    if (router.query.email) {
      const emailValue = router.query.email;
      setPrefilledEmail(emailValue);
      setFormData(prev => ({ ...prev, email: emailValue }));
    }
  }, [router.query]);

  // Récupérer les détails de l'invitation
  const fetchInvitationDetails = async (token) => {
    setIsLoadingInvitation(true);
    try {
      const response = await api.get(`/invitations/validate/${token}`);
      setInvitationDetails(response.data.invitation);
    } catch (error) {
      console.error('Erreur chargement invitation:', error);
      setSubmitError('Invitation invalide ou expirée');
    } finally {
      setIsLoadingInvitation(false);
    }
  };

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Effacer les erreurs générales lors de la modification
    if (submitError) {
      setSubmitError('');
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Vérifier que l'email correspond à l'invitation (si locataire)
    if (userType === 'locataire' && invitationDetails) {
      if (formData.email !== invitationDetails.email_invite) {
        newErrors.email = `Cet email ne correspond pas à l'invitation. Utilisez: ${invitationDetails.email_invite}`;
      }
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }

    // Validation de la confirmation du mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation du téléphone (optionnel)
    if (formData.phone && !/^[0-9+\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation avant soumission
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      // Préparer les données à envoyer
      const dataToSend = {
        nom: formData.nom.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || null,
        token: userType === 'locataire' ? token : undefined
      };

      console.log('Données envoyées:', { ...dataToSend, password: '***' });

      // Envoi des données au backend
      const response = await api.post('/auth/register', dataToSend);

      // Succès : réinitialisation du formulaire et affichage du message
      setFormData({
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      });

      setIsSuccess(true);

      // Message différent selon le type d'utilisateur
      const successMessage = userType === 'locataire' 
        ? 'Félicitations ! Vous êtes maintenant locataire sur la plateforme.'
        : 'Votre compte propriétaire a été créé avec succès !';

      console.log(successMessage);

      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);

      // Gestion des erreurs spécifiques
      if (error.response) {
        // Erreur 400 (Bad Request) - validation côté serveur
        if (error.response.status === 400) {
          const errorData = error.response.data;
          if (errorData.message) {
            setSubmitError(errorData.message);
          } else if (errorData.errors) {
            const newErrors = {};
            errorData.errors.forEach(err => {
              const field = err.path;
              if (field in formData) {
                newErrors[field] = err.msg;
              }
            });
            setErrors(prev => ({
              ...prev,
              ...newErrors
            }));
            setSubmitError('Veuillez corriger les erreurs dans le formulaire');
          }
        }
        // Erreur 409 (Conflict) - email déjà utilisé
        else if (error.response.status === 409) {
          setErrors(prev => ({
            ...prev,
            email: 'Cet email est déjà utilisé'
          }));
        }
        // Autres erreurs
        else {
          setSubmitError(error.response.data.message || 'Une erreur est survenue lors de l\'inscription');
        }
      } else {
        setSubmitError('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un chargement pendant la vérification de l'invitation
  if (isLoadingInvitation) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loadingState}>
            <span className={styles.spinner}></span>
            <p>Vérification de votre invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {userType === 'locataire' 
            ? 'Accepter l\'invitation - RentLab' 
            : 'Créer un compte propriétaire - RentLab'}
        </title>
        <meta name="description" content={
          userType === 'locataire'
            ? "Acceptez l'invitation pour devenir locataire sur notre plateforme"
            : "Créez votre compte propriétaire pour gérer vos biens immobiliers"
        } />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1>
            {userType === 'locataire' ? (
              <>
                <FiUserCheck className={styles.titleIcon} />
                Accepter l'invitation
              </>
            ) : (
              <>
                <FiHome className={styles.titleIcon} />
                Créer un compte propriétaire
              </>
            )}
          </h1>
          
          {userType === 'locataire' && invitationDetails ? (
            <div className={styles.invitationInfo}>
              <p>Vous avez été invité par <strong>{invitationDetails.proprietaire.nom}</strong></p>
              {invitationDetails.bien && (
                <p className={styles.bienInfo}>
                  <FiHome /> Bien concerné : {invitationDetails.bien.nom}
                </p>
              )}
              <p className={styles.expiryInfo}>
                ⏰ Cette invitation expire le {new Date(invitationDetails.expires_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ) : (
            <p>Remplissez le formulaire ci-dessous pour vous inscrire</p>
          )}
        </div>

        {isSuccess ? (
          <div className={styles.successMessage}>
            <FiCheck className={styles.icon} />
            <div>
              <p>
                {userType === 'locataire'
                  ? 'Votre compte locataire a été créé avec succès !'
                  : 'Votre compte propriétaire a été créé avec succès !'}
              </p>
              <p>Redirection vers la page de connexion...</p>
            </div>
          </div>
        ) : (
          <>
            {submitError && (
              <div className={styles.errorAlert}>
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* Champ caché pour le token */}
              {token && (
                <input type="hidden" name="token" value={token} />
              )}

              <div className={styles.formGroup}>
                <label htmlFor="nom">
                  <FiUser className={styles.icon} />
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={errors.nom ? styles.errorInput : ''}
                  placeholder="Votre nom complet"
                  disabled={isLoading}
                  required
                />
                <span className={styles.errorMessage}>{errors.nom || ''}</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  <FiMail className={styles.icon} />
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.errorInput : ''}
                  placeholder="votre@email.com"
                  disabled={isLoading || userType === 'locataire'}
                  required
                  readOnly={userType === 'locataire'}
                />
                <span className={styles.errorMessage}>{errors.email || ''}</span>
                {userType === 'locataire' && (
                  <small className={styles.helpText}>
                    Cet email est prédéfini par votre invitation
                  </small>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">
                  <FiUser className={styles.icon} />
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? styles.errorInput : ''}
                  placeholder="+228 XX XX XX XX"
                  disabled={isLoading}
                />
                <span className={styles.errorMessage}>{errors.phone || ''}</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">
                  <FiLock className={styles.icon} />
                  Mot de passe *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? styles.errorInput : ''}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <span className={styles.errorMessage}>{errors.password || ''}</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">
                  <FiLock className={styles.icon} />
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? styles.errorInput : ''}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <span className={styles.errorMessage}>{errors.confirmPassword || ''}</span>
              </div>

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    {userType === 'locataire' ? 'Acceptation en cours...' : 'Inscription en cours...'}
                  </>
                ) : (
                  <>
                    {userType === 'locataire' ? 'Accepter l\'invitation' : 'S\'inscrire'}
                    <FiArrowRight className={styles.icon} />
                  </>
                )}
              </button>
            </form>

            {userType === 'proprietaire' && (
              <div className={styles.loginLink}>
                Vous avez déjà un compte ?
                <Link href="/connexion" passHref>
                  Connectez-vous
                </Link>
              </div>
            )}

            {userType === 'locataire' && (
              <div className={styles.invitationNote}>
                <p className={styles.noteText}>
                  <strong>Note :</strong> En acceptant cette invitation, vous devenez locataire sur la plateforme.
                  {invitationDetails?.bien && ' Vous serez lié au bien spécifié.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}