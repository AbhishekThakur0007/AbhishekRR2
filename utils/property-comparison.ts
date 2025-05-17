import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';

export function getTrendIcon(value: number, subjectValue: number): string {
  if (value > subjectValue) return 'text-emerald-500';
  if (value < subjectValue) return 'text-red-500';
  return 'text-muted-foreground';
}

export function getBetterValue(
  value: number,
  comparisonValue: number,
): 'better' | 'worse' | 'neutral' {
  if (value === null || comparisonValue === null) return 'neutral';
  return value > comparisonValue ? 'better' : value < comparisonValue ? 'worse' : 'neutral';
}

export function getComparisonClass(
  type: 'pricePerSqFt' | 'schoolRating' | 'taxRate' | 'appreciationRate' | 'daysOnMarket',
  value: number,
  subjectValue: number,
): string {
  const isBetter = (val: number, subject: number, type: string): boolean => {
    switch (type) {
      case 'pricePerSqFt':
      case 'taxRate':
      case 'daysOnMarket':
        return val < subject; // Lower is better
      case 'schoolRating':
      case 'appreciationRate':
        return val > subject; // Higher is better
      default:
        return val > subject;
    }
  };

  if (value === subjectValue) return '';
  return isBetter(value, subjectValue, type) ? 'text-emerald-500' : 'text-rose-500';
}

export function formatPercentDiff(value: number, subjectValue: number): string {
  const diff = ((value - subjectValue) / subjectValue) * 100;
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
}
