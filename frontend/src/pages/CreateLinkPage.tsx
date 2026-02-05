import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link2, Lock, Globe, Info } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import CountrySelector from '../components/CountrySelector';
import { linkService } from '../services/link.service';
import { CreateLinkRequest } from '../types';
import { toast } from '../components/useToast';

interface CreateLinkFormData {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  password?: string;
  expiresAt?: string;
}

const CreateLinkPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [enableGeoBlocking, setEnableGeoBlocking] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [geoMode, setGeoMode] = useState<'allow' | 'block'>('block');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLinkFormData>();

  const onSubmit = async (data: CreateLinkFormData) => {
    setIsLoading(true);
    try {
      const payload: CreateLinkRequest = {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        title: data.title || undefined,
        password: data.password || undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      };

      if (enableGeoBlocking && selectedCountries.length > 0) {
        payload.geoRules = {
          countryCodes: selectedCountries,
          mode: geoMode,
        };
      }

      const link = await linkService.createLink(payload);
      toast({
        title: 'Success!',
        description: 'Your short link has been created',
        variant: 'success',
      });
      navigate(`/analytics/${link.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Short Link</h1>
          <p className="text-gray-600 mt-1">
            Create a short link with advanced features and customization options
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link2 className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the URL you want to shorten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="Original URL *"
                  type="url"
                  placeholder="https://example.com/very-long-url"
                  {...register('originalUrl', {
                    required: 'URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Please enter a valid URL starting with http:// or https://',
                    },
                  })}
                  error={errors.originalUrl?.message}
                />
              </div>

              <div>
                <Input
                  label="Title (Optional)"
                  type="text"
                  placeholder="My awesome link"
                  {...register('title')}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Give your link a memorable title for easy identification
                </p>
              </div>

              <div>
                <Input
                  label="Custom Alias (Optional)"
                  type="text"
                  placeholder="my-custom-alias"
                  {...register('customAlias', {
                    pattern: {
                      value: /^[a-zA-Z0-9-_]+$/,
                      message: 'Only letters, numbers, hyphens, and underscores allowed',
                    },
                    minLength: {
                      value: 3,
                      message: 'Alias must be at least 3 characters',
                    },
                  })}
                  error={errors.customAlias?.message}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Create a custom short code instead of a random one
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security & Expiration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security & Expiration
              </CardTitle>
              <CardDescription>Add password protection and expiration date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="Password Protection (Optional)"
                  type="password"
                  placeholder="Enter a password"
                  {...register('password', {
                    minLength: {
                      value: 4,
                      message: 'Password must be at least 4 characters',
                    },
                  })}
                  error={errors.password?.message}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Users will need to enter this password to access the link
                </p>
              </div>

              <div>
                <Input
                  label="Expiration Date (Optional)"
                  type="datetime-local"
                  {...register('expiresAt')}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Link will automatically expire at this date and time
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Geo-Blocking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Geographic Restrictions
              </CardTitle>
              <CardDescription>Control access based on visitor location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableGeoBlocking"
                  checked={enableGeoBlocking}
                  onChange={(e) => setEnableGeoBlocking(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="enableGeoBlocking" className="text-sm font-medium text-gray-700">
                  Enable geo-blocking
                </label>
              </div>

              {enableGeoBlocking && (
                <CountrySelector
                  selectedCountries={selectedCountries}
                  onChange={setSelectedCountries}
                  mode={geoMode}
                  onModeChange={setGeoMode}
                />
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Link
            </Button>
          </div>
        </form>

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  Custom aliases make your links more memorable and brand-friendly. 
                  Use geo-blocking to target specific regions or protect sensitive content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateLinkPage;
