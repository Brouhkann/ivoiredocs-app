import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { supabase } from '../../services/supabase';
import type { Request, DocumentType } from '../../types';
import { DOCUMENT_CONFIGS } from '../../utils/documents';
import {
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  total_requests: number;
  pending_requests: number;
  completed_requests: number;
  cancelled_requests: number;
}

export default function DashboardPage() {
  const { user, profile } = useAuthStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_requests: 0,
    pending_requests: 0,
    completed_requests: 0,
    cancelled_requests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les demandes récentes
      const { data: requestsData, error: requestsError } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(10);

      if (requestsError) throw requestsError;

      setRequests(requestsData || []);

      // Calculer les statistiques
      const totalRequests = requestsData?.length || 0;
      const pendingRequests = requestsData?.filter(r => ['new', 'assigned', 'in_progress'].includes(r.status)).length || 0;
      const completedRequests = requestsData?.filter(r => r.status === 'completed').length || 0;
      const cancelledRequests = requestsData?.filter(r => r.status === 'cancelled').length || 0;

      setStats({
        total_requests: totalRequests,
        pending_requests: pendingRequests,
        completed_requests: completedRequests,
        cancelled_requests: cancelledRequests
      });

    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {profile?.name || user?.email} 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez vos demandes de documents administratifs depuis votre tableau de bord.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/requests/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nouvelle demande
            </Link>
            <Link
              to="/requests"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <EyeIcon className="w-5 h-5 mr-2" />
              Voir toutes mes demandes
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="w-8 h-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total demandes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_requests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En cours</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending_requests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Terminées</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed_requests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="w-8 h-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">À noter</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Demandes récentes</h2>
              </div>
              <div className="p-6">
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune demande
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Vous n'avez pas encore fait de demande de document.
                    </p>
                    <Link
                      to="/requests/new"
                      className="btn-primary"
                    >
                      Faire ma première demande
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(request.status)}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {DOCUMENT_CONFIGS[request.document_type as DocumentType]?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(request.created_at)}
                            </p>
                            {(request as any).delegates && (
                              <p className="text-xs text-gray-400">
                                Délégué: {(request as any).delegates.name} - {(request as any).delegates.city}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {request.total_amount.toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents disponibles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Documents disponibles</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.values(DOCUMENT_CONFIGS).map((doc) => (
                    <div
                      key={doc.type}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                        <p className="text-xs text-gray-500">{doc.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-600">
                          {doc.base_price.toLocaleString()} FCFA
                        </p>
                        <p className="text-xs text-gray-500">{doc.processing_time}h</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    to="/requests/new"
                    className="w-full btn-primary justify-center"
                  >
                    Faire une demande
                  </Link>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-primary-700 text-sm mb-4">
                Notre équipe support est là pour vous accompagner dans vos démarches.
              </p>
              <div className="space-y-2">
                <p className="text-primary-800 text-sm font-medium">
                  📞 +225 XX XX XX XX
                </p>
                <p className="text-primary-800 text-sm font-medium">
                  📧 support@ivoiredocs.ci
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/help"
                  className="w-full btn-primary justify-center bg-primary-600 hover:bg-primary-700"
                >
                  Centre d'aide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}