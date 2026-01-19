import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from '@/styles/cardComponent.module.css'
import { User, Mail, Building2, Shield, SquarePen, Ellipsis, Eye, Trash2, UserCheck, UserX, Delete, MapPin, HandCoins, Download, Calendar, ChevronDown, Check, Clock, XCircle, CheckCircle, AlertCircle, Home, FileText, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge";

function DashboardCard({ title, value, Icon, color }) {
    return (
        <div className={styles.cardDashboard}>
            <div>
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
            <div>
                <Icon size={30} color={color} className={styles.icon} />
            </div>
        </div>
    )
}

function CardUsers({ 
    userName, 
    userEmail, 
    userStatus, 
    statusVariant, 
    onEdit, 
    onDelete, 
    disableDelete, 
    isDeleting, 
    additionalInfo, 
    userId, 
    userType, 
    originalStatus 
}) {
    // Fonction pour déterminer si c'est une invitation en attente
    const isPendingInvitation = () => {
        if (userType !== "invitation") return false;
        
        // Vérifier toutes les variantes possibles
        const pendingValues = [
            "en_attente", 
            "pending", 
            "En attente",
            "PENDING",
            "EN_ATTENTE"
        ];
        
        return pendingValues.includes(originalStatus) || 
               (typeof originalStatus === 'string' && 
                originalStatus.toLowerCase().includes('pending') ||
                originalStatus.toLowerCase().includes('en_attente'));
    };

    // Fonction pour déterminer si c'est un locataire actif
    const isActiveTenant = () => {
        if (userType !== "locataire") return false;
        
        const activeValues = ["actif", "active", "Actif", "ACTIF"];
        return activeValues.includes(originalStatus) || 
               (typeof originalStatus === 'string' && 
                originalStatus.toLowerCase().includes('actif') ||
                originalStatus.toLowerCase().includes('active'));
    };

    return (
        <div className={styles.userCard}>
            <div className={styles.userCardHeader}>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>
                        <User size={20} />
                        <h3>{userName}</h3>
                    </div>
                    <span className={`${styles.statusBadge} ${
                        userStatus === "Actif" ? styles.activeStatus : 
                        userStatus === "En attente" ? styles.occupiedStatus : ""
                    }`}>
                        {userStatus}
                    </span>
                </div>

                {additionalInfo && (
                    <div className={styles.additionalInfo}>
                        <Building size={14} />
                        <span>{additionalInfo}</span>
                    </div>
                )}
            </div>

            <div className={styles.userCardContent}>
                <div className={styles.userEmail}>
                    <Mail size={16} />
                    <span>{userEmail}</span>
                </div>
            </div>

            <div className={styles.userCardActions}>
                <button className={styles.editButton} onClick={onEdit} disabled={isDeleting}>
                    <SquarePen size={16} />
                    <span>Modifier</span>
                </button>

                {/* Afficher le bouton d'annulation pour les invitations en attente */}
                {isPendingInvitation() && (
                    <button 
                        className={styles.deleteButton} 
                        onClick={() => onDelete && onDelete(userId)} 
                        disabled={disableDelete || isDeleting}
                        title="Annuler cette invitation"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className={styles.buttonSpinner} />
                                <span>Annulation...</span>
                            </>
                        ) : (
                            <>
                                <X size={16} />
                                <span>Annuler</span>
                            </>
                        )}
                    </button>
                )}

                {/* Pour les locataires actifs, proposer une désactivation */}
                {userType === "invitation" && 
 (originalStatus === "en_attente" || originalStatus === "pending" || originalStatus === "En attente") && (
    <button className={styles.deleteButton} onClick={() => onDelete && onDelete(userId)} disabled={disableDelete || isDeleting}>
        {isDeleting ? (
            <>
                <Loader2 className={styles.buttonSpinner} />
                <span>Suppression...</span>
            </>
        ) : (
            <>
                <Delete size={16} />
                <span>Annuler</span>
            </>
        )}
    </button>
)}
            </div>
        </div>
    );
}

function CardBiens({ bienId, nom, adresse, avance, prix, type, superficie, description, status, onEdit, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    /* Fonctions de gestion du menu */
    function handleMenuClick() {
        setIsMenuOpen(!isMenuOpen);
    };
    function handleEdit() {
        setIsMenuOpen(false);
        onEdit();
    };

    function handleDelete() {
        setIsMenuOpen(false);
        onDelete();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {

            if (isMenuOpen && !event.target.closest('[class*="menuContainer"]')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);
    return (
        <div className={styles.cardNC}>
            <div className={styles.card_ncTop}>
                <div>
                    <div className={styles.h2}>
                        <h2>{nom}</h2>
                        <span className={styles.statusBadge + ' ' + (status === "Disponible" ? styles.activeStatus : status === "Occupé" ? styles.occupiedStatus : status === "En entretien" ? styles.entretienStatus : styles.inactiveStatus)}>
                            {status}
                        </span>
                    </div>
                    <p className={styles.description}>{description}</p>
                </div>
                <div className={styles.menuContainer}>
                    <button className={styles.menuButton} onClick={handleMenuClick} onMouseEnter={(e) => {
                        if (!isMenuOpen) e.target.style.backgroundColor = '#f5f5f5';
                    }} onMouseLeave={(e) => {
                        if (!isMenuOpen) e.target.style.backgroundColor = 'transparent';
                    }}>
                        <Ellipsis size={20} />
                    </button>

                    {isMenuOpen && (
                        <div className={styles.dropdownMenuNC}>
                            <button className={styles.menuItem} onClick={handleEdit} onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                <SquarePen size={16} />Modifier
                            </button>
                            <button className={styles.menuItem + ' ' + styles.deleteMenuItem} onClick={handleDelete} onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                <Trash2 size={16} />Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.card_ncBottom}>
                <div>
                    <div className={styles.detailsContainer}>
                        <p className={styles.details}><MapPin size={16} style={{ margin: '2px 5px 0 0' }} /> {adresse}</p>
                        <p className={styles.details}>Caution : {avance} FCFA</p>
                        <p className={styles.details}>Loyer Mensuel : {prix} FCFA</p>
                        <p className={styles.details}>Catégorie : {type}</p>
                        <p className={styles.details}>Superficie : {superficie} m²</p>
                    </div>
                </div>

            </div>
        </div>
    );
}



const CardContrat = ({ contrat, onArchive, onEdit, onDownload, onStatusChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(contrat.statut);
    const menuRef = useRef(null);
    const statusRef = useRef(null);

    // Options de statut disponibles
    const statusOptions = [
        { value: 'actif', label: 'Actif', icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200' },
        { value: 'resilie', label: 'Résilié', icon: XCircle, color: 'bg-red-100 text-red-800 border-red-200' },
    ];

    // Trouver le statut actuel dans les options
    const currentStatus = statusOptions.find(opt => opt.value === contrat.statut) ||
        statusOptions.find(opt => opt.label.toLowerCase() === contrat.statut.toLowerCase());

    // Gestion du menu principal
    const handleMenuClick = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
        setIsStatusDropdownOpen(false);
    };

    const handleEdit = () => {
        setIsMenuOpen(false);
        onEdit && onEdit(contrat.id);
    };

    const handleArchive = () => {
        setIsMenuOpen(false);
        onArchive && onArchive(contrat.id);
    };

    const handleDownload = () => {
        setIsMenuOpen(false);
        onDownload && onDownload(contrat.id);
    };

    // Gestion du changement de statut
    const handleStatusClick = (e) => {
        e.stopPropagation();
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
        setIsMenuOpen(false);
    };

    const handleStatusSelect = (status) => {
        setSelectedStatus(status.value);
        setIsStatusDropdownOpen(false);

        // Appeler la fonction de changement de statut
        if (onStatusChange && status.value !== contrat.statut) {
            onStatusChange(contrat.id, status.value);
        }
    };

    // Gestion des clics en dehors des menus
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (statusRef.current && !statusRef.current.contains(event.target)) {
                setIsStatusDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Formater le montant en FCFA
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:border-blue-200">
            <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
                <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                        <Home size={18} className="inline mr-2" />
                        {contrat.bien || contrat.bien_nom || `Bien #${contrat.bien_id}`}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <User size={14} />
                        <span className="font-medium">Locataire:</span>
                        <span>{contrat.locataire || contrat.locataire_nom || `Locataire #${contrat.locataire_id || contrat.user_id}`}</span>
                        {contrat.locataire_email && (
                            <span className="text-gray-500 text-xs">
                                ({contrat.locataire_email})
                            </span>
                        )}
                    </div>
                    {contrat.bien_adresse && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                            <MapPin size={14} />
                            <span>{contrat.bien_adresse}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Menu de statut */}
                    <div className="relative" ref={statusRef}>
                        <button
                            onClick={handleStatusClick}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm cursor-pointer transition-all hover:scale-105 active:scale-95 ${currentStatus?.color || 'bg-gray-100 text-gray-800 border border-gray-200'}`}
                        >
                            {currentStatus?.icon && (
                                <currentStatus.icon size={14} />
                            )}
                            <span>{currentStatus?.label || contrat.statut}</span>
                            <ChevronDown size={14} className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isStatusDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                {statusOptions.map((status) => {
                                    const Icon = status.icon;
                                    return (
                                        <button
                                            key={status.value}
                                            onClick={() => handleStatusSelect(status)}
                                            className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${selectedStatus === status.value ? 'bg-blue-50 text-blue-600' : ''}`}
                                        >
                                            <Icon size={16} className="w-4 h-4" />
                                            <span>{status.label}</span>
                                            {selectedStatus === status.value && (
                                                <Check size={16} className="ml-auto text-blue-600" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Menu d'options */}
                    <div className="relative" ref={menuRef}>
                        <button
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 ${isMenuOpen ? 'bg-gray-100' : 'bg-transparent'}`}
                            onClick={handleMenuClick}
                        >
                            <Ellipsis size={20} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <button
                                    className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-2 border-transparent hover:border-blue-500"
                                    onClick={handleEdit}
                                >
                                    <SquarePen size={16} />
                                    <span>Modifier</span>
                                </button>
                                <button
                                    className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 text-green-600 hover:bg-green-50 transition-colors cursor-pointer border-l-2 border-transparent hover:border-green-500"
                                    onClick={handleDownload}
                                >
                                    <Download size={16} />
                                    <span>Télécharger</span>
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                    className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-l-2 border-transparent hover:border-red-500"
                                    onClick={handleArchive}
                                >
                                    <Trash2 size={16} />
                                    <span>Archiver</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <HandCoins size={16} className="text-gray-400" />
                        <span className="font-medium">Loyer:</span>
                        <span className="text-blue-600 font-semibold">
                            {formatCurrency(contrat.prix || contrat.loyer_mensuel)}
                        </span>
                        {contrat.charges > 0 && (
                            <span className="text-gray-500 text-sm ml-2">
                                (+ {formatCurrency(contrat.charges)} charges)
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium">Début:</span>
                        <span>{formatDate(contrat.dateDebut || contrat.date_debut)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium">Fin:</span>
                        <span>{formatDate(contrat.dateFin || contrat.date_fin)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <FileText size={16} className="text-gray-400" />
                        <span className="font-medium">Durée:</span>
                        {contrat.date_debut && contrat.date_fin && (
                            <span className="text-gray-600">
                                {Math.ceil(
                                    (new Date(contrat.date_fin) - new Date(contrat.date_debut)) /
                                    (1000 * 60 * 60 * 24 * 30)
                                )} mois
                            </span>
                        )}
                    </div>

                    {contrat.depot_garantie > 0 && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Garantie:</span>
                            <span className="text-gray-600">
                                {formatCurrency(contrat.depot_garantie)}
                            </span>
                        </div>
                    )}

                    {contrat.notes && (
                        <div className="col-span-full mt-2">
                            <p className="text-sm text-gray-600 italic">
                                "{contrat.notes}"
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                        ID: {contrat.id} •
                        Créé le: {formatDate(contrat.created_at)}
                    </div>
                    {contrat.pdf_path && (
                        <button
                            onClick={handleDownload}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Download size={12} />
                            PDF disponible
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};



export { DashboardCard, CardUsers, CardBiens, CardContrat };