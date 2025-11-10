import { AlertCircle, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface UpgradePromptProps {
  feature: string;
  currentPlan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  requiredPlan?: 'PROFESSIONAL' | 'ENTERPRISE';
}

export const UpgradePrompt = ({ feature, currentPlan, requiredPlan = 'PROFESSIONAL' }: UpgradePromptProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/select-plan');
  };

  if (currentPlan !== 'FREE') {
    return null;
  }

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-900">Upgrade Required</AlertTitle>
      <AlertDescription className="text-amber-800">
        <p className="mb-3">
          {feature} is not available on the FREE plan.
        </p>
        <Button
          onClick={handleUpgrade}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {requiredPlan === 'PROFESSIONAL' ? (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Upgrade to Professional
            </>
          ) : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Enterprise
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

interface ProjectLimitReachedProps {
  currentProjects: number;
  maxProjects: number;
}

export const ProjectLimitReached = ({ currentProjects, maxProjects }: ProjectLimitReachedProps) => {
  const navigate = useNavigate();

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-900">Project Limit Reached</AlertTitle>
      <AlertDescription className="text-red-800">
        <p className="mb-3">
          You've reached the maximum of {maxProjects} projects on the FREE plan.
          You currently have {currentProjects} projects.
        </p>
        <p className="mb-3 text-sm">
          Upgrade to Professional for unlimited projects!
        </p>
        <Button
          onClick={() => navigate('/select-plan')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          Upgrade Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};

interface FeatureLockedBadgeProps {
  feature: string;
}

export const FeatureLockedBadge = ({ feature }: FeatureLockedBadgeProps) => {
  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-200">
      <Crown className="w-3 h-3 mr-1" />
      Pro Feature
    </div>
  );
};
