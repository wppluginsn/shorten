import { Link as LinkType } from '../types';
import { Card, CardContent } from './Card';
import Button from './Button';
import { Copy, ExternalLink, BarChart3, Edit, Trash2, Lock, Clock, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from './useToast';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface LinkCardProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onViewAnalytics: (id: string) => void;
}

const LinkCard = ({ link, onEdit, onDelete, onViewAnalytics }: LinkCardProps) => {
  const [showFullUrl, setShowFullUrl] = useState(false);
  const shortUrl = `${window.location.origin}/${link.shortCode}`;

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

  const truncateUrl = (url: string, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <Card hover className="transition-all">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {link.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{link.title}</h3>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            )}>
              {link.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          {/* Original URL */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {showFullUrl ? link.originalUrl : truncateUrl(link.originalUrl)}
            </span>
            {link.originalUrl.length > 50 && (
              <button
                onClick={() => setShowFullUrl(!showFullUrl)}
                className="text-blue-600 hover:underline flex-shrink-0"
              >
                {showFullUrl ? 'Less' : 'More'}
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span>{link.clickCount || 0} clicks</span>
            </div>
            {link.password && (
              <div className="flex items-center space-x-1">
                <Lock className="h-3 w-3" />
                <span>Password protected</span>
              </div>
            )}
            {link.expiresAt && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Expires {format(new Date(link.expiresAt), 'MMM d, yyyy')}</span>
              </div>
            )}
            {link.geoRules && link.geoRules.length > 0 && (
              <div className="flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <span>{link.geoRules[0].mode === 'block' ? 'Geo-blocked' : 'Geo-restricted'}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Created {format(new Date(link.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewAnalytics(link.id)}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(link)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(link.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
