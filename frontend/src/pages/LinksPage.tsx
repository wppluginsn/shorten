import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Plus, Search, Filter } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import LinkCard from '../components/LinkCard';
import { Card, CardContent } from '../components/Card';
import { linkService } from '../services/link.service';
import { Link } from '../types';
import { toast } from '../components/useToast';

const LinksPage = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLinks();
  }, [currentPage]);

  const loadLinks = async () => {
    setIsLoading(true);
    try {
      const response = await linkService.getLinks(currentPage, 20);
      setLinks(response.links || []);
      setTotalPages(response.totalPages || 1);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load links',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (link: Link) => {
    // Navigate to edit page (you could create an EditLinkPage)
    navigate(`/analytics/${link.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      await linkService.deleteLink(id);
      toast({
        title: 'Deleted',
        description: 'Link has been deleted successfully',
        variant: 'success',
      });
      loadLinks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete link',
        variant: 'destructive',
      });
    }
  };

  const handleViewAnalytics = (id: string) => {
    navigate(`/analytics/${id}`);
  };

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      !searchQuery ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && link.isActive) ||
      (filterActive === 'inactive' && !link.isActive);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Links</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your shortened links
            </p>
          </div>
          <Button onClick={() => navigate('/create')}>
            <Plus className="h-5 w-5 mr-2" />
            Create New Link
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">All Links</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredLinks.length} of {links.length} links
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading links...</p>
          </div>
        )}

        {/* Links Grid */}
        {!isLoading && filteredLinks.length > 0 && (
          <div className="grid gap-6">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewAnalytics={handleViewAnalytics}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredLinks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Link2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No links found' : 'No links yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Create your first short link to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/create')}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Link
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinksPage;
