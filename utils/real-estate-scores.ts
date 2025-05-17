import { MLSListing, PropertyDetailResponse } from './property-types';

export function calculateInvestmentScore(
  mlsData: MLSListing | null,
  propertyData: PropertyDetailResponse | null,
): number {
  if (!mlsData || !propertyData || !propertyData.data.comps) return 0;

  let score = 0;

  // Price per sqft comparison
  const pricePerSqft = mlsData.pricePerSqFt || 0;
  const avgPricePerSqft =
    propertyData.data.comps.reduce((sum, comp) => {
      return sum + parseFloat(comp.estimatedValue) / parseFloat(comp.squareFeet);
    }, 0) / propertyData.data.comps.length;

  if (pricePerSqft < avgPricePerSqft) score += 2;

  // Days on market
  if (parseInt(mlsData.daysOnMarket || '0') < 30) score += 2;
  else if (parseInt(mlsData.daysOnMarket || '0') < 60) score += 1;

  // Property condition
  if (mlsData.property?.yearBuilt && parseInt(mlsData.property.yearBuilt) > 2000) score += 2;
  if (mlsData.homedetails?.appliances?.includes('New')) score += 1;

  // Location factors
  if (mlsData.property?.isWaterfront) score += 2;
  if (mlsData.property?.isMountainView) score += 1;

  return Math.min(score, 10);
}

export function calculateAppreciationRate(mlsData: MLSListing | null): number {
  if (!mlsData?.price_changes?.length) return 0;

  const changes = mlsData.price_changes;
  const oldestPrice = changes[changes.length - 1].price;
  const newestPrice = changes[0].price;
  const timeDiff =
    (new Date(changes[0].date).getTime() - new Date(changes[changes.length - 1].date).getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  return timeDiff > 0 ? ((newestPrice - oldestPrice) / oldestPrice) * 100 : 0;
}

export function calculateZipTrend(
  mlsData: MLSListing | null,
  propertyData: PropertyDetailResponse | null,
): string {
  if (!mlsData || !propertyData || !propertyData.data.comps) return 'neutral';

  const zipComps = propertyData.data.comps.filter(
    (comp) => comp.address?.address === mlsData.property?.postalCode,
  );

  if (zipComps.length < 3) return 'neutral';

  const avgDaysOnMarket = zipComps.reduce((sum, comp) => sum + 0, 0) / zipComps.length;
  return avgDaysOnMarket < 45 ? 'up' : avgDaysOnMarket > 90 ? 'down' : 'neutral';
}

export function calculateSchoolRating(mlsData: MLSListing | null): number {
  if (!mlsData?.schools || !Array.isArray(mlsData.schools)) return 0;

  const elementarySchools = mlsData.schools.filter((s) =>
    s.type.toLowerCase().includes('elementary'),
  );
  const middleSchools = mlsData.schools.filter((s) => s.type.toLowerCase().includes('middle'));
  const highSchools = mlsData.schools.filter((s) => s.type.toLowerCase().includes('high'));

  let totalScore = 0;
  let count = 0;

  if (elementarySchools.length > 0) {
    const rating =
      elementarySchools.reduce((sum, school) => sum + (school.rating || 0), 0) /
      elementarySchools.length;
    totalScore += rating;
    count++;
  }

  if (middleSchools.length > 0) {
    const rating =
      middleSchools.reduce((sum, school) => sum + (school.rating || 0), 0) / middleSchools.length;
    totalScore += rating;
    count++;
  }

  if (highSchools.length > 0) {
    const rating =
      highSchools.reduce((sum, school) => sum + (school.rating || 0), 0) / highSchools.length;
    totalScore += rating;
    count++;
  }

  return count > 0 ? Math.min(10, Math.max(0, totalScore / count)) : 0;
}

export function calculateMarketScore(mlsData: MLSListing | null): number {
  if (!mlsData) return 0;
  let score = 0;

  // Price per sqft vs area average
  const pricePerSqft = mlsData.pricePerSqFt || 0;
  const avgPricePerSqft = 0; // This will be calculated with propertyData

  // Price trend analysis
  const priceChanges = mlsData.price_changes || [];
  const daysBetweenChanges =
    priceChanges.length > 1
      ? (new Date(priceChanges[0].date).getTime() -
          new Date(priceChanges[priceChanges.length - 1].date).getTime()) /
        (1000 * 60 * 60 * 24) /
        (priceChanges.length - 1)
      : 0;

  const priceReductionPercentage =
    priceChanges.length > 0
      ? ((mlsData.listPrice ?? 0 - priceChanges[priceChanges.length - 1].price) /
          priceChanges[priceChanges.length - 1].price) *
        100
      : 0;

  // Market position scoring
  if (pricePerSqft < avgPricePerSqft) score += 2;
  else if (pricePerSqft > avgPricePerSqft * 1.1) score -= 1;

  // Days on market analysis
  const daysOnMarket = parseInt(mlsData.daysOnMarket || '0');
  if (daysOnMarket < 30) score += 2;
  else if (daysOnMarket < 60) score += 1;
  else if (daysOnMarket > 90) score -= 1;

  // Price changes frequency
  if (priceChanges.length === 0) score += 1;
  else if (priceChanges.length === 1) score += 0.5;
  else if (priceChanges.length > 2) score -= 1;

  // Market velocity indicators
  if (daysBetweenChanges < 14) score += 1;

  return Math.max(0, Math.min(score, 10));
}

export function calculateMarketActivityScore(mlsData: MLSListing | null): number {
  if (!mlsData) return 0;
  let score = 0;

  // Days on market
  const daysOnMarket = parseInt(mlsData.daysOnMarket || '0');
  if (daysOnMarket < 30) score += 3;
  else if (daysOnMarket < 60) score += 2;
  else if (daysOnMarket < 90) score += 1;

  // Price changes in last 30 days
  const recentPriceChanges =
    mlsData.price_changes?.filter((change) => {
      const changeDate = new Date(change.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return changeDate >= thirtyDaysAgo;
    }).length || 0;

  if (recentPriceChanges === 1) score += 2;
  else if (recentPriceChanges > 1) score += 1;

  // New listings in last 30 days
  const recentStatusChanges =
    mlsData.status_changes?.filter((change) => {
      const changeDate = new Date(change.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return changeDate >= thirtyDaysAgo;
    }).length || 0;

  if (recentStatusChanges === 1) score += 2;
  else if (recentStatusChanges > 1) score += 1;

  return Math.max(0, Math.min(score, 10));
}

export function calculateLocationScore(
  mlsData: MLSListing | null,
  propertyData: PropertyDetailResponse | null,
): number {
  if (!mlsData || !propertyData) return 0;
  let score = 0;

  // Walk score
  const walkScore = propertyData.data.walkScore || 0;
  if (walkScore > 80) score += 3;
  else if (walkScore > 60) score += 2;
  else if (walkScore > 40) score += 1;

  // Crime rate
  const crimeRate = propertyData.data.crimeRate || 0;
  if (crimeRate < 10) score += 3;
  else if (crimeRate < 20) score += 2;
  else if (crimeRate < 30) score += 1;

  // Public transit access
  const remarks = mlsData.publicRemarks?.toLowerCase() || '';
  if (
    remarks.includes('transit') ||
    remarks.includes('bus') ||
    remarks.includes('train') ||
    remarks.includes('metro')
  ) {
    score += 1;
  }

  // Shopping centers proximity
  if (
    remarks.includes('shopping') ||
    remarks.includes('mall') ||
    remarks.includes('retail') ||
    remarks.includes('stores')
  ) {
    score += 1;
  }

  // Distance to amenities
  const amenities = [
    'school',
    'park',
    'restaurant',
    'grocery',
    'hospital',
    'gym',
    'pool',
    'tennis',
    'golf',
    'beach',
  ];

  const amenityCount = amenities.filter((amenity) => remarks.includes(amenity)).length;

  if (amenityCount > 5) score += 2;
  else if (amenityCount > 3) score += 1;

  return Math.max(0, Math.min(score, 10));
}

export function calculatePropertyConditionScore(mlsData: MLSListing | null): number {
  if (!mlsData) return 0;

  let score = 0;

  // Year built
  if (mlsData.property?.yearBuilt && parseInt(mlsData.property.yearBuilt) > 2000) score += 3;
  else if (mlsData.property?.yearBuilt && parseInt(mlsData.property.yearBuilt) > 1990) score += 2;
  else if (mlsData.property?.yearBuilt && parseInt(mlsData.property.yearBuilt) > 1980) score += 1;

  // Updates/renovations
  if (mlsData.homedetails?.appliances?.includes('New')) score += 2;
  if (mlsData.homedetails?.roof?.includes('New')) score += 2;

  // Features
  if (mlsData.property?.hasPool) score += 1;
  if (mlsData.property?.hasBasement) score += 1;

  return Math.max(0, Math.min(score, 10));
}

export function calculateNeighborhoodSafetyScore(
  mlsData: MLSListing | null,
  propertyData: PropertyDetailResponse | null,
): number {
  let score = 0;

  // Crime rate
  if (propertyData?.data?.crimeRate) {
    if (propertyData.data.crimeRate < 10) score += 4;
    else if (propertyData.data.crimeRate < 20) score += 3;
    else if (propertyData.data.crimeRate < 30) score += 2;
    else if (propertyData.data.crimeRate < 40) score += 1;
  }

  // Population density
  if (propertyData?.data?.populationDensity) {
    if (propertyData.data.populationDensity < 1000) score += 3;
    else if (propertyData.data.populationDensity < 2000) score += 2;
    else if (propertyData.data.populationDensity < 3000) score += 1;
  }

  return Math.max(0, Math.min(score, 10));
}

export function calculateTaxRate(mlsData: MLSListing | null): number {
  if (!mlsData) return 0;

  // Get tax rate from property data
  const taxRate = 0; // This will be calculated with propertyData

  // Convert to a score out of 10 (lower tax rate is better)
  // Assuming typical tax rates range from 0.5% to 3%
  const score = Math.max(0, Math.min(10 - taxRate * 2, 10));

  return score;
}
