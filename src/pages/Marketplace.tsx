import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, Database, User, Calendar, TrendingUp, Eye } from 'lucide-react';
import { RootState } from '../store';
import api from '../services/api';
import { useToast } from '../hooks/use-toast';

// Define the type for the data we expect from the backend
interface Seller {
  _id: string;
  name: string;
}
interface MarketplaceDataset {
  _id: string;
  title: string;
  description: string;
  price: number;
  seller: Seller;
  createdAt: string;
  category: string;
  views: number;
  dataPoints: number;
  featured: boolean; // This can be a future backend feature
  insights: string; // This can be a future backend feature
}

interface PreviewData {
  headers: string[];
  rows: Record<string, string>[];
}

const categories = ['All', 'E-commerce', 'Social Media', 'Mobile Apps', 'Retail', 'Healthcare', 'Finance', 'Travel', 'Education'];

const Marketplace = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { toast } = useToast();
  
  const [allDatasets, setAllDatasets] = useState<MarketplaceDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDataset, setSelectedDataset] = useState<MarketplaceDataset | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    const fetchMarketplaceData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/datasets/marketplace');
        // Add placeholder fields for UI elements not yet in backend
        const datasetsWithPlaceholders = response.data.map((d: any) => ({
          ...d,
          featured: d.featured || Math.random() > 0.7,
          insights: d.insights || 'Valuable insights based on this anonymized dataset.'
        }));
        setAllDatasets(datasetsWithPlaceholders);
      } catch (error: any) {
        toast({
          title: "Error fetching marketplace",
          description: error.response?.data?.message || "Could not load marketplace data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarketplaceData();
  }, [toast]);

  // Requirement #2: Fetch preview data when a dataset is clicked
  const handleDatasetClick = async (dataset: MarketplaceDataset) => {
    setSelectedDataset(dataset);
    setIsPreviewLoading(true);
    setPreviewData(null);
    try {
      const response = await api.get(`/datasets/${dataset._id}/preview`);
      setPreviewData(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Could not load dataset preview.", variant: "destructive" });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handlePurchase = async (dataset: MarketplaceDataset) => {
    try {
      await api.post(`/purchases/dataset/${dataset._id}`);
      toast({ title: "Purchase Successful!", description: `"${dataset.title}" has been added to your dashboard.` });
      setSelectedDataset(null);
      // Requirement #4: Remove the purchased dataset from the local state
      setAllDatasets(allDatasets.filter(d => d._id !== dataset._id));
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.response?.data?.message || "An error occurred during purchase.",
        variant: "destructive",
      });
    }
  };

  const filteredDatasets = allDatasets
    .filter(dataset => {
      const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || dataset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured': return (b.featured as any) - (a.featured as any);
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular': return b.views - a.views;
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Unchanged */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and purchase anonymized datasets for valuable marketing insights
          </p>
        </div>

        {/* Search and Filters - Unchanged */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Search datasets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="pl-10 pr-8 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors appearance-none min-w-[160px]">
                {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
              </select>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors min-w-[140px]">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dataset Grid - Now uses fetched data */}
        {isLoading ? (
          <div className="text-center py-12">Loading datasets...</div>
        ) : filteredDatasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredDatasets.map((dataset) => (
              <div key={dataset._id} onClick={() => handleDatasetClick(dataset)} className="card-dataset group">
                {dataset.featured && (<div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">Featured</div>)}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{dataset.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{dataset.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">{dataset.category}</span>
                    <span className="flex items-center"><Eye className="w-4 h-4 mr-1" />{dataset.views}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground"><User className="w-4 h-4 mr-1" /><span>{dataset.seller.name}</span></div>
                    <div className="flex items-center text-muted-foreground"><Calendar className="w-4 h-4 mr-1" /><span>{new Date(dataset.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-2xl font-bold text-foreground">${dataset.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Data Points</p>
                      <p className="font-semibold text-foreground">{dataset.dataPoints.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No datasets found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters to find relevant datasets.</p>
          </div>
        )}

        {/* Dataset Detail Modal - Now with live preview */}
        {selectedDataset && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-corporate max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedDataset.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{selectedDataset.category}</span>
                    <span className="flex items-center"><User className="w-4 h-4 mr-1" />{selectedDataset.seller.name}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedDataset(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedDataset.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><h4 className="font-medium text-foreground mb-1">Data Points</h4><p className="text-muted-foreground">{selectedDataset.dataPoints.toLocaleString()}</p></div>
                  <div><h4 className="font-medium text-foreground mb-1">Views</h4><p className="text-muted-foreground">{selectedDataset.views}</p></div>
                  <div><h4 className="font-medium text-foreground mb-1">Upload Date</h4><p className="text-muted-foreground">{new Date(selectedDataset.createdAt).toLocaleDateString()}</p></div>
                  <div><h4 className="font-medium text-foreground mb-1">Category</h4><p className="text-muted-foreground">{selectedDataset.category}</p></div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-accent" />Dataset Preview</h3>
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    {isPreviewLoading ? <p>Loading preview...</p> : previewData && previewData.rows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>{previewData.headers.map(h => <th key={h} className="p-2 text-left font-medium">{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {previewData.rows.map((row, i) => (
                              <tr key={i} className="border-t border-border">
                                {previewData.headers.map(h => <td key={h} className="p-2">{row[h]}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <p className="text-foreground">No preview available for this dataset.</p>}
                  </div>
                </div>
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Dataset Price</p>
                      <p className="text-3xl font-bold text-foreground">${selectedDataset.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => handlePurchase(selectedDataset)} className="btn-hero flex-1" disabled={!currentUser || currentUser.role !== 'buyer'}>
                      {!currentUser ? 'Login to Purchase' : currentUser.role !== 'buyer' ? 'Buyers Only' : 'Purchase Dataset'}
                    </button>
                    <button onClick={() => setSelectedDataset(null)} className="btn-outline px-6">Close</button>
                  </div>
                  {currentUser && currentUser.role !== 'buyer' && (<p className="text-sm text-muted-foreground mt-2">Only buyer accounts can purchase datasets.</p>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
