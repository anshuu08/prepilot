const ParentComponent = () => {
  const { data: insights, loading, error } = useFetch(fetchInsights);

  return <DashboardView insights={insights} loading={loading} error={error} />;
};

// Then in DashboardView:
const DashboardView = ({ insights, loading, error }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!insights || !insights.salaryData || insights.salaryData.length === 0) {

    return <div>No data available</div>;
  }

  const salaryRange = insights.salaryData.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
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
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: TrendingUp, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingUp, color: "text-red-500" };
      default:
        return { icon: TrendingUp, color: "text-gray-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(
    insights.marketOutlook
  );

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdates = formatDistanceToNow(new Date(insights.nextUpdates), {
    addSuffix: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last Updated: {lastUpdatedDate}</Badge>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Market Outlook</CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.marketOutlook}
            </div>
            <p className="text-xs text-muted-foreground">Next update {nextUdpatedDistance}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;