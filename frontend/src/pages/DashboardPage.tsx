import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, TrendingUp, MousePointerClick, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import StatsCard from '../components/StatsCard';
import Button from '../components/Button';
import { analyticsService } from '../services/analytics.service';
import { UserOverview } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { toast } from '../components/useToast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<UserOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getUserOverview();
      setOverview(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
          </div>
          <Button onClick={() => navigate('/create')}>
            <Plus className="h-5 w-5 mr-2" />
            Create Link
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Links"
            value={overview?.totalLinks || 0}
            icon={Link2}
          />
          <StatsCard
            title="Total Clicks"
            value={overview?.totalClicks || 0}
            icon={MousePointerClick}
          />
          <StatsCard
            title="Avg Clicks per Link"
            value={
              overview?.totalLinks && overview.totalLinks > 0
                ? Math.round(overview.totalClicks / overview.totalLinks)
                : 0
            }
            icon={TrendingUp}
          />
        </div>

        {/* Activity Chart */}
        {overview && overview.recentActivity && overview.recentActivity.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overview.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Links */}
        {overview && overview.topLinks && overview.topLinks.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Performing Links</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/links')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.topLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/analytics/${link.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      {link.title && (
                        <h4 className="font-medium text-gray-900 mb-1">{link.title}</h4>
                      )}
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-blue-600 font-mono">
                          {window.location.origin}/{link.shortCode}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{link.originalUrl}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{link.clicks}</p>
                        <p className="text-xs text-gray-500">clicks</p>
                      </div>
                      <MousePointerClick className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {overview && overview.totalLinks === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Link2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No links yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first short link to get started
              </p>
              <Button onClick={() => navigate('/create')}>
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
