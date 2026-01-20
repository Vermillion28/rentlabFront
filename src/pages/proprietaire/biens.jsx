import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, X, Loader2, Plus, Edit, Trash2, RefreshCw, Filter, Search } from "lucide-react";
import styles from "@/styles/biens.module.css";
import ProprietaireLayout from "@/layouts/ProprietaireLayout";
import MyButton from "@/components/myButton";
import { CardBiens } from "@/components/Mycard";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function Biens() {
  // États
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBien, setSelectedBien] = useState(null);
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState({
    page: true,
    submit: false,
    delete: false,
    refresh: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Données du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    ville: "",
    type: "",
    superficie: "",
    prix: "",
    avance: "",
    description: "",
    statut: "disponible"
  });

  // Token
  const [token, setToken] = useState(null);
  // Ajoutez cette fonction pour tester l'API directement
  // const testApiDirectly = async () => {
  //   const testData = {
  //     nom: "Test API Frontend",
  //     adresse: "123 Rue Test",
  //     ville: "Lomé",
  //     type: "Appartement",
  //     superficie: "50",
  //     prix: "50000",
  //     avance: "100000",
  //     description: "Test depuis frontend",
  //     statut: "disponible"
  //   };

  //   console.log('Test API direct avec:', testData);

  //   try {
  //     const response = await fetch(`${API_URL}/biens`, {
  //       method: "POST",
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(testData)
  //     });

  //     console.log('Test - Status:', response.status);
  //     const text = await response.text();
  //     console.log('Test - Réponse:', text);

  //     return { status: response.status, body: text };
  //   } catch (error) {
  //     console.error('Test - Erreur:', error);
  //   }
  // };


  // Initialisation au montage
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedToken = localStorage.getItem("token");
  //     setToken(storedToken);
  //   }
  //   testApiDirectly()
  // }, []);

  // Charger les données quand le token est disponible
  // useEffect(() => {
  //   if (token) {
  //     fetchBiens();
  //   }
  // }, [token]);

  // ==========================================
  // CHARGEMENT DES DONNÉES
  // ==========================================
  // const fetchBiens = async () => {
  //   setLoading(prev => ({ ...prev, page: true, refresh: true }));
  //   setError(null);

  //   try {
  //     console.log('=== FRONTEND - Fetch Biens ===');
  //     console.log('URL:', `${API_URL}/biens/mes-biens`);
  //     console.log('Token complet:', token);
  //     console.log('Token formaté:', `Bearer ${token}`);

  //     const response = await fetch(`${API_URL}/biens/mes-biens`, {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       }
  //     });

  //     console.log('Status:', response.status);
  //     console.log('Status text:', response.statusText);

  //     // Afficher TOUS les headers de la réponse
  //     console.log('Headers réponse:');
  //     response.headers.forEach((value, key) => {
  //       console.log(`  ${key}: ${value}`);
  //     });

  //     if (!response.ok) {
  //       let errorText = '';
  //       try {
  //         const errorData = await response.json();
  //         console.log('Erreur data:', errorData);
  //         errorText = errorData.message || `Erreur ${response.status}`;
  //       } catch (e) {
  //         errorText = await response.text();
  //         console.log('Erreur text:', errorText);
  //       }
  //       throw new Error(errorText);
  //     }

  //     const data = await response.json();
  //     console.log('Données reçues:', data);
  //     setBiens(data.biens || []);

  //   } catch (error) {
  //     console.error("Erreur complète chargement biens:", error);
  //     setError("Impossible de charger les biens: " + error.message);
  //   } finally {
  //     setLoading(prev => ({ ...prev, page: false, refresh: false }));
  //   }
  // };

  // ==========================================
  // CRÉATION D'UN BIEN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(prev => ({ ...prev, submit: true }));
    // setError(null);
    // setSuccess(null);

    // try {
    //   console.log('=== FRONTEND - Création bien ===');
    //   console.log('URL:', `${API_URL}/biens`);
    //   console.log('Token:', token);
    //   console.log('Token (premiers 20 chars):', token ? token.substring(0, 20) + '...' : 'Aucun token');
    //   console.log('Données formData:', formData);
    //   console.log('Données stringifiées:', JSON.stringify(formData));

    //   // Vérifiez chaque champ requis
    //   const requiredFields = ['nom', 'adresse', 'ville', 'prix', 'type'];
    //   const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');

    //   if (missingFields.length > 0) {
    //     console.error('Champs manquants:', missingFields);
    //     setError(`Champs requis manquants: ${missingFields.join(', ')}`);
    //     return;
    //   }

    //   const response = await fetch(`${API_URL}/biens`, {
    //     method: "POST",
    //     headers: {
    //       "Authorization": `Bearer ${token}`,
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   console.log('Status:', response.status);
    //   console.log('Status text:', response.statusText);
    //   console.log('OK?', response.ok);

    //   // Essayer de lire la réponse
    //   let responseText = '';
    //   try {
    //     responseText = await response.text();
    //     console.log('Réponse text (brute):', responseText);

    //     // Essayer de parser comme JSON
    //     if (responseText) {
    //       const responseData = JSON.parse(responseText);
    //       console.log('Réponse JSON:', responseData);
    //     }
    //   } catch (parseError) {
    //     console.log('Réponse n\'est pas du JSON:', responseText);
    //   }

    //   // Lire tous les headers
    //   console.log('Headers réponse:');
    //   for (const [key, value] of response.headers.entries()) {
    //     console.log(`  ${key}: ${value}`);
    //   }

    //   if (!response.ok) {
    //     let errorMessage = `Erreur ${response.status}`;
    //     if (responseText) {
    //       try {
    //         const errorData = JSON.parse(responseText);
    //         errorMessage = errorData.message || errorData.error || errorMessage;
    //       } catch (e) {
    //         errorMessage = responseText;
    //       }
    //     }
    //     throw new Error(errorMessage);
    //   }

    //   // Si on arrive ici, c'est un succès
    //   const data = JSON.parse(responseText);
    //   console.log('✅ Succès! Données:', data);

    //   setSuccess("Bien créé avec succès !");
    //   setFormData({
    //     nom: "",
    //     adresse: "",
    //     ville: "",
    //     type: "",
    //     superficie: "",
    //     prix: "",
    //     avance: "",
    //     description: "",
    //     statut: "disponible"
    //   });

    //   await fetchBiens();

    //   setTimeout(() => {
    //     closeModal();
    //     setSuccess(null);
    //   }, 3000);

    // } catch (error) {
    //   console.error('❌ Erreur complète création bien:', error);
    //   console.error('Stack:', error.stack);
    //   setError(error.message || "Erreur de connexion au serveur");
    // } finally {
    //   setLoading(prev => ({ ...prev, submit: false }));
    // }
  };

  // ==========================================
  // MODIFICATION D'UN BIEN
  // ==========================================
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // if (!selectedBien) return;

    // setLoading(prev => ({ ...prev, submit: true }));
    // setError(null);
    // setSuccess(null);

    // try {
    //   const response = await fetch(`${API_URL}/biens/${selectedBien.bien_id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Authorization": `Bearer ${token}`,
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     setSuccess("Bien modifié avec succès !");
    //     await fetchBiens(); // Recharger la liste
    //     setTimeout(() => {
    //       closeEditModal();
    //       setSuccess(null);
    //     }, 3000);
    //   } else {
    //     setError(data.message || "Erreur lors de la modification du bien");
    //   }
    // } catch (error) {
    //   console.error("Erreur modification bien:", error);
    //   setError("Erreur de connexion au serveur");
    // } finally {
    //   setLoading(prev => ({ ...prev, submit: false }));
    // }
  };

  // ==========================================
  // SUPPRESSION D'UN BIEN
  // ==========================================
  const handleDeleteBien = async (bien_id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) return;

  //   setLoading(prev => ({ ...prev, delete: true }));

  //   try {
  //     const response = await fetch(`${API_URL}/biens/${bien_id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       }
  //     });

  //     if (response.ok) {
  //       setSuccess("Bien supprimé avec succès");
  //       await fetchBiens(); // Recharger la liste
  //       setTimeout(() => setSuccess(null), 3000);
  //     } else {
  //       const data = await response.json();
  //       setError(data.message || "Erreur lors de la suppression");
  //     }
  //   } catch (error) {
  //     console.error("Erreur suppression:", error);
  //     setError("Erreur de connexion au serveur");
  //   } finally {
  //     setLoading(prev => ({ ...prev, delete: false }));
  //   }
   };
  // // Ajoutez ces états après les autres états
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    search: ""
  });

 // Ajoutez ces fonctions après fetchBiens()
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

  // Fonction pour filtrer les biens
  const filteredBiens = biens.filter(bien => {
    // Filtre par statut
    if (filters.status !== "all" && bien.statut !== filters.status) {
      return false;
    }

    // Filtre par type
    if (filters.type !== "all" && bien.type !== filters.type) {
      return false;
    }

    // Filtre par recherche
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        bien.nom.toLowerCase().includes(searchTerm) ||
        bien.adresse.toLowerCase().includes(searchTerm) ||
        bien.ville.toLowerCase().includes(searchTerm) ||
        (bien.description && bien.description.toLowerCase().includes(searchTerm))
      );
    }

    return true;
  });

  // ==========================================
  // GESTION DU FORMULAIRE
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      nom: "",
      adresse: "",
      ville: "",
      type: "",
      superficie: "",
      prix: "",
      avance: "",
      description: "",
      statut: "disponible"
    });
    setError(null);
    setSuccess(null);
  };

  const openEditModal = (bien) => {
    setSelectedBien(bien);
    setFormData({
      nom: bien.nom || "",
      adresse: bien.adresse || "",
      ville: bien.ville || "",
      type: bien.type || "",
      superficie: bien.superficie || "",
      prix: bien.prix || "",
      avance: bien.avance || "",
      description: bien.description || "",
      statut: bien.statut || "disponible"
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBien(null);
    setFormData({
      nom: "",
      adresse: "",
      ville: "",
      type: "",
      superficie: "",
      prix: "",
      avance: "",
      description: "",
      statut: "disponible"
    });
    setError(null);
    setSuccess(null);
  };

  // ==========================================
  // STATISTIQUES
  // ==========================================
  const stats = {
    total: biens.length,
    occupied: biens.filter(bien => bien.statut === "loue").length,
    available: biens.filter(bien => bien.statut === "disponible").length,
    maintenance: biens.filter(bien => bien.statut === "entretien").length,
  };

  // ==========================================
  // FORMATER LE STATUT POUR L'AFFICHAGE
  // ==========================================
  const formatStatus = (statut) => {
    switch (statut) {
      case "disponible": return "Disponible";
      case "loue": return "Occupé";
      case "entretien": return "En entretien";
      default: return statut;
    }
  };

  const getStatusVariant = (statut) => {
    switch (statut) {
      case "disponible": return "success";
      case "loue": return "destructive";
      case "entretien": return "warning";
      default: return "default";
    }
  };

  // ==========================================
  // RENDU PRINCIPAL
  // ==========================================
  // if (loading.page && biens.length === 0) {
  //   return (
  //     <ProprietaireLayout>
  //       <div className={styles.loadingState}>
  //         <Loader2 className={styles.spinner} />
  //         <p>Chargement des biens...</p>
  //       </div>
  //     </ProprietaireLayout>
  //   );
  // }

  return (
    <ProprietaireLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>
                <Building className={styles.titleIcon} />Biens Immobiliers
              </h1>
              <p className={styles.subtitle}>Gérer vos biens immobiliers</p>
            </div>
            <div>
              <MyButton
                text="Ajouter un bien"
                onClick={() => setIsModalOpen(true)}
                icon={<Plus size={16} />}
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
              <Building size={16} />
              {success}
            </div>
          )}

          {/* Statistiques */}
          <div className={styles.statsGrid}>
            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>
                  <span><Building size={16} /> Total Biens</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.statsValue}>{stats.total}</div>
              </CardContent>
            </Card>

            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>
                  <span><Building size={16} /> Biens Occupés</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${styles.statsValue} ${styles.occupiedStats}`}>
                  {stats.occupied}
                </div>
              </CardContent>
            </Card>

            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>
                  <span><Building size={16} /> Biens Disponibles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${styles.statsValue} ${styles.availableStats}`}>
                  {stats.available}
                </div>
              </CardContent>
            </Card>

            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>
                  <span><Building size={16} /> En Entretien</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${styles.statsValue} ${styles.maintenanceStats}`}>
                  {stats.maintenance}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Section Filtres */}
          <div className={styles.filtersSection}>
            <div className={styles.filtersHeader}>
              <h3 className={styles.filtersTitle}>
                <Filter size={16} />Filtres
              </h3>
              <button onClick={clearFilters} className={styles.clearFiltersButton}><X size={14} />Réinitialiser</button>
            </div>

            <div className={styles.filtersGrid}>
              {/* Barre de recherche */}
              <div className={styles.searchContainer}>
                <Search size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Rechercher par nom, adresse ou ville..." value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} className={styles.searchInput} />
                {filters.search && (
                  <button onClick={() => handleFilterChange("search", "")} className={styles.clearSearchButton}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filtre par statut */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Statut</label>
                <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} className={styles.filterSelect}>
                  <option value="all">Tous les statuts</option>
                  <option value="disponible">Disponible</option>
                  <option value="loue">Occupé</option>
                  <option value="entretien">En entretien</option>
                </select>
              </div>

              {/* Filtre par type */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Type de bien</label>
                <select value={filters.type} onChange={(e) => handleFilterChange("type", e.target.value)} className={styles.filterSelect}>
                  <option value="all">Tous les types</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="bureau">Bureau</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                  <option value="local_commercial">Local Commercial</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>

              {/* Statistiques des filtres */}
              <div className={styles.filterStats}>
                <Badge variant="outline" className={styles.filterBadge}>
                  {filteredBiens.length} résultat{filteredBiens.length !== 1 ? 's' : ''}
                </Badge>
                {filters.status !== "all" && (
                  <Badge variant="secondary" className={styles.filterBadge}>
                    {formatStatus(filters.status)}
                  </Badge>
                )}
                {filters.type !== "all" && (
                  <Badge variant="secondary" className={styles.filterBadge}>
                    {filters.type === "appartement" ? "Appartement" :
                      filters.type === "maison" ? "Maison" :
                        filters.type === "bureau" ? "Bureau" :
                          filters.type === "studio" ? "Studio" :
                            filters.type === "villa" ? "Villa" :
                              filters.type === "local_commercial" ? "Local Commercial" : "Terrain"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Liste des biens */}
          <div className={styles.usersList}>
            <div className={styles.usersListHeader}>
              <h2 className={styles.usersListTitle}>
                Liste des biens ({filteredBiens.length}/{biens.length})
              </h2>
            </div>

            {filteredBiens.length === 0 ? (
              <div className={styles.emptyState}>
                <Building size={48} className={styles.emptyIcon} />
                <h3>Aucun bien ne correspond aux filtres</h3>
                <p className={styles.emptySubtext}>
                  {filters.status !== "all" || filters.type !== "all" || filters.search
                    ? "Modifiez vos critères de recherche ou réinitialisez les filtres"
                    : "Commencez par ajouter votre premier bien immobilier"}
                </p>
                {(filters.status !== "all" || filters.type !== "all" || filters.search) && (
                  <button onClick={clearFilters} className={styles.resetFiltersButton}>
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.usersGrid}>
                {filteredBiens.map((bien) => (
                  <CardBiens key={bien.bien_id} bienId={bien.bien_id} nom={bien.nom} adresse={bien.adresse} ville={bien.ville} avance={bien.avance} prix={bien.prix} type={bien.type} superficie={bien.superficie} description={bien.description} status={formatStatus(bien.statut)} statusVariant={getStatusVariant(bien.statut)} onEdit={() => openEditModal(bien)} onDelete={() => handleDeleteBien(bien.bien_id)} disableDelete={loading.delete} isDeleting={loading.delete} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Ajouter bien */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <Card className={styles.modalCard}>
                <CardHeader className={styles.modalHeader}>
                  <div className={styles.modalTitleSection}>
                    <CardTitle className={styles.modalTitle}>
                      <Plus size={20} />Ajouter un bien immobilier
                    </CardTitle>
                    <button onClick={closeModal} className={styles.closeButton} disabled={loading.submit}>
                      <X size={20} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className={styles.formAll}>
                    <div className={styles.formGroup}>
                      <div className={styles.form}>
                        <label htmlFor="nom" className={styles.label}>Nom du bien *</label>
                        <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} className={styles.input} placeholder="Ex: Appartement T1 centre-ville" required disabled={loading.submit} />
                      </div>
                      <div className={styles.form}>
                        <label htmlFor="adresse" className={styles.label}>Adresse *</label>
                        <input type="text" id="adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} className={styles.input} placeholder="Ex: 123 Rue de la Paix" required disabled={loading.submit} />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.form}>
                        <label htmlFor="ville" className={styles.label}>Ville *</label>
                        <input type="text" id="ville" name="ville" value={formData.ville} onChange={handleInputChange} className={styles.input} placeholder="Ex: Lomé" required disabled={loading.submit} />
                      </div>
                      <div className={styles.form}>
                        <label htmlFor="type" className={styles.label}>Type de bien *</label>
                        <select id="type" name="type" value={formData.type} onChange={handleInputChange} className={styles.input} required disabled={loading.submit}>
                          <option value="">Sélectionner un type</option>
                          <option value="appartement">Appartement</option>
                          <option value="maison">Maison</option>
                          <option value="bureau">Bureau</option>
                          <option value="studio">Studio</option>
                          <option value="villa">Villa</option>
                          <option value="local_commercial">Local Commercial</option>
                          <option value="terrain">Terrain</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.form}>
                        <label htmlFor="superficie" className={styles.label}>Superficie (m²) *</label>
                        <input type="number" id="superficie" name="superficie" value={formData.superficie} onChange={handleInputChange}
                          className={styles.input}
                          placeholder="Ex: 50"
                          required
                          disabled={loading.submit}
                          min="1"
                        />
                      </div>
                      <div className={styles.form}>
                        <label htmlFor="avance" className={styles.label}>Caution (FCFA) *</label>
                        <input type="number" id="avance" name="avance" value={formData.avance} onChange={handleInputChange} className={styles.input} placeholder="Ex: 100000" required disabled={loading.submit} min="0" />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.form}>
                        <label htmlFor="prix" className={styles.label}>Loyer Mensuel (FCFA) *</label>
                        <input type="number" id="prix" name="prix" value={formData.prix} onChange={handleInputChange} className={styles.input} placeholder="Ex: 50000" required disabled={loading.submit} min="0" />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.form}>
                        <label htmlFor="description" className={styles.label}>Description *</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea} placeholder="Description détaillée du bien..." maxLength={500} required disabled={loading.submit} rows="3"
                        ></textarea>
                        <div className={styles.charCount}>
                          {formData.description.length}/500 caractères
                        </div>
                      </div>
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
                        disabled={loading.submit}
                      >
                        {loading.submit ? (
                          <>
                            <Loader2 className={styles.buttonSpinner} />
                            Création en cours...
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Créer le bien
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

        {/* Modal Modifier bien */}
        {isEditModalOpen && selectedBien && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <Card className={styles.modalCard}>
                <CardHeader className={styles.modalHeader}>
                  <div className={styles.modalTitleSection}>
                    <CardTitle className={styles.modalTitle}>
                      <Edit size={20} />
                      Modifier le bien
                    </CardTitle>
                    <button
                      onClick={closeEditModal}
                      className={styles.closeButton}
                      disabled={loading.submit}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditSubmit} className={styles.formAll}>
                      <div className={styles.formGroup}>
                        <div className={styles.form}>
                          <label htmlFor="nom" className={styles.label}>Nom du bien *</label>
                          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} className={styles.input} placeholder="Ex: Appartement T1 centre-ville" required disabled={loading.submit} />
                        </div>
                        <div className={styles.form}>
                          <label htmlFor="adresse" className={styles.label}>Adresse *</label>
                          <input type="text" id="adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} className={styles.input} placeholder="Ex: 123 Rue de la Paix" required disabled={loading.submit} />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <div className={styles.form}>
                          <label htmlFor="ville" className={styles.label}>Ville *</label>
                          <input type="text" id="ville" name="ville" value={formData.ville} onChange={handleInputChange} className={styles.input} placeholder="Ex: Lomé" required disabled={loading.submit} />
                        </div>
                        <div className={styles.form}>
                          <label htmlFor="type" className={styles.label}>Type de bien *</label>
                          <select id="type" name="type" value={formData.type} onChange={handleInputChange} className={styles.input} required disabled={loading.submit}>
                            <option value="">Sélectionner un type</option>
                            <option value="appartement">Appartement</option>
                            <option value="maison">Maison</option>
                            <option value="bureau">Bureau</option>
                            <option value="studio">Studio</option>
                            <option value="villa">Villa</option>
                            <option value="local_commercial">Local Commercial</option>
                            <option value="terrain">Terrain</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <div className={styles.form}>
                          <label htmlFor="superficie" className={styles.label}>Superficie (m²) *</label>
                          <input type="number" id="superficie" name="superficie" value={formData.superficie} onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Ex: 50"
                            required
                            disabled={loading.submit}
                            min="1"
                          />
                        </div>
                        <div className={styles.form}>
                          <label htmlFor="avance" className={styles.label}>Caution (FCFA) *</label>
                          <input type="number" id="avance" name="avance" value={formData.avance} onChange={handleInputChange} className={styles.input} placeholder="Ex: 100000" required disabled={loading.submit} min="0" />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <div className={styles.form}>
                          <label htmlFor="prix" className={styles.label}>Loyer Mensuel (FCFA) *</label>
                          <input type="number" id="prix" name="prix" value={formData.prix} onChange={handleInputChange} className={styles.input} placeholder="Ex: 50000" required disabled={loading.submit} min="0" />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <div className={styles.form}>
                          <label htmlFor="description" className={styles.label}>Description *</label>
                          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea} placeholder="Description détaillée du bien..." maxLength={500} required disabled={loading.submit} rows="3"
                          ></textarea>
                          <div className={styles.charCount}>
                            {formData.description.length}/500 caractères
                          </div>
                        </div>
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
                          disabled={loading.submit}
                        >
                          {loading.submit ? (
                            <>
                              <Loader2 className={styles.buttonSpinner} />
                              Création en cours...
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              Créer le bien
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