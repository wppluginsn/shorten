import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, ShieldAlert } from 'lucide-react';
import Button from '../components/Button';
import { Card, CardContent } from '../components/Card';

const BlockedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reason = (location.state as any)?.reason || 'unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="text-center py-16 px-8">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {reason === 'geo-blocked' ? (
              <>
                This link is not available in your geographic location. The link owner has
                restricted access from your country or region.
              </>
            ) : (
              <>
                You don't have permission to access this link. Please contact the link owner
                if you believe this is an error.
              </>
            )}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-start space-x-3">
              <Globe className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Why am I seeing this?
                </h3>
                <p className="text-sm text-gray-600">
                  The owner of this short link has configured geographic restrictions
                  to control who can access it. This is a common security feature used
                  to protect sensitive content or comply with regional regulations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')} size="lg">
              Go to Homepage
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
            >
              Go Back
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you're the owner of this link, you can manage access restrictions from your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockedPage;
