import { useRouter } from "next/router";
import Link from "next/link";
import {BarChart3, AlertTriangle, Users, FileText, Search, User, Bell, HelpCircle, LogOut} from "lucide-react";
import styles from "@/styles/Layout.module.css";
import { useState } from "react";
import logout from "@/lib/auth/logout"; 
// Dans Sidebar, après les imports
if (typeof window !== 'undefined') {
  console.log('Contenu du localStorage:', { ...localStorage });
  console.log('Contenu du sessionStorage:', { ...sessionStorage });
  console.log('Cookies:', document.cookie);
}

const menuItems = [
  {
    title: "Tableau de Bord",
    url: "/locataire/dashboard",
    icon: BarChart3
  },
  {
    title: "Locataires",
    url: "/locataire/locataires",
    icon: Users
  },

  {
    title: "Contrats",
    url: "/locataire/contrats",
    icon: FileText
  }
];

const profileItems = [
  {
    title: "Profil",
    url: "/locataire/profil",
    icon: User
  },
  {
    title: "Notifications",
    url: "/locataire/notifications",
    icon: Bell
  },
  {
    title: "Aide",
    url: "/locataire/aide",
    icon: HelpCircle
  },
];

export default function LocataireSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path) => {
    const baseClasses = `${styles.navLink} ${styles.flexItems}`;

    if (isActive(path)) {
      return `${baseClasses} ${styles.active}`;
    }

    return baseClasses;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Utilisez votre fonction utilitaire de déconnexion
      logout();
      // Note: logout() redirige déjà, donc le code suivant ne sera pas exécuté
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setIsLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      handleLogout();
    }
  };

  return (
    <div className={styles.sidebar}>
      {/* Main Navigation */}
      <div className={styles.mainNav}>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link key={item.title} href={item.url} className={getNavClasses(item.url)}>
              <item.icon className={styles.icon} />
              <span className={styles.text}>{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div className={styles.profileSection}>
          {profileItems.map((item) => (
            <Link key={item.title} href={item.url} className={getNavClasses(item.url)}>
              <item.icon className={styles.icon} />
              <span className={styles.text}>{item.title}</span>
            </Link>
          ))}
        </div>
        
        {/* Logout Button */}
        <div className={styles.logoutContainer}>
          <button 
            onClick={confirmLogout}
            className={`${styles.logoutButton} ${styles.flexItems}`}
            disabled={isLoggingOut}
          >
            <LogOut className={styles.logoutIcon} />
            {isLoggingOut ? "DÉCONNEXION..." : "DÉCONNEXION"}
          </button>
        </div>
      </div>
    </div>
  );
}