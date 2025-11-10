import { useState, useEffect } from 'react';
import axios from 'axios';

interface PlanFeatures {
  basicDiagrams: boolean;
  advancedDiagrams: boolean;
  aiAnalysis: 'basic' | 'advanced' | 'none';
  teamCollaboration: boolean;
  customTemplates: boolean;
  exportOptions: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
}

interface PlanLimits {
  maxProjects: number | string;
  maxStorage: number | string;
  maxTeamMembers: number | string;
  maxFilesPerProject: number | string;
  features: PlanFeatures;
}

interface PlanInfo {
  plan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: string;
  limits: PlanLimits;
  usage: {
    projects: number;
    projectsLimit: number | 'Unlimited';
  };
}

export const useSubscription = () => {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanLimits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payment/plan-limits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlanInfo(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching plan limits:', err);
      setError(err.response?.data?.message || 'Failed to fetch plan information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanLimits();
  }, []);

  const canCreateProject = () => {
    if (!planInfo) return false;
    
    const { projects, projectsLimit } = planInfo.usage;
    
    if (projectsLimit === 'Unlimited') return true;
    
    return projects < (projectsLimit as number);
  };

  const hasFeature = (feature: keyof PlanFeatures) => {
    if (!planInfo) return false;
    
    const featureValue = planInfo.limits.features[feature];
    return featureValue === true || featureValue === 'advanced' || featureValue === 'basic';
  };

  const getFeatureLevel = (feature: keyof PlanFeatures) => {
    if (!planInfo) return 'none';
    return planInfo.limits.features[feature];
  };

  const isPro = () => planInfo?.plan === 'PROFESSIONAL' || planInfo?.plan === 'ENTERPRISE';
  const isEnterprise = () => planInfo?.plan === 'ENTERPRISE';
  const isFree = () => planInfo?.plan === 'FREE';

  return {
    planInfo,
    loading,
    error,
    refetch: fetchPlanLimits,
    // Helper functions
    canCreateProject,
    hasFeature,
    getFeatureLevel,
    isPro,
    isEnterprise,
    isFree,
  };
};
