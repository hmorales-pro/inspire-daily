import { useTranslation } from "react-i18next";
import { CurrentPlan } from "./CurrentPlan";
import { UpgradePlans } from "./UpgradePlans";

interface PricingGridProps {
  onSelectPlan: (plan: string) => void;
  isUpgrading: boolean;
  selectedPlan: string | null;
  showAllPlans?: boolean;
  currentPlan?: string;
  optimizationsCount?: number;
  optimizationsResetDate?: string;
}

export const PricingGrid = ({ 
  onSelectPlan, 
  isUpgrading, 
  selectedPlan,
  showAllPlans = true,
  currentPlan = 'free',
  optimizationsCount,
  optimizationsResetDate
}: PricingGridProps) => {
  const { t } = useTranslation(['landing', 'common', 'settings']);

  return (
    <div className="space-y-8">
      <CurrentPlan 
        currentPlan={currentPlan}
        optimizationsCount={optimizationsCount}
        optimizationsResetDate={optimizationsResetDate}
      />
      
      {showAllPlans && (
        <>
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('settings:subscription.upgradePlans')}
            </h3>
            <p className="text-gray-500 mt-2">
              {t('settings:subscription.choosePlan')}
            </p>
          </div>
          
          <UpgradePlans
            onSelectPlan={onSelectPlan}
            isUpgrading={isUpgrading}
            selectedPlan={selectedPlan}
            currentPlan={currentPlan}
          />
        </>
      )}
    </div>
  );
};