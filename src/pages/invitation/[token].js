import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Home, Calendar, CheckCircle, XCircle, Loader2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function InvitationPage() {
    const router = useRouter();
    const { token } = router.query;

    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState("");

    // Récupérer les détails de l'invitation
    useEffect(() => {
        if (!router.isReady) return; // Attendre que le routeur soit prêt

        if (!token) {
            setError("Lien d'invitation incomplet");
            setLoading(false);
            return;
        }

        if (typeof token === 'string') {
            fetchInvitation(token);
        } else {
            setError("Token d'invitation invalide");
            setLoading(false);
        }
    }, [router.isReady, token]);

    // Calcul du temps restant
    useEffect(() => {
        if (!invitation || !invitation.expires_at) return;

        const updateTimeRemaining = () => {
            const now = new Date();
            const expiry = new Date(invitation.expires_at);
            const diff = expiry.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeRemaining("Expirée");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeRemaining(`${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`);
            } else if (hours > 0) {
                setTimeRemaining(`${hours} heure${hours > 1 ? 's' : ''} restante${hours > 1 ? 's' : ''}`);
            } else {
                setTimeRemaining(`${minutes} minute${minutes > 1 ? 's' : ''} restante${minutes > 1 ? 's' : ''}`);
            }
        };

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 60000);

        return () => clearInterval(interval);
    }, [invitation]);

    const fetchInvitation = async (invitationToken) => {
        try {
            console.log('🔍 Fetching invitation for token:', invitationToken);
            const response = await fetch(`${API_URL}/invitations/validate/${invitationToken}`);

            console.log('📋 Response status:', response.status);
            const data = await response.json();

            if (response.ok) {
                console.log('✅ Invitation reçue:', data.invitation);
                setInvitation(data.invitation);
                setError(null);
            } else {
                console.log('❌ Erreur API:', data);
                setError(data.message || "Invitation invalide");
            }
        } catch (error) {
            console.error('🔥 Erreur fetch:', error);
            setError("Erreur de connexion au serveur");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!invitation || !token) return;

        setActionLoading(true);
        try {
            const now = new Date();
            const expiry = new Date(invitation.expires_at);

            if (now > expiry) {
                setError("Cette invitation a expiré");
                setActionLoading(false);
                return;
            }

            // Debug logs
            console.log('🎯 Redirection vers inscription:');
            console.log('- Token:', token);
            console.log('- Email:', invitation.email_invite);
            console.log('- URL encodée:', encodeURIComponent(invitation.email_invite));

            // Créer l'URL
            //const url = `/inscription?token=${token}&email=${encodeURIComponent(invitation.email_invite)}`;
            window.location.href = `/inscription-simple?token=${token}&email=${encodeURIComponent(invitation.email_invite)}`;
            console.log('- URL complète:', url);

            // Tester d'abord avec une page simple
            // window.location.href = '/test';

            // Puis avec la vraie URL
            //window.location.href = url;

        } catch (error) {
            console.error("Erreur:", error);
            setError("Erreur lors de l'acceptation");
            setActionLoading(false);
        }
    };

    const handleDecline = async () => {
        if (!confirm("Êtes-vous sûr de vouloir refuser cette invitation ?")) return;

        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/invitations/decline/${token}`, {
                method: "POST"
            });

            if (response.ok) {
                setActionSuccess("Invitation refusée avec succès");
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError("Erreur de connexion");
        } finally {
            setActionLoading(false);
        }
    };

    // 1. Premier : Vérifier si le routeur n'est pas encore prêt
    if (!router.isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-4">Chargement...</p>
                </div>
            </div>
        );
    }

    // 2. Deuxième : Vérifier si on est en chargement
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-4">Vérification de votre invitation...</p>
                </div>
            </div>
        );
    }

    // 3. Troisième : Vérifier les erreurs
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <XCircle className="h-6 w-6" />
                            Invitation invalide
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link href="/">
                            <Button>Retour à l'accueil</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 4. Quatrième : Vérifier si l'invitation est déjà traitée
    if (!invitation || !invitation.statut || invitation.statut !== 'pending') {
        if (!invitation) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <AlertCircle className="h-6 w-6" />
                                Invitation non trouvée
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-6">Aucune invitation correspondante trouvée.</p>
                            <Link href="/">
                                <Button>Retour à l'accueil</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className={
                            invitation.statut === 'accepted'
                                ? "text-green-600 flex items-center gap-2"
                                : invitation.statut === 'declined'
                                    ? "text-red-600 flex items-center gap-2"
                                    : "text-gray-600 flex items-center gap-2"
                        }>
                            {invitation.statut === 'accepted' ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : invitation.statut === 'declined' ? (
                                <XCircle className="h-6 w-6" />
                            ) : (
                                <AlertCircle className="h-6 w-6" />
                            )}
                            {invitation.statut === 'accepted' ? 'Invitation acceptée' :
                                invitation.statut === 'declined' ? 'Invitation refusée' :
                                    'Invitation invalide'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            {invitation.statut === 'accepted'
                                ? 'Cette invitation a déjà été acceptée.'
                                : invitation.statut === 'declined'
                                    ? 'Cette invitation a été refusée.'
                                    : 'Cette invitation n\'est plus valide.'}
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">
                                <strong>Email :</strong> {invitation.email_invite}
                            </p>
                            {invitation.proprietaire && (
                                <p className="text-sm text-gray-500">
                                    <strong>Propriétaire :</strong> {invitation.proprietaire.nom}
                                </p>
                            )}
                        </div>
                        <div className="mt-6">
                            <Link href="/">
                                <Button>Retour à l'accueil</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 5. Si tout est bon, afficher l'invitation
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardTitle className="flex items-center gap-3">
                            <Mail className="h-8 w-8 text-blue-600" />
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">Invitation à rejoindre la plateforme</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <p className="text-sm text-gray-600">
                                        {timeRemaining !== "Expirée" ? (
                                            <>
                                                Expire dans <span className="font-semibold">{timeRemaining}</span>
                                            </>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Expirée</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <Badge className="ml-auto" variant="default">
                                En attente
                            </Badge>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
                        {/* Informations du propriétaire */}
                        {invitation.proprietaire && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Propriétaire
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nom</p>
                                        <p className="font-medium">{invitation.proprietaire.nom}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{invitation.proprietaire.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Informations du bien (si disponible) */}
                        {invitation.bien && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                                    <Home className="h-5 w-5" />
                                    Bien concerné
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nom du bien</p>
                                        <p className="font-medium">{invitation.bien.nom}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Type</p>
                                        <p className="font-medium">{invitation.bien.type}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-600">Adresse</p>
                                        <p className="font-medium">{invitation.bien.adresse}, {invitation.bien.ville}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-6 border-t">
                            {actionSuccess ? (
                                <div className="text-center">
                                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                    <p className="text-green-600 font-medium">{actionSuccess}</p>
                                    <p className="text-gray-500 text-sm mt-2">Redirection en cours...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            onClick={handleAccept}
                                            disabled={actionLoading || timeRemaining === "Expirée"}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            size="lg"
                                        >
                                            {actionLoading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                    Traitement...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-5 w-5 mr-2" />
                                                    {timeRemaining === "Expirée" ? "Invitation expirée" : "Accepter l'invitation"}
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            onClick={handleDecline}
                                            disabled={actionLoading || timeRemaining === "Expirée"}
                                            variant="outline"
                                            className="flex-1"
                                            size="lg"
                                        >
                                            <XCircle className="h-5 w-5 mr-2" />
                                            Refuser l'invitation
                                        </Button>
                                    </div>

                                    <div className="mt-6 text-center text-sm text-gray-600">
                                        <p className="mb-2">
                                            En acceptant, vous serez redirigé vers la page d'inscription.
                                        </p>
                                        <div className="bg-gray-100 p-3 rounded-lg inline-block">
                                            <p className="font-medium">
                                                Email : <span className="text-blue-600">{invitation.email_invite}</span>
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}