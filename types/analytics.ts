interface BaseAnalyticsData {
  label: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
  showProgress?: boolean;
  progressValue?: number;
}