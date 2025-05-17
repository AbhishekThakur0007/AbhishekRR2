import { Property } from '@/utils/property-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { getComparisonClass, formatPercentDiff } from '@/utils/property-comparison';

interface MarketAnalysisProps {
  properties: Property[];
  subjectProperty: Property;
  isMobile: boolean;
  onPropertyClick: (property: Property) => void;
}

export function MarketAnalysis({
  properties,
  subjectProperty,
  isMobile,
  onPropertyClick,
}: MarketAnalysisProps) {
  // Calculate averages from comparable properties
  const avgDaysOnMarket = Math.round(
    properties.reduce((sum, p) => sum + p.daysOnMarket, 0) / properties.length,
  );

  const avgPricePerSqFt = Math.round(
    properties.reduce((sum, p) => {
      const price = Number(p.price.replace(/[^0-9]/g, ''));
      return sum + price / p.sqft;
    }, 0) / properties.length,
  );

  const avgTaxRate =
    Math.round((properties.reduce((sum, p) => sum + p.taxRate, 0) / properties.length) * 100) / 100;

  const subjectPricePerSqFt = Math.round(
    Number(subjectProperty.price.replace(/[^0-9]/g, '')) / subjectProperty.sqft,
  );

  const pricePerSqFtDiff = Math.round(
    ((subjectPricePerSqFt - avgPricePerSqFt) / avgPricePerSqFt) * 100,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>Current market conditions and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Market Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Market Score</span>
                    <span className="text-sm font-bold">{subjectProperty.marketScore}/10</span>
                  </div>
                  <Progress value={subjectProperty.marketScore * 10} />
                </div>
                <div className="bg-card rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Market Activity</span>
                    <span className="text-sm font-bold">
                      {subjectProperty.marketActivityScore}/10
                    </span>
                  </div>
                  <Progress value={subjectProperty.marketActivityScore * 10} />
                </div>
                <div className="bg-card rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Location Score</span>
                    <span className="text-sm font-bold">{subjectProperty.locationScore}/10</span>
                  </div>
                  <Progress value={subjectProperty.locationScore * 10} />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Market Velocity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Days on Market</span>
                    <span className="text-sm">{subjectProperty.daysOnMarket} days</span>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Market Time</span>
                    <span className="text-sm">{avgDaysOnMarket} days</span>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Market Absorption</span>
                    <span className="text-sm">
                      {Math.round(properties.length / 30)} props/month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Price & Market Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Price per SqFt</span>
                        <span className="text-sm">${subjectPricePerSqFt}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Avg Price per SqFt</span>
                        <span className="text-sm">${avgPricePerSqFt}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Market Absorption</span>
                        <span className="text-sm">
                          {Math.round(properties.length / 30)} props/month
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Days on Market vs Avg</span>
                        <span
                          className={getComparisonClass(
                            'daysOnMarket',
                            subjectProperty.daysOnMarket,
                            avgDaysOnMarket,
                          )}
                        >
                          {subjectProperty.daysOnMarket - avgDaysOnMarket} days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Price Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Current Price</span>
                        <span className="text-sm">{subjectProperty.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Price per SqFt vs Comps</span>
                        <span
                          className={getComparisonClass(
                            'pricePerSqFt',
                            subjectPricePerSqFt,
                            avgPricePerSqFt,
                          )}
                        >
                          {pricePerSqFtDiff}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">School Rating</span>
                        <span className="text-sm">{subjectProperty.schoolRating}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Appreciation Rate</span>
                        <span className="text-sm">{subjectProperty.appreciationRate}%/yr</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Property Features & Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Property Condition</span>
                        <span className="text-sm">{subjectProperty.propertyConditionScore}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Year Built</span>
                        <span className="text-sm">{subjectProperty.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Lot Size</span>
                        <span className="text-sm">{subjectProperty.lotSize}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Amenities</span>
                        <span className="text-sm">{subjectProperty.amenities.length} features</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Property Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">School Rating</span>
                        <span className="text-sm">{subjectProperty.schoolRating}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Location Score</span>
                        <span className="text-sm">{subjectProperty.locationScore}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Neighborhood Safety</span>
                        <span className="text-sm">
                          {subjectProperty.neighborhoodSafetyScore}/10
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Market Activity</span>
                        <span className="text-sm">{subjectProperty.marketActivityScore}/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Financial & Tax Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Investment Score</span>
                        <span className="text-sm">{subjectProperty.investmentScore}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Appreciation Rate</span>
                        <span className="text-sm">{subjectProperty.appreciationRate}%/yr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Market Score</span>
                        <span className="text-sm">{subjectProperty.marketScore}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Price per SqFt</span>
                        <span className="text-sm">${subjectPricePerSqFt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tax Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tax Rate</span>
                        <span className="text-sm">{subjectProperty.taxRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">vs. Market Average</span>
                        <span
                          className={getComparisonClass(
                            'taxRate',
                            subjectProperty.taxRate,
                            avgTaxRate,
                          )}
                        >
                          {formatPercentDiff(subjectProperty.taxRate, avgTaxRate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tax Score</span>
                        <span className="text-sm">
                          {Math.round(10 - subjectProperty.taxRate)}/10
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Investment Attractiveness Factors</CardTitle>
                <CardDescription>
                  Key factors affecting the investment potential of the subject property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">School Quality</span>
                      <span className="text-sm">{subjectProperty.schoolRating}/10</span>
                    </div>
                    <Progress value={subjectProperty.schoolRating * 10} className="h-2" />

                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Neighborhood Safety</span>
                      <span className="text-sm font-bold">
                        {subjectProperty.neighborhoodSafetyScore}/10
                      </span>
                    </div>
                    <Progress
                      value={subjectProperty.neighborhoodSafetyScore * 10}
                      className="h-2"
                    />

                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Property Condition</span>
                      <span className="text-sm font-bold">
                        {subjectProperty.propertyConditionScore}/10
                      </span>
                    </div>
                    <Progress value={subjectProperty.propertyConditionScore * 10} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Market Activity</span>
                      <span className="text-sm font-medium">
                        {subjectProperty.marketActivityScore}/10
                      </span>
                    </div>
                    <Progress value={subjectProperty.marketActivityScore * 10} className="h-2" />

                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Price Appreciation</span>
                      <span className="text-sm font-medium">
                        {Math.round(subjectProperty.appreciationRate)}/10
                      </span>
                    </div>
                    <Progress
                      value={Math.round(subjectProperty.appreciationRate) * 10}
                      className="h-2"
                    />

                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Tax Benefits</span>
                      <span className="text-sm font-medium">
                        {Math.round(10 - subjectProperty.taxRate)}/10
                      </span>
                    </div>
                    <Progress
                      value={Math.round(10 - subjectProperty.taxRate) * 10}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Market Score</span>
                      <span className="text-sm font-medium">{subjectProperty.marketScore}/10</span>
                    </div>
                    <Progress value={subjectProperty.marketScore * 10} className="h-2" />

                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Location Score</span>
                      <span className="text-sm font-medium">
                        {subjectProperty.locationScore}/10
                      </span>
                    </div>
                    <Progress value={subjectProperty.locationScore * 10} className="h-2" />

                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Overall Score</span>
                      <span className="text-sm font-medium">
                        {subjectProperty.investmentScore}/10
                      </span>
                    </div>
                    <Progress value={subjectProperty.investmentScore * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
