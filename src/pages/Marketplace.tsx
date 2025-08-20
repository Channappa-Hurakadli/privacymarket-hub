import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, Database, User, Calendar, TrendingUp, Eye } from 'lucide-react';
import { RootState } from '../store';

// Mock datasets for the marketplace
const mockDatasets = [
  {
    id: '1',
    title: 'E-commerce Customer Behavior Q3 2024',
    description: 'Anonymous shopping patterns and preferences from 50K users across multiple product categories. Includes purchase history, browsing behavior, and seasonal trends.',
    category: 'E-commerce',
    seller: 'DataCorp Inc.',
    price: 2500,
    views: 1240,
    uploadDate: '2024-01-15',
    insights: 'Strong Electronics purchase interest detected with 23% conversion rate increase potential during weekend hours',
    dataPoints: 50000,
    featured: true
  },
  {
    id: '2',
    title: 'Mobile App User Engagement Data',
    description: 'User interaction patterns across mobile shopping apps including session duration, feature usage, and retention metrics.',
    category: 'Mobile Apps',
    seller: 'AppAnalytics Pro',
    price: 1800,
    views: 892,
    uploadDate: '2024-02-03',
    insights: 'High engagement rates in Electronics category suggest significant market opportunity',
    dataPoints: 32000,
    featured: false
  },
  {
    id: '3',
    title: 'Social Media Marketing Insights',
    description: 'Consumer engagement patterns across social platforms with anonymized demographic and behavioral data.',
    category: 'Social Media',
    seller: 'Social Insights Ltd.',
    price: 3200,
    views: 1580,
    uploadDate: '2024-01-28',
    insights: 'Peak engagement occurs during evening hours with 45% higher conversion rates',
    dataPoints: 78000,
    featured: true
  },
  {
    id: '4',
    title: 'Retail Analytics Dataset',
    description: 'Seasonal shopping trends and consumer preferences from major retail chains with complete anonymization.',
    category: 'Retail',
    seller: 'Market Analytics Pro',
    price: 2100,
    views: 654,
    uploadDate: '2024-02-10',
    insights: 'Seasonal patterns show 67% increase in Electronics purchases during holiday seasons',
    dataPoints: 41000,
    featured: false
  },
  {
    id: '5',
    title: 'Healthcare Consumer Behavior',
    description: 'Anonymous healthcare service usage patterns and consumer preferences in the digital health sector.',
    category: 'Healthcare',
    seller: 'HealthData Insights',
    price: 4500,
    views: 423,
    uploadDate: '2024-01-20',
    insights: 'Digital health adoption accelerated by 156% with strong mobile preference',
    dataPoints: 29000,
    featured: false
  },
  {
    id: '6',
    title: 'Financial Services Analytics',
    description: 'Consumer financial behavior patterns and preferences in digital banking and fintech services.',
    category: 'Finance',
    seller: 'FinTech Data Solutions',
    price: 3800,
    views: 789,
    uploadDate: '2024-02-01',
    insights: 'Mobile banking usage increased 89% with preference for contactless transactions',
    dataPoints: 55000,
    featured: true
  }
];

const categories = ['All', 'E-commerce', 'Social Media', 'Mobile Apps', 'Retail', 'Healthcare', 'Finance', 'Travel', 'Education'];

const Marketplace = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedDataset, setSelectedDataset] = useState<typeof mockDatasets[0] | null>(null);

  // Filter and sort datasets
  let filteredDatasets = mockDatasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort datasets
  filteredDatasets = filteredDatasets.sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return b.featured ? 1 : -1;
      case 'newest':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'popular':
        return b.views - a.views;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleDatasetClick = (dataset: typeof mockDatasets[0]) => {
    setSelectedDataset(dataset);
  };

  const handlePurchase = (dataset: typeof mockDatasets[0]) => {
    // In a real app, this would integrate with payment processing
    alert(`Dataset "${dataset.title}" purchased for $${dataset.price.toLocaleString()}! Check your dashboard for analytics.`);
    setSelectedDataset(null);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and purchase anonymized datasets for valuable marketing insights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors appearance-none min-w-[160px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors min-w-[140px]"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              onClick={() => handleDatasetClick(dataset)}
              className="card-dataset group"
            >
              {dataset.featured && (
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {dataset.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                  {dataset.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {dataset.category}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {dataset.views}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    <span>{dataset.seller}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{dataset.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${dataset.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Data Points</p>
                    <p className="font-semibold text-foreground">
                      {dataset.dataPoints.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No datasets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find relevant datasets.
            </p>
          </div>
        )}

        {/* Dataset Detail Modal */}
        {selectedDataset && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-corporate max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {selectedDataset.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {selectedDataset.category}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedDataset.seller}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDataset(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedDataset.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Data Points</h4>
                    <p className="text-muted-foreground">{selectedDataset.dataPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Views</h4>
                    <p className="text-muted-foreground">{selectedDataset.views}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Upload Date</h4>
                    <p className="text-muted-foreground">{selectedDataset.uploadDate}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Category</h4>
                    <p className="text-muted-foreground">{selectedDataset.category}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                    AI-Generated Insights
                  </h3>
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <p className="text-foreground">{selectedDataset.insights}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Dataset Price</p>
                      <p className="text-3xl font-bold text-foreground">
                        ${selectedDataset.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handlePurchase(selectedDataset)}
                      className="btn-hero flex-1"
                      disabled={!currentUser || currentUser.role !== 'Buyer'}
                    >
                      {!currentUser ? 'Login to Purchase' : 
                       currentUser.role !== 'Buyer' ? 'Buyers Only' : 
                       'Purchase Dataset'}
                    </button>
                    <button
                      onClick={() => setSelectedDataset(null)}
                      className="btn-outline px-6"
                    >
                      Close
                    </button>
                  </div>
                  
                  {currentUser && currentUser.role !== 'Buyer' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Only buyer accounts can purchase datasets.
                    </p>
                  )}
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