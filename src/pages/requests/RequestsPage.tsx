import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { supabase } from '../../services/supabase';
import type { Request, DocumentType } from '../../types';
import { DOCUMENT_CONFIGS } from '../../utils/documents';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function RequestsPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [documentFilter, setDocumentFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          delegates (
            name,
            city,
            rating
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      new: 'Nouvelle',
      assigned: 'Assignée',
      in_progress: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrage des demandes
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      DOCUMENT_CONFIGS[request.document_type as DocumentType]?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDocument = documentFilter === 'all' || request.document_type === documentFilter;
    
    return matchesSearch && matchesStatus && matchesDocument;
  });

  const statusCounts = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    assigned: requests.filter(r => r.status === 'assigned').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
            <p className="mt-2 text-gray-600">
              Gérez et suivez toutes vos demandes de documents administratifs
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/requests/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Link>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par document ou ville..."
                  className="pl-10 form-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtres */}
              <div className="flex space-x-4">
                <select
                  className="form-input min-w-0"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts ({statusCounts.all})</option>
                  <option value="new">Nouvelles ({statusCounts.new})</option>
                  <option value="assigned">Assignées ({statusCounts.assigned})</option>
                  <option value="in_progress">En cours ({statusCounts.in_progress})</option>
                  <option value="completed">Terminées ({statusCounts.completed})</option>
                  <option value="cancelled">Annulées ({statusCounts.cancelled})</option>
                </select>

                <select
                  className="form-input min-w-0"
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                >
                  <option value="all">Tous les documents</option>
                  {Object.values(DOCUMENT_CONFIGS).map((doc) => (
                    <option key={doc.type} value={doc.type}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {requests.length === 0 ? 'Aucune demande' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-500 mb-6">
                {requests.length === 0 
                  ? 'Vous n\'avez pas encore fait de demande de document.'
                  : 'Aucune demande ne correspond à vos critères de recherche.'
                }
              </p>
              {requests.length === 0 && (
                <Link
                  to="/requests/new"
                  className="btn-primary"
                >
                  Faire ma première demande
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(request.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {DOCUMENT_CONFIGS[request.document_type as DocumentType]?.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Demandé le {formatDate(request.created_at)}</span>
                          <span>•</span>
                          <span>{request.city}</span>
                          <span>•</span>
                          <span>{request.copies} copie{request.copies > 1 ? 's' : ''}</span>
                        </div>
                        {(request as any).delegates && (
                          <div className="mt-1 text-sm text-gray-600">
                            Délégué: {(request as any).delegates.name} - {(request as any).delegates.city}
                            {(request as any).delegates.rating && (
                              <span className="ml-2 text-yellow-500">
                                ⭐ {(request as any).delegates.rating}/5
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {request.total_amount.toLocaleString()} FCFA
                        </div>
                        {request.status === 'completed' && request.completed_at && (
                          <div className="text-sm text-green-600">
                            Terminé le {formatDate(request.completed_at)}
                          </div>
                        )}
                        {request.status === 'in_progress' && request.estimated_completion && (
                          <div className="text-sm text-blue-600">
                            Livraison prévue le {formatDate(request.estimated_completion)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          // TODO: Ouvrir modal de détails ou page dédiée
                          console.log('Voir détails', request.id);
                        }}
                        className="btn-secondary"
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Détails
                      </button>
                    </div>
                  </div>

                  {/* Actions spécifiques selon le statut */}
                  {request.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          ⭐ Noter le délégué
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                          📄 Télécharger le document
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                          🔄 Refaire cette demande
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistiques rapides */}
        {requests.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
              <div className="text-sm text-gray-500">Total demandes</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.assigned + statusCounts.in_progress}</div>
              <div className="text-sm text-gray-500">En cours</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
              <div className="text-sm text-gray-500">Terminées</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">
                {requests.reduce((sum, r) => r.status === 'completed' ? sum + r.total_amount : sum, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total dépensé (FCFA)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}