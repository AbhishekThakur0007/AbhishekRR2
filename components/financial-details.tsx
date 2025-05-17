import React from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  Receipt,
  Building,
  TrendingUp,
  Scale,
  Clock,
  Calculator,
  DollarSign,
  Home,
  Percent,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Landmark,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FinancialDetailsProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function FinancialDetails({
  propertyData,
  mlsData,
}: FinancialDetailsProps) {
  // Skip if no data
  if (!propertyData && !mlsData) {
    return null;
  }

  // Format currency
  const formatCurrency = (value?: number | null): string => {
    if (value == null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString || "N/A";
    }
  };

  // Extract price information
  const listPrice = mlsData?.listPrice ?? propertyData?.data?.mlsListingPrice;
  const lastSalePrice = propertyData?.data?.lastSale?.saleAmount;
  const lastSaleDate = propertyData?.data?.lastSale?.saleDate;
  const estimatedValue = propertyData?.data?.estimatedValue;
  const taxAssessedValue = propertyData?.data?.taxInfo?.assessedValue;
  const marketValue = propertyData?.data?.taxInfo?.marketValue;
  const taxYear = propertyData?.data?.taxInfo?.year;
  const taxAmount = propertyData?.data?.taxInfo?.taxAmount;

  // Mortgage info
  const currentMortgage = propertyData?.data?.currentMortgages?.[0];
  const mortgageAmount = currentMortgage?.amount;
  const mortgageDate = currentMortgage?.documentDate;
  const mortgageLender = currentMortgage?.lenderName;
  const mortgageRate = currentMortgage?.interestRate;
  const mortgageTerm = currentMortgage?.term;
  const mortgageType = currentMortgage?.loanType;

  // Equity info
  const equity = propertyData?.data?.equity;
  const equityPercent = propertyData?.data?.equityPercent;
  const estimatedEquity = propertyData?.data?.estimatedEquity;
  const estimatedMortgageBalance = propertyData?.data?.estimatedMortgageBalance;

  // Price history
  const priceChanges = mlsData?.price_changes || [];
  const statusChanges = mlsData?.status_changes || [];

  // Check if we have enough data to show
  const hasPriceData = listPrice || lastSalePrice || estimatedValue;
  const hasTaxData = taxAssessedValue || taxAmount || taxYear;
  const hasMortgageData = mortgageAmount || mortgageLender || mortgageRate;
  const hasEquityData = equity || equityPercent || estimatedEquity;
  const hasPriceHistory = priceChanges.length > 0 || statusChanges.length > 0;

  if (!hasPriceData && !hasTaxData && !hasMortgageData && !hasEquityData) {
    return null;
  }

  // Calculate estimated monthly mortgage payment using real data and common terms
  const calculateMonthlyPayment = (): string => {
    const price = listPrice || estimatedValue || 0;
    if (!price) return "N/A";

    // Use actual mortgage rate if available, otherwise use current market rate
    const currentRate = mortgageRate || 6.5; // Current market rate as of 2024
    const downPaymentPercent = 20; // Standard down payment percentage
    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    const interestRate = currentRate / 12 / 100; // Monthly interest rate
    const term = mortgageTerm || 360; // Use actual term or standard 30-year (360 months)

    // Monthly payment calculation: P = L[i(1+i)^n]/[(1+i)^n-1]
    const payment =
      (loanAmount * (interestRate * Math.pow(1 + interestRate, term))) /
      (Math.pow(1 + interestRate, term) - 1);

    return formatCurrency(payment);
  };

  // Calculate estimated insurance based on property value and location
  const calculateEstimatedInsurance = (): string => {
    const price = listPrice || estimatedValue || 0;
    if (!price) return "N/A";

    // Insurance typically costs 0.25% to 0.33% of home value annually
    const insuranceRate = 0.003; // Using 0.3% as a common rate
    const annualInsurance = price * insuranceRate;
    return formatCurrency(annualInsurance / 12); // Monthly insurance
  };

  // Calculate PMI if down payment is less than 20%
  const calculatePMI = (): string => {
    const price = listPrice || estimatedValue || 0;
    if (!price) return "N/A";

    // PMI typically costs 0.5% to 1% of loan amount annually
    const pmiRate = 0.008; // Using 0.8% as a common rate
    const downPaymentPercent = 20; // Standard down payment percentage
    const loanAmount = price * (1 - downPaymentPercent / 100);
    const annualPMI = loanAmount * pmiRate;
    return formatCurrency(annualPMI / 12); // Monthly PMI
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Financial Details
      </h2>

      {/* Price Overview */}
      {hasPriceData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-primary" />
              <span>Price Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listPrice && (
                <div>
                  <p className="text-sm font-medium mb-1">List Price</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(listPrice)}
                  </p>
                  {mlsData?.daysOnMarket && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {mlsData.daysOnMarket} days on market
                    </p>
                  )}
                </div>
              )}

              {estimatedValue && (
                <div>
                  <p className="text-sm font-medium mb-1">Estimated Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(estimatedValue)}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 cursor-help">
                          <TrendingUp className="h-3 w-3" />
                          Automated valuation
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          This is an automated valuation based on comparable
                          properties, location, and market trends.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {lastSalePrice && (
              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-sm font-medium mb-1">Last Sale</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold">
                    {formatCurrency(lastSalePrice)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    on {formatDate(lastSaleDate)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tax Assessment */}
      {hasTaxData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <span>Tax Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxAssessedValue && (
                <div>
                  <p className="text-sm font-medium mb-1">Assessed Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(taxAssessedValue)}
                  </p>
                  {taxYear && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Assessment Year: {taxYear}
                    </p>
                  )}
                </div>
              )}

              {marketValue && marketValue !== taxAssessedValue && (
                <div>
                  <p className="text-sm font-medium mb-1">Market Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(marketValue)}
                  </p>
                  {taxYear && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Assessment Year: {taxYear}
                    </p>
                  )}
                </div>
              )}
            </div>

            {taxAmount && (
              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-sm font-medium mb-1">
                  Annual Property Taxes
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(parseFloat(taxAmount))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${Math.round(parseFloat(taxAmount) / 12)} estimated monthly
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Mortgage */}
      {hasMortgageData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <span>Current Mortgage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mortgageAmount && (
                <div>
                  <p className="text-sm font-medium mb-1">
                    Original Loan Amount
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(mortgageAmount)}
                  </p>
                  {mortgageDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Origination Date: {formatDate(mortgageDate)}
                    </p>
                  )}
                </div>
              )}

              {mortgageLender && (
                <div>
                  <p className="text-sm font-medium mb-1">Lender</p>
                  <p className="text-lg font-medium">{mortgageLender}</p>
                  {mortgageType && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Type: {mortgageType}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mortgageRate && (
                  <div>
                    <p className="text-sm font-medium mb-1">Interest Rate</p>
                    <p className="text-lg font-bold">{mortgageRate}%</p>
                  </div>
                )}

                {mortgageTerm && (
                  <div>
                    <p className="text-sm font-medium mb-1">Loan Term</p>
                    <p className="text-lg font-bold">{mortgageTerm} months</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equity Analysis */}
      {hasEquityData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              <span>Equity Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {equity && (
                <div>
                  <p className="text-sm font-medium mb-1">Current Equity</p>
                  <p className="text-2xl font-bold">{formatCurrency(equity)}</p>
                  {equityPercent && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {equityPercent}% of property value
                    </p>
                  )}
                </div>
              )}

              {estimatedEquity && (
                <div>
                  <p className="text-sm font-medium mb-1">Estimated Equity</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(estimatedEquity)}
                  </p>
                  {estimatedMortgageBalance && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Remaining Balance:{" "}
                      {formatCurrency(parseFloat(estimatedMortgageBalance))}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price History */}
      {hasPriceHistory && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Price History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priceChanges.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Changes</h3>
                  <div className="space-y-2">
                    {priceChanges.map((change, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {change.direction === "up" ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <span>{formatDate(change.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatCurrency(change.price)}
                          </span>
                          <span className="text-muted-foreground">
                            ({change.direction === "up" ? "+" : "-"}
                            {formatCurrency(change.change_amount)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statusChanges.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Status Changes</h3>
                  <div className="space-y-2">
                    {statusChanges.map((change, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{formatDate(change.date)}</span>
                        <span className="font-medium">{change.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mortgage Calculator */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span>Estimated Monthly Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-1">
                Estimated Monthly Payment
              </p>
              <p className="text-2xl font-bold">{calculateMonthlyPayment()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on 30-year fixed rate at 6% with 20% down
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Property Price</p>
              <p className="text-lg font-bold">
                {formatCurrency(listPrice || estimatedValue || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Down payment:{" "}
                {formatCurrency((listPrice || estimatedValue || 0) * 0.2)}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-muted/50 p-4 rounded-md">
            <p className="text-sm font-medium">Payment Breakdown</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Principal & Interest
                </p>
                <p className="text-sm font-medium">
                  {calculateMonthlyPayment()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Property Taxes</p>
                <p className="text-sm font-medium">
                  {taxAmount
                    ? `$${Math.round(parseFloat(taxAmount) / 12)}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Home Insurance</p>
                <p className="text-sm font-medium">
                  {calculateEstimatedInsurance()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">PMI</p>
                <p className="text-sm font-medium">{calculatePMI()}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              * This is an estimated payment calculator based on current market
              rates and standard terms. Your actual payment may vary based on
              your credit score, down payment, and lender. Contact a mortgage
              professional for a more accurate estimate.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
