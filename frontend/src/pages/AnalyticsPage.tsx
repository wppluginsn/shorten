import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  Monitor,
  TrendingUp,
} from 'lucide-react';
import Button from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import StatsCard from '../components/StatsCard';
import { analyticsService } from '../services/analytics.service';
import { linkService } from '../services/link.service';
import { Analytics, Link } from '../types';
import { toast } from '../components/useToast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const AnalyticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<Link | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const [linkData, analyticsData] = await Promise.all([
        linkService.getLink(id),
        analyticsService.getLinkAnalytics(id),
      ]);
      setLink(linkData);
      setAnalytics(analyticsData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load analytics',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Short URL copied to clipboard',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!link || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">Link not found</p>
            <Button onClick={() => navigate('/links')}>Back to Links</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/links')} className="mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Links
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {link.title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{link.title}</h1>
              )}
              <div className="flex items-center space-x-3 mb-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-lg font-medium"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ExternalLink className="h-4 w-4" />
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {link.originalUrl}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Clicks"
            value={analytics.totalClicks}
            icon={TrendingUp}
          />
          <StatsCard
            title="Countries"
            value={analytics.clicksByCountry.length}
            icon={Globe}
          />
          <StatsCard
            title="Devices"
            value={analytics.clicksByDevice.length}
            icon={Monitor}
          />
        </div>

        {/* Clicks Over Time */}
        {analytics.clicksOverTime && analytics.clicksOverTime.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.clicksOverTime}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Clicks by Country */}
          {analytics.clicksByCountry && analytics.clicksByCountry.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.clicksByCountry.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="countryCode" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Clicks by Device */}
          {analytics.clicksByDevice && analytics.clicksByDevice.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.clicksByDevice}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percent }) =>
                        `${device} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.clicksByDevice.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Clicks by Browser */}
        {analytics.clicksByBrowser && analytics.clicksByBrowser.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Browsers</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.clicksByBrowser}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="browser" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Clicks */}
        {analytics.recentClicks && analytics.recentClicks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentClicks.slice(0, 10).map((click) => (
                  <div
                    key={click.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center space-x-2 text-sm">
                          {click.country && (
                            <span className="font-medium">
                              {click.country} ({click.countryCode})
                            </span>
                          )}
                          {click.city && <span className="text-gray-500">• {click.city}</span>}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          {click.device && <span>{click.device}</span>}
                          {click.browser && <span>• {click.browser}</span>}
                          {click.os && <span>• {click.os}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {format(new Date(click.clickedAt), 'MMM d, h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {analytics.totalClicks === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No clicks yet
              </h3>
              <p className="text-gray-600 mb-6">
                Share your link to start collecting analytics data
              </p>
              <Button onClick={() => copyToClipboard(shortUrl)}>
                <Copy className="h-5 w-5 mr-2" />
                Copy Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
