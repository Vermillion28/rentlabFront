import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Building, Calendar, FileText, Plus, Download, Eye, Edit, Trash2, X, User, Home, CalendarDays, Lock, Users, Search, Filter, ChevronDown, ChevronUp, SortAsc, SortDesc, XCircle, CheckCircle, AlertCircle, Clock, RefreshCw, Printer
} from "lucide-react";
import styles from "@/styles/contrat.module.css";
import ProprietaireLayout from "@/layouts/ProprietaireLayout";
import MyButton from "@/components/myButton";
import { CardContrat } from "@/components/Mycard";
import axios from "axios";
import PDFService from '@/utils/pdfServices';

export default function Contrats() {
  // États
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contrats, setContrats] = useState([]);
  const [locataires, setLocataires] = useState([]);
  const [biens, setBiens] = useState([]);
  const [selectedBien, setSelectedBien] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = useState(true)


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

  const [formData, setFormData] = useState({
    bien_id: "",
    locataire_id: "",
    date_debut: "",
    date_fin: "",
    loyer_mensuel: "",
    notes: ""
  });

  const [periode, setPeriode] = useState({
    nbMois: 1,
    dateDebut: "",
    dateFin: ""
  });

  // Options de statut pour les filtres
  const statusOptions = [
    { value: "tous", label: "Tous les statuts", color: "gray" },
    { value: "actif", label: "Actif", color: "green" },
    { value: "en_cours", label: "En cours", color: "blue" },
    { value: "termine", label: "Terminé", color: "gray" },
    { value: "resilie", label: "Résilié", color: "red" },
    { value: "suspendu", label: "Suspendu", color: "yellow" }
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

  // Charger les locataires disponibles
  // const fetchLocataires = useCallback(async () => {
  //   try {
  //     const token = getToken();
  //     const response = await fetch("http://localhost:3001/api/users/mes-locataires", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       const locatairesList = data.locataires || data.users || [];
  //       setLocataires(locatairesList);
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors du chargement des locataires:", error);
  //   }
  // }, [getToken]);

  // Charger les biens du propriétaire
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

  // Gestion du changement de statut
  const handleStatusChange = async (contratId, newStatus) => {
  //   try {
  //     const token = getToken();
  //     const response = await axios.put(`http://localhost:3001/api/contrats/${contratId}`, {
  //       statut: newStatus
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     // Mettre à jour l'état local
  //     setContrats(prev => prev.map(c =>
  //       c.id === contratId ? { ...c, statut: newStatus } : c
  //     ));

  //     alert('Statut mis à jour avec succès');
  //   } catch (error) {
  //     console.error('Erreur lors du changement de statut:', error);
  //     alert('Erreur lors du changement de statut');
  //   }
   };

  // Gestion du téléchargement
  const handleDownload = async (contratId) => {
    // try {
    //   const token = getToken();
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
    //   }
    // } catch (error) {
    //   console.error('Erreur lors du téléchargement:', error);
    // }
  };

  // Gestion de l'édition
  const handleEdit = (contratId) => {
    // window.location.href = `/proprietaire/contrats/${contratId}/edit`;
  };

  // Gestion de l'archivage
  const handleArchive = async (contratId) => {
    if (confirm("Êtes-vous sûr de vouloir archiver ce contrat ?")) {
      // try {
      //   const token = getToken();
      //   const response = await fetch(`http://localhost:3001/api/contrats/${contratId}/terminate`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: JSON.stringify({
      //       date_resiliation: new Date().toISOString().split('T')[0]
      //     }),
      //   });

      //   if (response.ok) {
      //     fetchContrats();
      //     alert('Contrat archivé avec succès');
      //   }
      // } catch (error) {
      //   console.error('Erreur lors de l\'archivage:', error);
      //   alert('Erreur lors de l\'archivage');
      // }
    }
  };

  // Gestion du changement de bien
  const handleBienChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue) {
      const bien = biens.find(b => b.bien_id?.toString() === selectedValue || b.id?.toString() === selectedValue);

      if (bien) {
        setSelectedBien(bien);

        const prixMensuel = parseFloat(bien.prix) || 0;

        setFormData(prev => ({
          ...prev,
          bien_id: selectedValue,
          loyer_mensuel: prixMensuel.toString()
        }));

        if (periode.dateDebut) {
          calculerDates(periode.dateDebut, periode.nbMois);
        }
      }
    } else {
      setSelectedBien(null);
      setFormData(prev => ({
        ...prev,
        bien_id: "",
        loyer_mensuel: ""
      }));
    }
  };

  // Gestion du changement de date de début
  const handleDateDebutChange = (e) => {
    const dateDebut = e.target.value;
    setPeriode(prev => ({ ...prev, dateDebut }));
    calculerDates(dateDebut, periode.nbMois);
  };

  // Gestion du changement de nombre de mois
  const handleNbMoisChange = (e) => {
    const nbMois = parseInt(e.target.value);
    setPeriode(prev => ({ ...prev, nbMois }));

    if (periode.dateDebut) {
      calculerDates(periode.dateDebut, nbMois);
    }

    if (selectedBien) {
      const prixMensuel = parseFloat(selectedBien.prix) || 0;
      setFormData(prev => ({
        ...prev,
        loyer_mensuel: prixMensuel.toString()
      }));
    }
  };

  // Calculer les dates
  const calculerDates = (dateDebutStr, nbMois) => {
    if (!dateDebutStr) return;

    const dateDebut = new Date(dateDebutStr);
    const dateFin = new Date(dateDebut);
    dateFin.setMonth(dateFin.getMonth() + nbMois);
    dateFin.setDate(dateFin.getDate() - 1);

    const dateFinStr = dateFin.toISOString().split('T')[0];

    setPeriode(prev => ({ ...prev, dateFin: dateFinStr }));
    setFormData(prev => ({
      ...prev,
      date_debut: dateDebutStr,
      date_fin: dateFinStr
    }));
  };

  // Gestion des autres champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'loyer_mensuel' && selectedBien) {
      const prixMensuel = parseFloat(selectedBien.prix) || 0;
      alert(`Le loyer est fixé à ${prixMensuel.toLocaleString('fr-FR')} FCFA/mois pour ce bien.`);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Options pour le nombre de mois
  const optionsMois = [
    { value: 1, label: "1 mois" },
    { value: 2, label: "2 mois" },
    { value: 3, label: "3 mois" },
    { value: 6, label: "6 mois" },
    { value: 12, label: "12 mois" }
  ];

  // Calculer le loyer total
  const calculerLoyerTotal = () => {
    if (!selectedBien || periode.nbMois < 1) return 0;
    const prixMensuel = parseFloat(selectedBien.prix) || 0;
    return prixMensuel * periode.nbMois;
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

  // Créer un contrat
  const handleCreateContrat = async (e) => {
    e.preventDefault();

    // Validation
    const errors = [];

    if (!formData.bien_id) errors.push("Veuillez sélectionner un bien");
    if (!formData.locataire_id) errors.push("Veuillez sélectionner un locataire");
    if (!formData.date_debut) errors.push("Veuillez sélectionner une date de début");
    if (!formData.date_fin) errors.push("Veuillez sélectionner une date de fin");

    const loyer = parseFloat(formData.loyer_mensuel);
    if (!loyer || loyer <= 0) errors.push("Veuillez vérifier le montant du loyer");
    if (periode.nbMois < 1) errors.push("La durée minimum est de 1 mois");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // try {
    //   const token = getToken();
    //   const payload = {
    //     bien_id: parseInt(formData.bien_id),
    //     locataire_id: parseInt(formData.locataire_id),
    //     date_debut: formatDateForAPI(formData.date_debut),
    //     date_fin: formatDateForAPI(formData.date_fin),
    //     loyer_mensuel: loyer,
    //     charges: 0,
    //     depot_garantie: 0,
    //     notes: formData.notes || null
    //   };

    //   console.log("Payload envoyé:", payload);

    //   const response = await fetch("http://localhost:3001/api/contrats", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   const data = await response.json();
    //   console.log("Réponse API:", data);

    //   if (response.ok) {
    //     alert("Contrat créé avec succès !");
    //     setIsModalOpen(false);
    //     resetForm();
    //     fetchContrats();
    //   } else {
    //     alert(`${data.message || "Erreur lors de la création du contrat"}`);
    //   }
    // } catch (error) {
    //   console.error("Erreur:", error);
    //   alert("Erreur serveur");
    // }
  };

  // Formater la date pour l'API
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formater la date pour l'affichage
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      bien_id: "",
      locataire_id: "",
      date_debut: "",
      date_fin: "",
      loyer_mensuel: "",
      notes: ""
    });
    setSelectedBien(null);
    setPeriode({
      nbMois: 1,
      dateDebut: "",
      dateFin: ""
    });
  };

  // Fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Calculer les statistiques
  const activeContrats = contrats.filter(c => c.statut === 'actif').length;
  const terminatedContrats = contrats.filter(c => c.statut === 'termine').length;
  const newThisMonth = contrats.filter(c => {
    const created = new Date(c.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const loyerTotal = calculerLoyerTotal();
  const prixMensuel = selectedBien ? parseFloat(selectedBien.prix) || 0 : 0;

  const handleDownloadPDF = async (contratId) => {
    try {
      const token = getToken();
      const pdfService = new PDFService(token);

      // Afficher un indicateur de chargement
      setIsLoadingDownload(contratId);

      await pdfService.downloadContratPDF(contratId);

      // Succès
      alert('Contrat téléchargé avec succès !');

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du téléchargement du contrat');
    } finally {
      setIsLoadingDownload(null);
    }
  };
  const handleExportPDF = () => {
    alert("Fonctionnalité d'export PDF à implémenter");
    // Implémentez ici la logique d'export PDF
  };

  return (
    <ProprietaireLayout>
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
            <div className={styles.headerActions}>
              <MyButton
                text="Créer un nouveau contrat"
                onClick={() => setIsModalOpen(true)}
                icon={<Plus size={18} />}
                disabled={biens.length === 0 || locataires.length === 0}
              />
              {(biens.length === 0 || locataires.length === 0) && (
                <div className={styles.requirementsInfo}>
                  {biens.length === 0 && "Ajoutez d'abord des biens. "}
                  {locataires.length === 0 && "Ajoutez d'abord des locataires."}
                </div>
              )}
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
                <div className={`${styles.statsValue} ${styles.activeStats}`}>
                  {activeContrats}
                </div>
                <p className={styles.statsSubtitle}>En cours de location</p>
              </CardContent>
            </Card>

            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>Contrats terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${styles.statsValue} ${styles.adminStats}`}>
                  {terminatedContrats}
                </div>
                <p className={styles.statsSubtitle}>Historique</p>
              </CardContent>
            </Card>

            <Card className={styles.statsCard}>
              <CardHeader className={styles.statsCardHeader}>
                <CardTitle className={styles.statsCardTitle}>Nouveaux ce mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${styles.statsValue} ${styles.newStats}`}>
                  {newThisMonth}
                </div>
                <p className={styles.statsSubtitle}>Ce mois-ci</p>
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
                        {locataires.length === 0 ? (
                          <option disabled>Aucun locataire disponible</option>
                        ) : (
                          locataires.map(locataire => (
                            <option key={locataire.id} value={locataire.id}>
                              {locataire.nom_user} - {locataire.email}
                              {locataire.contrats_actifs_count > 0 &&
                                ` (${locataire.contrats_actifs_count} contrat${locataire.contrats_actifs_count > 1 ? 's' : ''} actif${locataire.contrats_actifs_count > 1 ? 's' : ''})`
                              }
                            </option>
                          ))
                        )}
                      </select>
                      {locataires.length === 0 && (
                        <p className={styles.helpText}>
                          Aucun locataire inscrit pour le moment
                        </p>
                      )}
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
                    : "Commencez par créer votre premier contrat"
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
                ) : (
                  <MyButton
                    text="Créer votre premier contrat"
                    onClick={() => setIsModalOpen(true)}
                    disabled={biens.length === 0 || locataires.length === 0}
                  />
                )}
              </div>
            ) : (
              <div className={styles.usersGrid}>
                {sortedContrats.map((contrat) => (
                  <CardContrat
                    key={contrat.id}
                    contrat={contrat}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                    onDownload={handleDownloadPDF}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <Card className={styles.modalCard}>
                <CardHeader className={styles.modalHeader}>
                  <div className={styles.modalTitleSection}>
                    <CardTitle className={styles.modalTitle}>
                      Créer un nouveau contrat de location
                    </CardTitle>
                    <button onClick={closeModal} className={styles.closeButton}>
                      <X size={20} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateContrat} className={styles.form}>
                    {/* Sélection du bien */}
                    <div className={styles.formGroup}>
                      <div className={styles.fullWidth}>
                        <label htmlFor="bien_id" className={styles.label}>
                          <Home size={16} style={{ marginRight: '0.5rem' }} />
                          Bien *
                        </label>
                        <select
                          id="bien_id"
                          name="bien_id"
                          value={formData.bien_id}
                          onChange={handleBienChange}
                          className={styles.input}
                          required
                        >
                          <option value="">Sélectionner un bien</option>
                          {biens.map(bien => {
                            const prix = parseFloat(bien.prix) || 0;
                            const bienId = bien.bien_id || bien.id;
                            return (
                              <option
                                key={bienId}
                                value={bienId}
                              >
                                {bien.nom} - {bien.adresse}
                                {prix > 0 && ` (${prix.toLocaleString('fr-FR')} FCFA/mois)`}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Sélection du locataire */}
                    <div className={styles.formGroup}>
                      <div className={styles.fullWidth}>
                        <label htmlFor="locataire_id" className={styles.label}>
                          <User size={16} style={{ marginRight: '0.5rem' }} />
                          Locataire *
                        </label>
                        <select
                          id="locataire_id"
                          name="locataire_id"
                          value={formData.locataire_id}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                        >
                          <option value="">Sélectionner un locataire</option>
                          {locataires.map(locataire => (
                            <option key={locataire.id} value={locataire.id}>
                              {locataire.nom_user} - {locataire.email}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Période */}
                    <div className={styles.formGroup}>
                      <div className={styles.fullWidth}>
                        <label className={styles.label}>
                          <CalendarDays size={16} style={{ marginRight: '0.5rem' }} />
                          Période de location *
                        </label>

                        {/* Date de début */}
                        <div className={styles.formGroup}>
                          <div>
                            <label htmlFor="date_debut" className={styles.subLabel}>
                              Date de début
                            </label>
                            <input
                              type="date"
                              id="date_debut"
                              name="date_debut"
                              value={periode.dateDebut}
                              onChange={handleDateDebutChange}
                              className={styles.input}
                              required
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>

                          <div>
                            <label htmlFor="nbMois" className={styles.subLabel}>
                              Durée (mois)
                            </label>
                            <select
                              id="nbMois"
                              name="nbMois"
                              value={periode.nbMois}
                              onChange={handleNbMoisChange}
                              className={styles.input}
                              required
                            >
                              {optionsMois.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Affichage de la période calculée */}
                        {periode.dateDebut && periode.dateFin && (
                          <div className={styles.periodDisplay}>
                            <div className={styles.periodDates}>
                              <span className={styles.periodLabel}>Du</span>
                              <strong>{formatDateForDisplay(periode.dateDebut)}</strong>
                              <span className={styles.periodLabel}>au</span>
                              <strong>{formatDateForDisplay(periode.dateFin)}</strong>
                            </div>
                            <div className={styles.periodDuration}>
                              Durée : <Badge variant="outline">{periode.nbMois} mois</Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Loyer */}
                    <div className={styles.formGroup}>
                      <div className={styles.fullWidth}>
                        <div className={styles.loyerHeader}>
                          <label className={styles.label}>
                            Loyer mensuel (FCFA) *
                          </label>
                          {selectedBien && (
                            <div className={styles.loyerInfo}>
                              <span className={styles.loyerMensuel}>
                                {prixMensuel.toLocaleString('fr-FR')} FCFA/mois
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={styles.loyerDisplay}>
                          <input
                            type="number"
                            id="loyer_mensuel"
                            name="loyer_mensuel"
                            value={formData.loyer_mensuel}
                            onChange={handleInputChange}
                            className={styles.loyerInput}
                            placeholder={selectedBien ? "Sélectionnez un bien" : "Sélectionnez un bien"}
                            step={1000}
                            required
                            min="0"
                            readOnly={!!selectedBien}
                            style={{
                              cursor: selectedBien ? 'not-allowed' : 'text',
                              backgroundColor: selectedBien ? '#f8f9fa' : 'white'
                            }}
                          />
                          <div className={styles.loyerLockIcon}>
                            <Lock size={16} />
                          </div>
                        </div>

                        {!selectedBien && (
                          <div className={styles.infoMessage}>
                            Sélectionnez un bien pour définir le loyer
                          </div>
                        )}

                        {selectedBien && (
                          <div className={styles.successMessage}>
                            Loyer fixé à {prixMensuel.toLocaleString('fr-FR')} FCFA par mois
                            {periode.nbMois > 1 && (
                              <div className={styles.loyerBreakdown}>
                                <span>Total pour {periode.nbMois} mois : </span>
                                <strong>{loyerTotal.toLocaleString('fr-FR')} FCFA</strong>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className={styles.formGroup}>
                      <div className={styles.fullWidth}>
                        <label htmlFor="notes" className={styles.label}>
                          Notes (optionnel)
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          className={styles.textarea}
                          placeholder="Notes additionnelles..."
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className={styles.formActions}>
                      <button type="button" onClick={closeModal} className={styles.cancelButton}>
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={!formData.bien_id || !formData.locataire_id || !formData.date_debut || !formData.loyer_mensuel}
                      >
                        Créer le contrat ({periode.nbMois} mois)
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