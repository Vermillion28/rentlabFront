// pdfService.js - Service frontend pour gérer les téléchargements
import axios from 'axios';

class PDFService {
  constructor(token) {
    this.token = token;
    this.api = axios.create({
      baseURL: 'http://localhost:3001/api',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Télécharger un contrat PDF
  async downloadContratPDF(contratId) {
    try {
      const response = await this.api.get(`/contrats/${contratId}/download`, {
        responseType: 'blob'
      });
      
      // Créer un blob à partir de la réponse
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrat_${contratId}_${new Date().getTime()}.pdf`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer l'URL
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw error;
    }
  }

  // Générer un aperçu du contrat
  async previewContratPDF(contratId) {
    try {
      const response = await this.api.get(`/contrats/${contratId}/download`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Ouvrir dans un nouvel onglet
      window.open(url, '_blank');
      
      return url;
    } catch (error) {
      console.error('Erreur lors de la prévisualisation:', error);
      throw error;
    }
  }

  // Vérifier si un PDF existe
  async checkPDFExists(contratId) {
    try {
      const response = await this.api.get(`/contrats/${contratId}`);
      return response.data.contrat.pdf_path ? true : false;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      return false;
    }
  }
}

export default PDFService;