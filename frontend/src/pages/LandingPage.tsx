import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Zap, Shield, BarChart3, Globe } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { Card, CardContent } from '../components/Card';
import { linkService } from '../services/link.service';
import { toast } from '../components/useToast';
import { useAuthStore } from '../store/auth.store';

const LandingPage = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: 'Error',
        description: 'Please enter a URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const link = await linkService.createPublicLink(url);
      const fullShortUrl = `${window.location.origin}/${link.shortCode}`;
      setShortUrl(fullShortUrl);
      toast({
        title: 'Success!',
        description: 'Your short link has been created',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create short link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Link2 className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Shorten URLs, Amplify Results
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create short, memorable links with advanced features like custom aliases, 
            password protection, geo-blocking, and detailed analytics.
          </p>

          {/* Quick Shortener Form */}
          <Card className="max-w-3xl mx-auto mb-20">
            <CardContent className="p-8">
              <form onSubmit={handleShorten} className="space-y-4">
                <Input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-lg"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Shorten URL
                </Button>
              </form>

              {shortUrl && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-2">Your shortened URL:</p>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={shortUrl}
                      readOnly
                      className="flex-1 bg-white"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                  </div>
                  {isAuthenticated && (
                    <p className="mt-3 text-sm text-gray-600">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:underline"
                      >
                        View in Dashboard
                      </button>
                    </p>
                  )}
                </div>
              )}

              {!isAuthenticated && (
                <p className="mt-6 text-sm text-gray-600">
                  Want advanced features?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Create a free account
                  </button>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card hover>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">
                  Create short links instantly with our optimized infrastructure
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Password Protection</h3>
                <p className="text-gray-600 text-sm">
                  Secure your links with password protection and expiration dates
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Detailed Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Track clicks, locations, devices, and more with comprehensive analytics
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Geo-Blocking</h3>
                <p className="text-gray-600 text-sm">
                  Control access by country with advanced geo-blocking rules
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          {!isAuthenticated && (
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Create an account and unlock all features for free
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
