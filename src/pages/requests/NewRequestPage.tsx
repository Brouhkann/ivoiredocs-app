import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { supabase } from '../../services/supabase';
import { toast } from '../../stores/toast';
import { DOCUMENT_CONFIGS, CITIES, calculatePrice, estimateCompletionTime } from '../../utils/documents';
import type { DocumentType } from '../../types';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface FormData {
  document_type: DocumentType | '';
  city: string;
  copies: number;
  form_data: Record<string, string>;
}

export default function NewRequestPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    document_type: '',
    city: '',
    copies: 1,
    form_data: {}
  });

  const selectedDocConfig = formData.document_type ? DOCUMENT_CONFIGS[formData.document_type] : null;
  const estimatedPrice = selectedDocConfig && formData.city ? 
    calculatePrice(formData.document_type as DocumentType, formData.city, formData.copies) : 0;
  const estimatedTime = selectedDocConfig && formData.city ?
    estimateCompletionTime(formData.document_type as DocumentType, formData.city) : null;

  const handleDocumentSelect = (docType: DocumentType) => {
    setFormData({
      ...formData,
      document_type: docType,
      form_data: {}
    });
    setCurrentStep(2);
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      form_data: {
        ...formData.form_data,
        [field]: value
      }
    });
  };

  const validateForm = () => {
    if (!formData.document_type) {
      setError('Veuillez sélectionner un type de document');
      return false;
    }
    if (!formData.city) {
      setError('Veuillez sélectionner une ville');
      return false;
    }
    if (!selectedDocConfig) return false;

    // Vérifier que tous les champs requis sont remplis
    for (const field of selectedDocConfig.required_fields) {
      if (!formData.form_data[field]?.trim()) {
        setError(`Le champ "${field.replace('_', ' ')}" est requis`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!user || !selectedDocConfig) return;

    setLoading(true);
    setError('');

    try {
      const totalAmount = calculatePrice(
        formData.document_type as DocumentType, 
        formData.city, 
        formData.copies
      );
      
      const delegateEarnings = Math.round(totalAmount * 0.6); // 60% pour le délégué

      const { error: insertError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          document_type: formData.document_type,
          service_type: selectedDocConfig.service,
          city: formData.city,
          copies: formData.copies,
          total_amount: totalAmount,
          delegate_earnings: delegateEarnings,
          form_data: formData.form_data,
          status: 'new'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Notifier le succès et rediriger
      toast.success(
        'Demande créée avec succès !', 
        'Votre demande va être assignée à un délégué dans les plus brefs délais.'
      );
      
      navigate('/dashboard');

    } catch (err: any) {
      console.error('Erreur lors de la création de la demande:', err);
      const errorMessage = 'Une erreur est survenue lors de la création de votre demande';
      setError(errorMessage);
      toast.error('Erreur de création', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quel document souhaitez-vous obtenir ?
        </h2>
        <p className="text-gray-600">
          Sélectionnez le type de document administratif dont vous avez besoin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(DOCUMENT_CONFIGS).map((doc) => (
          <button
            key={doc.type}
            onClick={() => handleDocumentSelect(doc.type)}
            className="group relative bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="w-8 h-8 text-primary-600 group-hover:text-primary-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-900">
                  {doc.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{doc.service}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 font-bold">
                    {doc.base_price.toLocaleString()} FCFA
                  </span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {doc.processing_time}h
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDocumentForm = () => {
    if (!selectedDocConfig) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Informations pour votre {selectedDocConfig.name.toLowerCase()}
          </h2>
          <p className="text-gray-600">
            Veuillez remplir les informations nécessaires pour traiter votre demande
          </p>
        </div>

        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-2">Document sélectionné</h3>
          <p className="text-primary-800">{selectedDocConfig.name} - {selectedDocConfig.service}</p>
        </div>

        {/* Formulaire dynamique selon le type de document */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedDocConfig.required_fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} *
              </label>
              <input
                type={field.includes('date') ? 'date' : 'text'}
                className="form-input"
                placeholder={`Saisissez ${field.replace('_', ' ')}`}
                value={formData.form_data[field] || ''}
                onChange={(e) => handleFormDataChange(field, e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        {/* Sélection ville et copies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville * <MapPinIcon className="w-4 h-4 inline ml-1" />
            </label>
            <select
              className="form-input"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            >
              <option value="">Sélectionnez une ville</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de copies
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="form-input"
              value={formData.copies}
              onChange={(e) => setFormData({ ...formData, copies: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        {/* Récapitulatif prix */}
        {estimatedPrice > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Récapitulatif
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Document ({formData.copies} copie{formData.copies > 1 ? 's' : ''})</span>
                <span>{(estimatedPrice - (formData.city ? 1000 : 0)).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span>1 000 FCFA</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary-600">{estimatedPrice.toLocaleString()} FCFA</span>
              </div>
              {estimatedTime && (
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    Délai estimé
                  </span>
                  <span>{estimatedTime.toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="btn-secondary flex-1"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.city}
            className="btn-primary flex-1"
          >
            {loading ? 'Création...' : 'Créer la demande'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nouvelle demande de document
          </h1>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'
              }`}>1</span>
              Type de document
            </span>
            <span className="w-8 h-px bg-gray-300"></span>
            <span className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'
              }`}>2</span>
              Informations
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {currentStep === 1 && renderDocumentSelection()}
          {currentStep === 2 && renderDocumentForm()}
        </div>
      </div>
    </div>
  );
}