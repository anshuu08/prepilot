"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Users, DollarSign } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DashboardView = ({ insights }) => {
  if (!insights) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600">No Industry Data Available</h3>
          <p className="text-sm text-gray-500 mt-2">
            Please complete your profile setup to view industry insights.
          </p>
        </div>
      </div>
    );
  }

  // Transform salary data for the chart
  const salaryChartData = insights.salaryRanges?.map((range) => ({
    role: range.role,
    min: Math.round(range.min / 1000),
    max: Math.round(range.max / 1000),
    median: Math.round(range.median / 1000),
    location: range.location,
  })) || [];

  const getDemandLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      case "neutral":
      default:
        return { icon: Activity, color: "text-yellow-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(
    insights.marketOutlook
  );

  const formatDate = (date) => {
    try {
      return format(new Date(date), "dd/MM/yyyy");
    } catch {
      return "N/A";
    }
  };

  const formatNextUpdate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Soon";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with last updated info */}
      <div className="flex justify-between items-center">
        <Badge variant="outline">
          Last Updated: {formatDate(insights.updatedAt || insights.createdAt)}
        </Badge>
        <Badge variant="secondary">
          Next Update: {formatNextUpdate(insights.nextUpdate)}
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Outlook */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.marketOutlook || "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* Growth Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate || 0}%
            </div>
          </CardContent>
        </Card>

        {/* Demand Level */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {insights.demandLevel || "Medium"}
              </div>
              <div className={`w-3 h-3 rounded-full ${getDemandLevelColor(insights.demandLevel)}`}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      {salaryChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Salary Ranges (in thousands)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`$${value}k`, name]}
                  labelFormatter={(label) => `Role: ${label}`}
                />
                <Legend />
                <Bar dataKey="min" fill="#8884d8" name="Minimum" />
                <Bar dataKey="median" fill="#82ca9d" name="Median" />
                <Bar dataKey="max" fill="#ffc658" name="Maximum" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Skills and Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Top Skills in Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills?.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              )) || <p className="text-gray-500">No skills data available</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills?.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              )) || <p className="text-gray-500">No recommendations available</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Key Industry Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.keyTrends?.map((trend, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">{trend}</p>
              </div>
            )) || <p className="text-gray-500">No trends data available</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;