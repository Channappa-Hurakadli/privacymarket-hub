import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { Upload, Database, TrendingUp, Users, Plus, Eye, Calendar, DollarSign } from 'lucide-react';

// Mock datasets for demonstration
const mockSellerDatasets = [
  {
    id: '1',
    title: 'E-commerce Customer Behavior Q3 2024',
    description: 'Anonymous shopping patterns and preferences from 50K users',
    category: 'E-commerce',
    uploads: 45200,
    revenue: 12500,
    views: 1240,
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Mobile App User Engagement Data',
    description: 'User interaction patterns across mobile shopping apps',
    category: 'Mobile',
    uploads: 32100,
    revenue: 8900,
    views: 892,
    uploadDate: '2024-02-03'
  }
];

const mockBuyerPurchases = [
  {
    id: '3',
    title: 'Social Media Marketing Insights',
    description: 'Consumer engagement patterns across social platforms',
    category: 'Social Media',
    seller: 'DataCorp Inc.',
    purchaseDate: '2024-02-20',
    insights: 'High engagement rates in Electronics category suggest 23% increase in conversion potential'
  },
  {
    id: '4',
    title: 'Retail Analytics Dataset',
    description: 'Seasonal shopping trends and consumer preferences',
    category: 'Retail',
    seller: 'Market Analytics Pro',
    purchaseDate: '2024-01-30',
    insights: 'Strong Electronics purchase interest detected with peak activity during weekend hours'
  }
];

const Dashboard = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const isSeller = currentUser.role === 'Seller';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-muted-foreground">
            {isSeller ? 'Manage your datasets and track performance' : 'Explore your purchased datasets and insights'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isSeller ? (
            <>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Datasets</p>
                    <p className="text-2xl font-bold text-foreground">{mockSellerDatasets.length}</p>
                  </div>
                  <Database className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${mockSellerDatasets.reduce((sum, dataset) => sum + dataset.revenue, 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Views</p>
                    <p className="text-2xl font-bold text-foreground">
                      {mockSellerDatasets.reduce((sum, dataset) => sum + dataset.views, 0).toLocaleString()}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Since</p>
                    <p className="text-2xl font-bold text-foreground">{currentUser.joinedDate}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Purchased Datasets</p>
                    <p className="text-2xl font-bold text-foreground">{mockBuyerPurchases.length}</p>
                  </div>
                  <Database className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Insights Generated</p>
                    <p className="text-2xl font-bold text-foreground">127</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Categories Explored</p>
                    <p className="text-2xl font-bold text-foreground">8</p>
                  </div>
                  <Users className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <div className="card-corporate">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Member Since</p>
                    <p className="text-2xl font-bold text-foreground">{currentUser.joinedDate}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Datasets/Purchases */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                {isSeller ? 'My Datasets' : 'My Purchases'}
              </h2>
              {isSeller && (
                <Link to="/upload" className="btn-accent inline-flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload New Dataset
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {isSeller ? (
                mockSellerDatasets.map((dataset) => (
                  <div key={dataset.id} className="card-dataset">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{dataset.title}</h3>
                        <p className="text-muted-foreground mb-3">{dataset.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">
                            {dataset.category}
                          </span>
                          <span>{dataset.views} views</span>
                          <span>${dataset.revenue} earned</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Uploaded</p>
                        <p className="font-medium">{dataset.uploadDate}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                mockBuyerPurchases.map((purchase) => (
                  <div key={purchase.id} className="card-dataset">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{purchase.title}</h3>
                        <p className="text-muted-foreground mb-2">{purchase.description}</p>
                        <p className="text-sm text-muted-foreground mb-3">by {purchase.seller}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">
                            {purchase.category}
                          </span>
                          <span>Purchased {purchase.purchaseDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Analytics/Quick Actions */}
          <div className="space-y-6">
            {!isSeller && (
              <div className="card-corporate">
                <h3 className="text-lg font-semibold text-foreground mb-4">Latest Insights</h3>
                <div className="space-y-4">
                  {mockBuyerPurchases.slice(0, 2).map((purchase) => (
                    <div key={purchase.id} className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">{purchase.title}</h4>
                      <p className="text-sm text-muted-foreground">{purchase.insights}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card-corporate">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isSeller ? (
                  <>
                    <Link to="/upload" className="btn-outline w-full text-center block">
                      Upload Dataset
                    </Link>
                    <Link to="/profile" className="btn-outline w-full text-center block">
                      Edit Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/marketplace" className="btn-outline w-full text-center block">
                      Browse Marketplace
                    </Link>
                    <Link to="/profile" className="btn-outline w-full text-center block">
                      Edit Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;