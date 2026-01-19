import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, Shield, X, Loader2, Trash2, RefreshCw, Filter, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import styles from "@/styles/locataire.module.css";
import ProprietaireLayout from "@/layouts/ProprietaireLayout";
import MyButton from "@/components/myButton";
import { toast } from "react-toastify";
import { CardUsers } from "@/components/Mycard";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function Locataires() {
    // États
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [locataires, setLocataires] = useState([]);
    const [loading, setLoading] = useState({
        page: true,
        submit: false,
        delete: false,
        refresh: false
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Données du formulaire
    const [formData, setFormData] = useState({ email: "" });

    // Token
    const [token, setToken] = useState(null);

    // Filtres
    const [filters, setFilters] = useState({
        status: "all",
        type: "all",
        search: ""
    });

    // Initialisation au montage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);
        }
    }, []);

    // Charger les données quand le token est disponible
    // useEffect(() => {
    //     if (token) {
    //         fetchData();
    //     }
    // }, [token]);

    // // ==========================================
    // // CHARGEMENT DES DONNÉES
    // // ==========================================
    // const fetchData = async () => {
    //     setLoading(prev => ({ ...prev, page: true, refresh: true }));
    //     setError(null);

    //     try {
    //         await Promise.all([
    //             fetchInvitations(),
    //             fetchLocataires()
    //         ]);
    //     } catch (error) {
    //         console.error("Erreur chargement données:", error);
    //         setError("Erreur lors du chargement des données");
    //     } finally {
    //         setLoading(prev => ({ ...prev, page: false, refresh: false }));
    //     }
    // };

    // // ==========================================
    // // RÉCUPÉRER LES INVITATIONS
    // // ==========================================
    // const fetchInvitations = async () => {
    //     try {
    //         const response = await fetch(`${API_URL}/invitations/mes-invitations`, {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             }
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json().catch(() => ({}));
    //             throw new Error(errorData.message || `Erreur ${response.status}`);
    //         }

    //         const data = await response.json();
    //         setInvitations(data.invitations || []);
    //     } catch (error) {
    //         console.error("Erreur récupération invitations:", error);
    //         setError(`Impossible de charger les invitations: ${error.message}`);
    //         throw error;
    //     }
    // };

    // // ==========================================
    // // RÉCUPÉRER LES LOCATAIRES
    // // ==========================================
    // const fetchLocataires = async () => {
    //     try {
    //         console.log("🔍 Fetching locataires...");
            
    //         const response = await fetch(`${API_URL}/contrats/locataires-disponibles`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //         });

    //         console.log("📊 Response status:", response.status);
            
    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log("✅ Locataires reçus:", data);
    //             const locatairesList = data.locataires || [];
    //             console.log(`📋 ${locatairesList.length} locataire(s) trouvé(s)`);
    //             setLocataires(locatairesList);
    //         } else {
    //             const errorData = await response.json().catch(() => ({}));
    //             console.error("❌ Erreur response:", response.status, errorData);
    //             setError(`Erreur lors du chargement des locataires: ${errorData.message || 'Erreur serveur'}`);
    //         }
    //     } catch (error) {
    //         console.error("❌ Erreur lors du chargement des locataires:", error);
    //         setError('Erreur de connexion au serveur');
    //     }
    // };

    // // ==========================================
    // // ENVOYER UNE INVITATION
    // // ==========================================
     const handleSubmit = async (e) => {
        e.preventDefault();
        
    //     setLoading(prev => ({ ...prev, submit: true }));
    //     setError(null);
    //     setSuccess(null);

    //     try {
    //         const response = await fetch(`${API_URL}/invitations/send`, {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 email_invite: formData.email.trim()
    //             })
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             setSuccess("Invitation envoyée avec succès ! Le locataire recevra un email.");
    //             setFormData({ email: "" });
    //             await fetchInvitations();

    //             setTimeout(() => {
    //                 closeModal();
    //                 setSuccess(null);
    //             }, 3000);
    //         } else {
    //             setError(data.message || "Erreur lors de l'envoi de l'invitation");
    //         }
    //     } catch (error) {
    //         console.error("Erreur:", error);
    //         setError("Erreur de connexion au serveur");
    //     } finally {
    //         setLoading(prev => ({ ...prev, submit: false }));
    //     }
    };

    // // ==========================================
    // // ANNULER UNE INVITATION
    // // ==========================================
     const handleCancelInvitation = async (invitationId) => {
    //     if (!confirm("Voulez-vous vraiment annuler cette invitation ?")) return;

    //     setLoading(prev => ({ ...prev, delete: true }));

    //     try {
    //         // Essayez d'abord PUT /cancel, puis DELETE si ça échoue
    //         let response = await fetch(`${API_URL}/invitations/${invitationId}/cancel`, {
    //             method: "PUT",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             }
    //         });

    //         // Si PUT échoue, essayez DELETE
    //         if (!response.ok) {
    //             response = await fetch(`${API_URL}/invitations/${invitationId}`, {
    //                 method: "DELETE",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json"
    //                 }
    //             });
    //         }

    //         if (response.ok) {
    //             setSuccess("Invitation annulée avec succès");
    //             await fetchData();
    //             setTimeout(() => setSuccess(null), 3000);
    //         } else {
    //             const data = await response.json();
    //             setError(data.message || "Erreur lors de l'annulation");
    //         }
    //     } catch (error) {
    //         console.error("Erreur annulation:", error);
    //         setError("Erreur de connexion au serveur");
    //     } finally {
    //         setLoading(prev => ({ ...prev, delete: false }));
    //     }
     };

    // ==========================================
    // GESTION DES FILTRES
    // ==========================================
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({
            status: "all",
            type: "all",
            search: ""
        });
    };

    // ==========================================
    // FORMATAGE DES STATUTS
    // ==========================================
    const formatUserStatus = (invitation) => {
        const status = invitation.statut || invitation.status;
        
        if (!status) return "Inconnu";
        
        const statusLower = status.toLowerCase().replace(/_/g, ' ');
        
        switch (statusLower) {
            case "en attente":
            case "pending":
                return "En attente";
            case "acceptee":
            case "accepted":
            case "accepté":
                return "Acceptée";
            case "declinee":
            case "declined":
            case "refusé":
                return "Refusée";
            case "expiree":
            case "expired":
            case "expiré":
                return "Expirée";
            case "annulee":
            case "cancelled":
            case "annulé":
                return "Annulée";
            default: 
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    // ==========================================
    // COMBINER ET FORMATER LES UTILISATEURS
    // ==========================================
    const allUsers = [
        ...invitations.map(inv => ({
            id: inv.id,
            type: "invitation",
            nom: inv.email_invite,
            email: inv.email_invite,
            status: formatUserStatus(inv),
            statusOriginal: inv.statut || inv.status,
            created_at: inv.created_at,
            expires_at: inv.expires_at,
            bien_nom: inv.bien_nom || null
        })),
        ...locataires.map(loc => ({
            id: loc.id,
            type: "locataire",
            nom: loc.nom_user || loc.nom || "Nom non renseigné",
            email: loc.email,
            status: "Actif",
            statusOriginal: "actif",
            created_at: loc.created_at,
            phone: loc.phone || null
        }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // ==========================================
    // FILTRER LES UTILISATEURS
    // ==========================================
    const filteredUsers = allUsers.filter(user => {
        // Filtre par statut
        if (filters.status !== "all" && user.status !== filters.status) {
            return false;
        }

        // Filtre par type
        if (filters.type !== "all" && user.type !== filters.type) {
            return false;
        }

        // Filtre par recherche
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            return (
                (user.nom && user.nom.toLowerCase().includes(searchTerm)) ||
                (user.email && user.email.toLowerCase().includes(searchTerm)) ||
                (user.bien_nom && user.bien_nom.toLowerCase().includes(searchTerm))
            );
        }

        return true;
    });

    // ==========================================
    // STATISTIQUES
    // ==========================================
    const stats = {
        totalInvitations: invitations.length,
        invitationsPending: invitations.filter(i => 
            i.statut === "en_attente" || 
            i.statut === "pending"
        ).length,
        invitationsAccepted: invitations.filter(i => 
            i.statut === "acceptee" || 
            i.statut === "accepted"
        ).length,
        invitationsExpired: invitations.filter(i => 
            i.statut === "expiree" || 
            i.statut === "expired"
        ).length,
        locatairesActifs: locataires.length,
        nouveauxCeMois: invitations.filter(inv => {
            if (!inv.created_at) return false;
            const date = new Date(inv.created_at);
            const now = new Date();
            return date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();
        }).length
    };

    // ==========================================
    // GESTION DU FORMULAIRE
    // ==========================================
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ email: "" });
        setError(null);
        setSuccess(null);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        console.log("Édition de:", user);
    };

    // ==========================================
    // FORMATER LES BADGES DE STATUT
    // ==========================================
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Actif": return "success";
            case "En attente": return "warning";
            case "Acceptée": return "success";
            case "Refusée": return "destructive";
            case "Expirée": return "secondary";
            case "Annulée": return "outline";
            default: return "default";
        }
    };

    // ==========================================
    // RENDU PRINCIPAL
    // ==========================================
    // if (loading.page && allUsers.length === 0) {
    //     return (
    //         <ProprietaireLayout>
    //             <div className={styles.loadingState}>
    //                 <Loader2 className={styles.spinner} />
    //                 <p>Chargement des données...</p>
    //             </div>
    //         </ProprietaireLayout>
    //     );
    // }

    return (
        <ProprietaireLayout>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div>
                            <h1 className={styles.title}>
                                <Users className={styles.titleIcon} />Gestion des Locataires
                            </h1>
                            <p className={styles.subtitle}>
                                Invitez et gérez vos locataires et invitations
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            <button
                                // onClick={fetchData}
                                className={styles.refreshButton}
                                disabled={loading.refresh}
                            >
                            </button>
                            <MyButton
                                text="Inviter un locataire"
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </div>

                    {/* Messages de notification */}
                    {error && (
                        <div className={styles.errorMessage}>
                            <X size={16} />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className={styles.successMessage}>
                            <Shield size={16} />
                            {success}
                        </div>
                    )}

                    {/* Statistiques */}
                    <div className={styles.statsGrid}>
                        <Card className={styles.statsCard}>
                            <CardHeader className={styles.statsCardHeader}>
                                <CardTitle className={styles.statsCardTitle}>
                                    <span><Mail size={16} /> Total Invitations</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={styles.statsValue}>{stats.totalInvitations}</div>
                                <div className={styles.statsSubtext}>
                                    {stats.invitationsPending} en attente
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={styles.statsCard}>
                            <CardHeader className={styles.statsCardHeader}>
                                <CardTitle className={styles.statsCardTitle}>
                                    <span><Users size={16} /> Locataires Actifs</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`${styles.statsValue} ${styles.activeStats}`}>
                                    {stats.locatairesActifs}
                                </div>
                                <div className={styles.statsSubtext}>
                                    {stats.invitationsAccepted} inscriptions
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={styles.statsCard}>
                            <CardHeader className={styles.statsCardHeader}>
                                <CardTitle className={styles.statsCardTitle}>
                                    <span><Calendar size={16} /> En Attente</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`${styles.statsValue} ${styles.pendingStats}`}>
                                    {stats.invitationsPending}
                                </div>
                                <div className={styles.statsSubtext}>
                                    {stats.invitationsExpired} expirées
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={styles.statsCard}>
                            <CardHeader className={styles.statsCardHeader}>
                                <CardTitle className={styles.statsCardTitle}>
                                    <span><Shield size={16} /> Nouveaux ce mois</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`${styles.statsValue} ${styles.newStats}`}>
                                    {stats.nouveauxCeMois}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section Filtres */}
                    <div className={styles.filtersSection}>
                        <div className={styles.filtersHeader}>
                            <h3 className={styles.filtersTitle}>
                                <Filter size={16} />
                                Filtres
                            </h3>
                            <button
                                onClick={clearFilters}
                                className={styles.clearFiltersButton}
                            >
                                <X size={14} />
                                Réinitialiser
                            </button>
                        </div>

                        <div className={styles.filtersGrid}>
                            {/* Barre de recherche */}
                            <div className={styles.searchContainer}>
                                <Search size={16} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, email ou bien..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className={styles.searchInput}
                                />
                                {filters.search && (
                                    <button
                                        onClick={() => handleFilterChange("search", "")}
                                        className={styles.clearSearchButton}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Filtre par statut */}
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Statut</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="Actif">Actif</option>
                                    <option value="En attente">En attente</option>
                                    <option value="Acceptée">Acceptée</option>
                                    <option value="Refusée">Refusée</option>
                                    <option value="Expirée">Expirée</option>
                                    <option value="Annulée">Annulée</option>
                                </select>
                            </div>

                            {/* Filtre par type */}
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange("type", e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="locataire">Locataires</option>
                                    <option value="invitation">Invitations</option>
                                </select>
                            </div>

                            {/* Statistiques des filtres */}
                            <div className={styles.filterStats}>
                                <Badge variant="outline" className={styles.filterBadge}>
                                    {filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''}
                                </Badge>
                                {filters.status !== "all" && (
                                    <Badge variant="secondary" className={styles.filterBadge}>
                                        {filters.status}
                                    </Badge>
                                )}
                                {filters.type !== "all" && (
                                    <Badge variant="secondary" className={styles.filterBadge}>
                                        {filters.type === "locataire" ? "Locataires" : "Invitations"}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Liste des locataires et invitations */}
                    <div className={styles.usersList}>
                        <div className={styles.usersListHeader}>
                            <h2 className={styles.usersListTitle}>
                                Liste des locataires et invitations ({allUsers.length})
                            </h2>
                        </div>

                        {allUsers.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Users size={48} className={styles.emptyIcon} />
                                <h3>Aucun locataire ou invitation</h3>
                                <p className={styles.emptySubtext}>
                                    Commencez par inviter un locataire via le bouton ci-dessus
                                </p>
                            </div>
                        ) : (
                            <div className={styles.usersGrid}>
                                {filteredUsers.map((user) => (
                                    <CardUsers 
                                        key={`${user.type}-${user.id}`} 
                                        userName={user.nom} 
                                        userEmail={user.email} 
                                        userStatus={user.status} 
                                        statusVariant={getStatusBadgeVariant(user.status)} 
                                        onEdit={() => openEditModal(user)}
                                        onDelete={
                                            user.type === "invitation" &&
                                            (user.statusOriginal === "en_attente" || 
                                             user.statusOriginal === "pending")
                                                ? () => handleCancelInvitation(user.id)
                                                : undefined
                                        }
                                        disableDelete={
                                            user.type !== "invitation" ||
                                            !(user.statusOriginal === "en_attente" || 
                                              user.statusOriginal === "pending") ||
                                            loading.delete
                                        }
                                        isDeleting={loading.delete}
                                        additionalInfo={
                                            user.bien_nom ? `Bien: ${user.bien_nom}` : null
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Invitation */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <Card className={styles.modalCard}>
                                <CardHeader className={styles.modalHeader}>
                                    <div className={styles.modalTitleSection}>
                                        <CardTitle className={styles.modalTitle}>
                                            <Mail size={20} />
                                            Inviter un locataire
                                        </CardTitle>
                                        <button
                                            onClick={closeModal}
                                            className={styles.closeButton}
                                            disabled={loading.submit}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className={styles.form}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="email" className={styles.label}>
                                                Email du futur locataire *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={styles.input}
                                                placeholder="locataire@example.com"
                                                required
                                                disabled={loading.submit}
                                                autoComplete="email"
                                            />
                                            <p className={styles.helpText}>
                                                Le locataire recevra un email avec un lien pour créer son compte et rejoindre la plateforme.
                                            </p>
                                        </div>

                                        <div className={styles.formActions}>
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className={styles.cancelButton}
                                                disabled={loading.submit}
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className={styles.submitButton}
                                                disabled={loading.submit || !formData.email.trim()}
                                            >
                                                {loading.submit ? (
                                                    <>
                                                        <Loader2 className={styles.buttonSpinner} />
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail size={16} />
                                                        Envoyer l'invitation
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </ProprietaireLayout>
    );
}