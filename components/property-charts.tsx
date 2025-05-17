import React from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts";

interface PropertyChartsProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function PropertyCharts({ propertyData, mlsData }: PropertyChartsProps) {
  // Skip if no data
  if (!propertyData && !mlsData) return null;

  // Format currency helper function
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format sale history data for price trend chart
  const priceHistoryData =
    (propertyData?.data as any)?.saleHistory
      ?.map((sale: { saleDate: string; saleAmount: number }) => ({
        date: new Date(sale.saleDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        price: sale.saleAmount,
      }))
      .reverse() || [];

  // Add current list price to history
  if (mlsData?.listPrice) {
    priceHistoryData.push({
      date: "Current",
      price: mlsData.listPrice,
    });
  }

  // Value breakdown data for pie chart
  const valueBreakdownData = [
    {
      name: "Land Value",
      value: (propertyData?.data as any)?.taxInfo?.assessedLandValue || 0,
      color: "#707070",
    },
    {
      name: "Improvement Value",
      value:
        (propertyData?.data as any)?.taxInfo?.assessedImprovementValue || 0,
      color: "#a0a0a0",
    },
  ];

  // Market analysis data for area chart
  const marketAnalysisData = [
    {
      name: "List Price",
      value: mlsData?.listPrice || 0,
      color: "#505050",
    },
    {
      name: "Assessed Value",
      value: (propertyData?.data as any)?.taxInfo?.assessedValue || 0,
      color: "#808080",
    },
    {
      name: "Estimated Value",
      value: (propertyData?.data as any)?.estimatedValue || 0,
      color: "#b0b0b0",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Price History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistoryData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#808080" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#808080" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#606060"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Value Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Value Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={valueBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value)}`
                  }
                >
                  {valueBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketAnalysisData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#707070" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#707070" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Type: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#505050"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
