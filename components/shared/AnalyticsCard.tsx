"use client"

import { Card, CardContent } from "@/components/ui/card";
import { CustomProgress } from '../custom/customProgress';

interface AnalyticsCardProps {
  data: BaseAnalyticsData[];
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ data, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {data.map((item, index) => {
        const IconComponent = item.icon;
        
        return (
          <Card key={index} className='border-border'>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <IconComponent className={`h-5 w-5 ${item.colorClass}`} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.colorClass}`}>
                    {item.value}
                  </p>
                </div>
              </div>
              {item.showProgress && item.progressValue !== undefined && (
                <CustomProgress
                  value={item.progressValue}
                  className="mt-2 h-2"
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsCard;