import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  SortAsc, 
  SortDesc, 
  X, 
  RefreshCw, 
  Printer 
} from "lucide-react";
import styles from "@/styles/contrat.module.css";
import LocataireLayout from "@/layouts/LocataireLayout";
import { CardContrat } from "@/components/Mycard";

export default function Contrats() {
  // États
  const [isLoading, setIsLoading] = useState(true);
  const [contrats, setContrats] = useState([]);
  const [locataires, setLocataires] = useState([]);
  const [biens, setBiens] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = useState(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [selectedLocataire, setSelectedLocataire] = useState("tous");
  const [selectedBienFilter, setSelectedBienFilter] = useState("tous");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Options de statut pour les filtres
  const statusOptions = [
    { value: "tous", label: "Tous les statuts", color: "gray" },
    { value: "actif", label: "Actif", color: "green" },
    { value: "termine", label: "Terminé", color: "gray" },
    { value: "resilie", label: "Résilié", color: "red" }
  ];

  // Options de tri
  const sortOptions = [
    { value: "created_at", label: "Date de création" },
    { value: "date_debut", label: "Date de début" },
    { value: "date_fin", label: "Date de fin" },
    { value: "loyer_mensuel", label: "Loyer mensuel" },
    { value: "bien_nom", label: "Nom du bien" }
  ];

  // Récupérer le token
  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }, []);

  // Charger les contrats
  // const fetchContrats = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     const token = getToken();
  //     const response = await fetch("http://localhost:3001/api/contrats/mes-contrats", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setContrats(data.contrats || []);
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors du chargement des contrats:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [getToken]);

  // Charger les locataires
  // const fetchLocataires = useCallback(async () => {
  //   try {
  //     const token = getToken();
  //     console.log("🔍 Fetching locataires...");
      
  //     const response = await fetch("http://localhost:3001/api/contrats/locataires-disponibles", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log("📊 Response status:", response.status);
      
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("✅ Locataires reçus:", data);
  //       const locatairesList = data.locataires || [];
  //       console.log(`📋 ${locatairesList.length} locataire(s) trouvé(s)`);
  //       setLocataires(locatairesList);
  //     } else {
  //       console.error("❌ Erreur response:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("❌ Erreur lors du chargement des locataires:", error);
  //   }
  // }, [getToken]);

  // Charger les biens
  // const fetchBiens = useCallback(async () => {
  //   try {
  //     const token = getToken();
  //     const response = await fetch("http://localhost:3001/api/biens/mes-biens", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       const biensList = data.biens || [];
  //       setBiens(biensList);
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors du chargement des biens:", error);
  //   }
  // }, [getToken]);

  // useEffect(() => {
  //   fetchContrats();
  //   fetchLocataires();
  //   fetchBiens();
  // }, [fetchContrats, fetchLocataires, fetchBiens]);

  // Gestion de l'archivage
  const handleArchive = async (contratId) => {
    if (confirm("Êtes-vous sûr de vouloir archiver ce contrat ?")) {
    //   try {
    //     const token = getToken();
    //     const response = await fetch(`http://localhost:3001/api/contrats/${contratId}/terminate`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({
    //         date_resiliation: new Date().toISOString().split('T')[0]
    //       }),
    //     });

    //     if (response.ok) {
    //       fetchContrats();
    //       alert('Contrat archivé avec succès');
    //     }
    //   } catch (error) {
    //     console.error('Erreur lors de l\'archivage:', error);
    //     alert('Erreur lors de l\'archivage');
    //   }
    // }
  };

  // Gestion du téléchargement PDF
  const handleDownloadPDF = async (contratId) => {
    // try {
    //   const token = getToken();
    //   setIsLoadingDownload(contratId);
      
    //   const response = await fetch(`http://localhost:3001/api/contrats/${contratId}/download`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   if (response.ok) {
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `contrat-${contratId}.pdf`;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //     alert('Contrat téléchargé avec succès !');
    //   } else {
    //     const errorData = await response.json();
    //     alert(`Erreur: ${errorData.message || 'Impossible de télécharger le contrat'}`);
    //   }
    // } catch (error) {
    //   console.error('Erreur:', error);
    //   alert('Erreur lors du téléchargement du contrat');
    // } finally {
    //   setIsLoadingDownload(null);
    // }
  };

  // FILTRAGE ET RECHERCHE
  const filteredContrats = contrats.filter(contrat => {
    // Recherche par texte
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (contrat.bien_nom && contrat.bien_nom.toLowerCase().includes(searchLower)) ||
        (contrat.locataire_nom && contrat.locataire_nom.toLowerCase().includes(searchLower)) ||
        (contrat.bien_adresse && contrat.bien_adresse.toLowerCase().includes(searchLower)) ||
        (contrat.notes && contrat.notes.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Filtre par statut
    if (selectedStatus !== "tous" && contrat.statut !== selectedStatus) {
      return false;
    }

    // Filtre par locataire
    if (selectedLocataire !== "tous" && contrat.locataire_id?.toString() !== selectedLocataire) {
      return false;
    }

    // Filtre par bien
    if (selectedBienFilter !== "tous" && contrat.bien_id?.toString() !== selectedBienFilter) {
      return false;
    }

    // Filtre par date
    if (dateRange.start && dateRange.end) {
      const contratDate = new Date(contrat.date_debut);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      
      if (contratDate < startDate || contratDate > endDate) {
        return false;
      }
    }

    return true;
  });

  // Tri des contrats
  const sortedContrats = [...filteredContrats].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "loyer_mensuel":
        aValue = parseFloat(a.loyer_mensuel) || 0;
        bValue = parseFloat(b.loyer_mensuel) || 0;
        break;
      case "date_debut":
      case "date_fin":
      case "created_at":
        aValue = new Date(a[sortBy]);
        bValue = new Date(b[sortBy]);
        break;
      case "bien_nom":
        aValue = a.bien_nom?.toLowerCase() || "";
        bValue = b.bien_nom?.toLowerCase() || "";
        break;
      default:
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("tous");
    setSelectedLocataire("tous");
    setSelectedBienFilter("tous");
    setDateRange({ start: "", end: "" });
  };

  const handleExportPDF = () => {
    alert("Fonctionnalité d'export PDF à implémenter");
  };

  return (
    <LocataireLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>
                <FileText className={styles.titleIcon} /> Contrats de location
              </h1>
              <p className={styles.subtitle}>Gérer les contrats de location</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className={styles.statsGrid}>
            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>Contrats totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.statsValue}>{contrats.length}</div>
                <p className={styles.statsSubtitle}>Tous les contrats</p>
              </CardContent>
            </Card>

            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>Contrats actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.statsValue}>
                  {contrats.filter(c => c.statut === 'actif').length}
                </div>
                <p className={styles.statsSubtitle}>En cours</p>
              </CardContent>
            </Card>

            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>Contrats terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.statsValue}>
                  {contrats.filter(c => c.statut === 'termine').length}
                </div>
                <p className={styles.statsSubtitle}>Historique</p>
              </CardContent>
            </Card>
          </div>

          {/* SECTION FILTRES ET RECHERCHE */}
          <Card className={styles.filtersCard}>
            <CardContent className={styles.filtersContent}>
              <div className={styles.filtersHeader}>
                <div className={styles.filtersTitleSection}>
                  <Filter size={20} />
                  <h3 className={styles.filtersTitle}>Filtres et recherche</h3>
                  <button 
                    className={styles.toggleFiltersButton}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
                  </button>
                </div>
                
                <div className={styles.quickActions}>
                  <button 
                    className={styles.resetButton}
                    onClick={resetFilters}
                    disabled={!searchTerm && selectedStatus === "tous" && selectedLocataire === "tous" && selectedBienFilter === "tous" && !dateRange.start && !dateRange.end}
                  >
                    <RefreshCw size={16} />
                    Réinitialiser
                  </button>
                  <button 
                    className={styles.exportButton}
                    onClick={handleExportPDF}
                    disabled={filteredContrats.length === 0}
                  >
                    <Printer size={16} />
                    Exporter
                  </button>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className={styles.searchBar}>
                <div className={styles.searchInputContainer}>
                  <Search size={20} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom du bien, locataire, adresse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                  {searchTerm && (
                    <button 
                      className={styles.clearSearchButton}
                      onClick={() => setSearchTerm("")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className={styles.sortContainer}>
                  <label className={styles.sortLabel}>
                    <SortAsc size={16} />
                    Trier par:
                  </label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button 
                    className={styles.sortOrderButton}
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
                  </button>
                </div>
              </div>

              {/* Filtres avancés */}
              {showFilters && (
                <div className={styles.advancedFilters}>
                  <div className={styles.filtersGrid}>
                    {/* Filtre par statut */}
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Statut</label>
                      <div className={styles.statusFilterButtons}>
                        {statusOptions.map(status => (
                          <button
                            key={status.value}
                            className={`${styles.statusFilterButton} ${selectedStatus === status.value ? styles.statusFilterButtonActive : ''}`}
                            onClick={() => setSelectedStatus(status.value)}
                            style={selectedStatus === status.value ? {
                              backgroundColor: status.color === "green" ? "#dcfce7" : 
                                              status.color === "red" ? "#fee2e2" : 
                                              status.color === "blue" ? "#dbeafe" : 
                                              status.color === "yellow" ? "#fef3c7" : "#f3f4f6",
                              color: status.color === "green" ? "#166534" : 
                                     status.color === "red" ? "#991b1b" : 
                                     status.color === "blue" ? "#1e40af" : 
                                     status.color === "yellow" ? "#92400e" : "#4b5563",
                              borderColor: status.color === "green" ? "#86efac" : 
                                          status.color === "red" ? "#fca5a5" : 
                                          status.color === "blue" ? "#93c5fd" : 
                                          status.color === "yellow" ? "#fcd34d" : "#d1d5db"
                            } : {}}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filtre par locataire */}
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Locataire</label>
                      <select 
                        value={selectedLocataire}
                        onChange={(e) => setSelectedLocataire(e.target.value)}
                        className={styles.filterSelect}
                      >
                        <option value="tous">Tous les locataires</option>
                        {locataires.map(locataire => (
                          <option key={locataire.id} value={locataire.id}>
                            {locataire.nom_user} - {locataire.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtre par bien */}
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Bien</label>
                      <select 
                        value={selectedBienFilter}
                        onChange={(e) => setSelectedBienFilter(e.target.value)}
                        className={styles.filterSelect}
                      >
                        <option value="tous">Tous les biens</option>
                        {biens.map(bien => {
                          const bienId = bien.bien_id || bien.id;
                          return (
                            <option key={bienId} value={bienId}>
                              {bien.nom} - {bien.adresse}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Filtre par date */}
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Période</label>
                      <div className={styles.dateRange}>
                        <div>
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className={styles.dateInput}
                            placeholder="Date début"
                          />
                        </div>
                        <span className={styles.dateSeparator}>à</span>
                        <div>
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className={styles.dateInput}
                            placeholder="Date fin"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Résumé des filtres */}
              {(searchTerm || selectedStatus !== "tous" || selectedLocataire !== "tous" || selectedBienFilter !== "tous" || dateRange.start || dateRange.end) && (
                <div className={styles.filtersSummary}>
                  <div className={styles.filtersTags}>
                    {searchTerm && (
                      <Badge variant="secondary" className={styles.filterTag}>
                        Recherche: "{searchTerm}"
                        <button onClick={() => setSearchTerm("")} className={styles.removeFilterButton}>
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {selectedStatus !== "tous" && (
                      <Badge variant="secondary" className={styles.filterTag}>
                        Statut: {statusOptions.find(s => s.value === selectedStatus)?.label}
                        <button onClick={() => setSelectedStatus("tous")} className={styles.removeFilterButton}>
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {selectedLocataire !== "tous" && (
                      <Badge variant="secondary" className={styles.filterTag}>
                        Locataire: {locataires.find(l => l.id?.toString() === selectedLocataire)?.nom_user}
                        <button onClick={() => setSelectedLocataire("tous")} className={styles.removeFilterButton}>
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {selectedBienFilter !== "tous" && (
                      <Badge variant="secondary" className={styles.filterTag}>
                        Bien: {biens.find(b => (b.bien_id?.toString() === selectedBienFilter || b.id?.toString() === selectedBienFilter))?.nom}
                        <button onClick={() => setSelectedBienFilter("tous")} className={styles.removeFilterButton}>
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {(dateRange.start || dateRange.end) && (
                      <Badge variant="secondary" className={styles.filterTag}>
                        Période: {dateRange.start || "..."} à {dateRange.end || "..."}
                        <button onClick={() => setDateRange({ start: "", end: "" })} className={styles.removeFilterButton}>
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                  </div>
                  <div className={styles.resultsCount}>
                    {sortedContrats.length} contrat{sortedContrats.length > 1 ? 's' : ''} trouvé{sortedContrats.length > 1 ? 's' : ''}
                    {sortedContrats.length !== contrats.length && (
                      <span className={styles.totalCount}>
                        (sur {contrats.length} au total)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liste des contrats */}
          <div className={styles.usersList}>
            <div className={styles.usersListHeader}>
              <h1 className={styles.usersListTitle}>Liste des contrats</h1>
              <div className={styles.listActions}>
                <span className={styles.contratsCount}>
                  {sortedContrats.length} contrat{sortedContrats.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className={styles.loading}>
                <RefreshCw className={styles.loadingIcon} />
                <p>Chargement des contrats...</p>
              </div>
            ) : sortedContrats.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={48} className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>
                  {searchTerm || selectedStatus !== "tous" || selectedLocataire !== "tous" || selectedBienFilter !== "tous" || dateRange.start || dateRange.end
                    ? "Aucun contrat ne correspond à vos critères"
                    : "Aucun contrat trouvé"
                  }
                </h3>
                <p className={styles.emptyDescription}>
                  {searchTerm || selectedStatus !== "tous" || selectedLocataire !== "tous" || selectedBienFilter !== "tous" || dateRange.start || dateRange.end
                    ? "Essayez de modifier vos filtres ou votre recherche"
                    : "Attendez de recevoir un contrat de la part de votre propriétaire"
                  }
                </p>
                {(searchTerm || selectedStatus !== "tous" || selectedLocataire !== "tous" || selectedBienFilter !== "tous" || dateRange.start || dateRange.end) ? (
                  <button 
                    onClick={resetFilters}
                    className={styles.resetFiltersButton}
                  >
                    <RefreshCw size={16} />
                    Réinitialiser les filtres
                  </button>
                ) : ""}
              </div>
            ) : (
              <div className={styles.usersGrid}>
                {sortedContrats.map((contrat) => (
                  <CardContrat
                    key={contrat.id}
                    contrat={contrat}
                    onArchive={handleArchive}
                    onDownload={handleDownloadPDF}
                    isLoading={isLoadingDownload === contrat.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </LocataireLayout>
  );
}
}