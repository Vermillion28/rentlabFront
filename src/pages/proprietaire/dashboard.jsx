import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Building, Users, FileText, Home, Calendar, DollarSign, TrendingUp, TrendingDown, RefreshCw, AlertCircle, CheckCircle, Clock, ChevronRight, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import styles from "@/styles/dashboard.module.css";
import ProprietaireLayout from "@/layouts/ProprietaireLayout";
import { useRouter } from "next/router";
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBiens: 0,
    totalContrats: 0,
    totalLocataires: 0,
    activeContrats: 0,
    revenueMensuel: 0,
    revenueAnnuel: 0,
    tauxOccupation: 0,
    paiementsEnRetard: 0
  });

  const [recentContrats, setRecentContrats] = useState([]);
  const [recentLocataires, setRecentLocataires] = useState([]);
  const [contratsExpirant, setContratsExpirant] = useState([]);
  const [biensDisponibles, setBiensDisponibles] = useState([]);
  const [paiementsStats, setPaiementsStats] = useState({
    thisMonth: 0,
    lastMonth: 0,
    percentageChange: 0
  });

  const [token, setToken] = useState(null);

  // Initialisation au montage
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedToken = localStorage.getItem("token");
  //     setToken(storedToken);
  //   }
  // }, []);

  // // Charger les données quand le token est disponible
  // useEffect(() => {
  //   if (token) {
  //     fetchDashboardData();
  //   }
  // }, [token]);

  // Fonction pour charger toutes les données du dashboard
  // const fetchDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     const [
  //       contratsResponse,
  //       biensResponse,
  //       locatairesResponse,
  //       paiementsResponse
  //     ] = await Promise.all([
  //       fetch(`${API_URL}/contrats/mes-contrats`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }),
  //       fetch(`${API_URL}/biens/mes-biens`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }),
  //       fetch(`${API_URL}/users/locataires`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }),
  //       fetch(`${API_URL}/paiements/mes-paiements?limit=100`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       })
  //     ]);

  //     const contratsData = await contratsResponse.json();
  //     const biensData = await biensResponse.json();
  //     const locatairesData = await locatairesResponse.json();
  //     const paiementsData = paiementsResponse.ok ? await paiementsResponse.json() : { paiements: [] };

  //     const contrats = contratsData.contrats || [];
  //     const biens = biensData.biens || [];
  //     const locataires = locatairesData.locataires || locatairesData.users || [];
  //     const paiements = paiementsData.paiements || [];

  //     // Calcul des statistiques
  //     const activeContrats = contrats.filter(c => c.statut === 'actif');
  //     const activeContratsCount = activeContrats.length;

  //     const totalRevenueMensuel = activeContrats.reduce((sum, contrat) =>
  //       sum + (parseFloat(contrat.loyer_mensuel) || 0), 0
  //     );

  //     const tauxOccupation = biens.length > 0
  //       ? (biens.filter(b => b.statut === 'loue').length / biens.length) * 100
  //       : 0;

  //     // Contrats récents (moins de 30 jours)
  //     const thirtyDaysAgo = new Date();
  //     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  //     const recentContratsList = contrats
  //       .filter(c => {
  //         const createdDate = new Date(c.created_at);
  //         return createdDate > thirtyDaysAgo && createdDate <= new Date();
  //       })
  //       .slice(0, 5);

  //     // Locataires récents
  //     const recentLocatairesList = locataires.slice(0, 5);

  //     // Contrats expirant bientôt (dans les 30 prochains jours)
  //     const thirtyDaysFromNow = new Date();
  //     thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  //     const expiringContrats = contrats
  //       .filter(c => {
  //         if (!c.date_fin) return false;
  //         const endDate = new Date(c.date_fin);
  //         const today = new Date();
  //         today.setHours(0, 0, 0, 0);
  //         return endDate <= thirtyDaysFromNow && endDate >= today;
  //       })
  //       .slice(0, 5);

  //     // Biens disponibles
  //     const availableBiens = biens
  //       .filter(b => b.statut === 'disponible')
  //       .slice(0, 5);

  //     // Statistiques des paiements
  //     const now = new Date();
  //     const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  //     const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  //     const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  //     const thisMonthPaiements = paiements.filter(p => {
  //       const paymentDate = new Date(p.date_paiement || p.created_at);
  //       return paymentDate >= thisMonthStart && paymentDate <= now;
  //     }).reduce((sum, p) => sum + (parseFloat(p.montant) || 0), 0);

  //     const lastMonthPaiements = paiements.filter(p => {
  //       const paymentDate = new Date(p.date_paiement || p.created_at);
  //       return paymentDate >= lastMonthStart && paymentDate <= lastMonthEnd;
  //     }).reduce((sum, p) => sum + (parseFloat(p.montant) || 0), 0);

  //     const percentageChange = lastMonthPaiements > 0
  //       ? ((thisMonthPaiements - lastMonthPaiements) / lastMonthPaiements) * 100
  //       : thisMonthPaiements > 0 ? 100 : 0;

  //     // Mise à jour de l'état
  //     setStats({
  //       totalBiens: biens.length,
  //       totalContrats: contrats.length,
  //       totalLocataires: locataires.length,
  //       activeContrats: activeContratsCount,
  //       revenueMensuel: totalRevenueMensuel,
  //       revenueAnnuel: totalRevenueMensuel * 12,
  //       tauxOccupation: Math.round(tauxOccupation * 10) / 10, // Arrondi à 1 décimale
  //       paiementsEnRetard: paiements.filter(p => p.statut === 'en_retard').length
  //     });

  //     setRecentContrats(recentContratsList);
  //     setRecentLocataires(recentLocatairesList);
  //     setContratsExpirant(expiringContrats);
  //     setBiensDisponibles(availableBiens);
  //     setPaiementsStats({
  //       thisMonth: thisMonthPaiements,
  //       lastMonth: lastMonthPaiements,
  //       percentageChange: Math.round(percentageChange * 10) / 10 // Arrondi à 1 décimale
  //     });

  //   } catch (error) {
  //     console.error("Erreur lors du chargement du dashboard:", error);
  //     // Afficher un message d'erreur plus convivial
  //     alert("Impossible de charger les données du dashboard. Veuillez vérifier votre connexion.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fonction pour formater les montants
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };

  // Fonction pour naviguer vers les différentes pages
  const navigateTo = (path) => {
    router.push(path);
  };

  // Composant de carte de statistique
  const StatCard = ({ title, value, icon, change, subtitle, color = "primary", onClick }) => (
    <Card className={`${styles.statCard} ${styles[color]}`} onClick={onClick}>
      <CardContent className={styles.statCardContent}>
        <div className={styles.statCardHeader}>
          <div className={styles.statIcon}>
            {icon}
          </div>
          {change && (
            <Badge className={`${styles.changeBadge} ${change > 0 ? styles.positive : styles.negative}`}>
              {change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change)}%
            </Badge>
          )}
        </div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statTitle}>{title}</div>
        {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
      </CardContent>
    </Card>
  );

  // Composant de liste rapide
  const QuickList = ({ title, items, emptyText, icon, onViewAll, viewAllPath }) => (
    <Card className={styles.quickListCard}>
      <CardHeader className={styles.quickListHeader}>
        <CardTitle className={styles.quickListTitle}>
          {icon}
          {title}
        </CardTitle>
        <button className={styles.viewAllButton} onClick={() => viewAllPath ? navigateTo(viewAllPath) : onViewAll?.()}>
          Voir tout <ChevronRight size={16} />
        </button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className={styles.emptyQuickList}>
            <p>{emptyText}</p>
          </div>
        ) : (
          <div className={styles.quickListItems}>
            {items.map((item, index) => (
              <div key={index} className={styles.quickListItem}>
                {item.content}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // if (loading) {
  //   return (
  //     <ProprietaireLayout>
  //       <div className={styles.loadingState}>
  //         <RefreshCw className={styles.spinner} />
  //         <p>Chargement du tableau de bord...</p>
  //       </div>
  //     </ProprietaireLayout>
  //   );
  // }

  return (
    <ProprietaireLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header du dashboard */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>
                <Activity className={styles.titleIcon} /> Tableau de Bord
              </h1>
              <p className={styles.subtitle}>
                Vue d&apos;ensemble de votre activité immobilière
              </p>
            </div>
          </div>

          {/*stat card*/}
          <div className={styles.mainStatsGrid}>
            <StatCard
              title="Locataires"
              value={stats.totalLocataires}
              icon={<Users size={24} />}
              subtitle="Total de locataires actifs"
              color="locataires"
              onClick={() => navigateTo("/proprietaire/locataires")}
            />
            <StatCard
              title="Biens"
              value={stats.totalBiens}
              icon={<Building size={24} />}
              subtitle="Total de biens enregistrés"
              color="biens"
              onClick={() => navigateTo("/proprietaire/locataires")}
            />
            <StatCard
              title="Contrats Actifs"
              value={stats.activeContrats}
              icon={<FileText size={24} />}
              subtitle={`${stats.totalContrats} au total`}
              color="contrats"
              onClick={() => navigateTo("/proprietaire/contrats")}
            />
          </div>

        </div>


        {/* Section des listes rapides */}
        <div className={styles.listsGrid}>
          {/* Contrats récents */}
          <QuickList
            title="Contrats Récents"
            icon={<FileText size={20} />}
            items={recentContrats.map(contrat => ({
              content: (
                <div className={styles.contratItem}>
                  <div className={styles.contratInfo}>
                    <strong>{contrat.bien_nom || "Bien sans nom"}</strong>
                    <span className={styles.contratLocataire}>
                      {contrat.locataire_nom || "Locataire inconnu"}
                    </span>
                  </div>
                  <div className={styles.contratDetails}>
                    <Badge variant={contrat.statut === 'actif' ? "success" : "secondary"}>
                      {contrat.statut}
                    </Badge>
                    <span className={styles.contratDate}>
                      {formatDate(contrat.created_at)}
                    </span>
                  </div>
                </div>
              )
            }))}
            emptyText="Aucun contrat récent"
            viewAllPath="/proprietaire/contrats"
          />

          {/* Contrats expirant bientôt */}
          <QuickList
            title="Contrats Expirant Bientôt"
            icon={<Clock size={20} />}
            items={contratsExpirant.map(contrat => ({
              content: (
                <div className={styles.expiringItem}>
                  <div className={styles.expiringInfo}>
                    <strong>{contrat.bien_nom || "Bien sans nom"}</strong>
                    <span className={styles.expiringDate}>
                      Expire le {formatDate(contrat.date_fin)}
                    </span>
                  </div>
                  <div className={styles.expiringActions}>
                    <Badge variant="warning">
                      {Math.ceil((new Date(contrat.date_fin) - new Date()) / (1000 * 60 * 60 * 24))} jours
                    </Badge>
                  </div>
                </div>
              )
            }))}
            emptyText="Aucun contrat n'expire bientôt"
            viewAllPath="/proprietaire/contrats"
          />

          {/* Locataires récents */}
          <QuickList
            title="Derniers Locataires"
            icon={<Users size={20} />}
            items={recentLocataires.map(locataire => ({
              content: (
                <div className={styles.locataireItem}>
                  <div className={styles.locataireAvatar}>
                    <Users size={20} />
                  </div>
                  <div className={styles.locataireInfo}>
                    <strong>{locataire.nom_user || "Locataire"}</strong>
                    <span className={styles.locataireEmail}>
                      {locataire.email}
                    </span>
                  </div>
                  <div className={styles.locataireStatus}>
                    <CheckCircle size={16} className={styles.activeIcon} />
                  </div>
                </div>
              )
            }))}
            emptyText="Aucun locataire récent"
            viewAllPath="/proprietaire/locataires"
          />

          {/* Biens disponibles */}
          <QuickList
            title="Biens Disponibles"
            icon={<Building size={20} />}
            items={biensDisponibles.map(bien => ({
              content: (
                <div className={styles.bienItem}>
                  <div className={styles.bienInfo}>
                    <strong>{bien.nom}</strong>
                    <span className={styles.bienAdresse}>
                      {bien.adresse}
                    </span>
                  </div>
                  <div className={styles.bienDetails}>
                    <Badge variant="outline">
                      {formatCurrency(bien.prix || 0)}/mois
                    </Badge>
                    <span className={styles.bienType}>
                      {bien.type}
                    </span>
                  </div>
                </div>
              )
            }))}
            emptyText="Aucun bien disponible"
            viewAllPath="/proprietaire/biens"
          />
        </div>

        {/* Section des actions rapides */}
        <Card className={styles.quickActionsCard}>
          <CardHeader>
            <CardTitle>
              <Activity size={20} /> Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.quickActionsGrid}>
              <button
                className={styles.quickAction}
                onClick={() => navigateTo("/proprietaire/contrats")}
              >
                <div className={styles.quickActionIcon}>
                  <FileText size={24} />
                </div>
                <div className={styles.quickActionText}>
                  <strong>Créer un contrat</strong>
                  <span>Nouvelle location</span>
                </div>
              </button>

              <button
                className={styles.quickAction}
                onClick={() => navigateTo("/proprietaire/locataires")}
              >
                <div className={styles.quickActionIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.quickActionText}>
                  <strong>Inviter locataire</strong>
                  <span>Envoyer une invitation</span>
                </div>
              </button>

              <button
                className={styles.quickAction}
                onClick={() => navigateTo("/proprietaire/biens")}
              >
                <div className={styles.quickActionIcon}>
                  <Building size={24} />
                </div>
                <div className={styles.quickActionText}>
                  <strong>Ajouter un bien</strong>
                  <span>Nouveau bien immobilier</span>
                </div>
              </button>

              <button
                className={styles.quickAction}
                onClick={() => navigateTo("/proprietaire/paiements")}
              >
                <div className={styles.quickActionIcon}>
                  <DollarSign size={24} />
                </div>
                <div className={styles.quickActionText}>
                  <strong>Suivi paiements</strong>
                  <span>Voir les transactions</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Section de résumé */}
        <div className={styles.summarySection}>
          <Card className={styles.summaryCard}>
            <CardHeader>
              <CardTitle>Résumé de l&apos;activité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.summaryContent}>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>
                    <Building size={16} />
                    <span>Biens immobiliers</span>
                  </div>
                  <div className={styles.summaryValue}>
                    <strong>{stats.totalBiens}</strong> biens
                    <Badge variant="outline">
                      {stats.activeContrats} loués
                    </Badge>
                  </div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>
                    <FileText size={16} />
                    <span>Contrats actifs</span>
                  </div>
                  <div className={styles.summaryValue}>
                    <strong>{stats.activeContrats}</strong> contrats
                    <Badge variant="outline">
                      {contratsExpirant.length} expirant
                    </Badge>
                  </div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>
                    <DollarSign size={16} />
                    <span>Revenus mensuels</span>
                  </div>
                  <div className={styles.summaryValue}>
                    <strong>{formatCurrency(stats.revenueMensuel)}</strong>
                    <Badge variant={paiementsStats.percentageChange >= 0 ? "success" : "destructive"}>
                      {paiementsStats.percentageChange >= 0 ? "+" : ""}
                      {paiementsStats.percentageChange.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>
                    <Users size={16} />
                    <span>Locataires actifs</span>
                  </div>
                  <div className={styles.summaryValue}>
                    <strong>{stats.totalLocataires}</strong> locataires
                    <Badge variant="outline">
                      {recentLocataires.length} récents
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={styles.performanceCard}>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.performanceContent}>
                <div className={styles.performanceMetric}>
                  <div className={styles.metricLabel}>
                    Taux d&apos;occupation
                  </div>
                  <div className={styles.metricValue}>
                    {stats.tauxOccupation.toFixed(1)}%
                  </div>
                  <div className={styles.metricBar}>
                    <div
                      className={styles.metricBarFill}
                      style={{ width: `${Math.min(stats.tauxOccupation, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className={styles.performanceMetric}>
                  <div className={styles.metricLabel}>
                    Paiements à jour
                  </div>
                  <div className={styles.metricValue}>
                    {stats.paiementsEnRetard === 0 ? "100%" :
                      `${100 - (stats.paiementsEnRetard / stats.activeContrats * 100).toFixed(1)}%`}
                  </div>
                  <div className={styles.metricBar}>
                    <div
                      className={styles.metricBarFill}
                      style={{
                        width: `${stats.paiementsEnRetard === 0 ? 100 :
                          100 - (stats.paiementsEnRetard / stats.activeContrats * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className={styles.performanceMetric}>
                  <div className={styles.metricLabel}>
                    Nouveaux contrats ce mois
                  </div>
                  <div className={styles.metricValue}>
                    {recentContrats.length}
                  </div>
                  <div className={styles.metricBar}>
                    <div
                      className={styles.metricBarFill}
                      style={{ width: `${Math.min((recentContrats.length / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProprietaireLayout>
  );
}