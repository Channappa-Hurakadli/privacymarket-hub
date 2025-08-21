import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { Database, TrendingUp, Users, Plus, Eye, Calendar, DollarSign, ToggleLeft, ToggleRight, Download } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../hooks/use-toast';

// Interfaces for data shapes
interface MyDataset {
  _id: string;
  title: string;
  description: string;
  price: number;
  isListed: boolean;
  createdAt: string;
  category: string;
  views: number;
  status: 'processing' | 'anonymized' | 'failed';
  originalFileName: string;
}
interface PurchasedDataset {
  _id: string;
  dataset: {
    _id: string;
    title: string;
    description: string;
    originalFileName: string;
    category: string;
    seller: { name: string; };
  };
  purchaseDate: string;
}
interface PreviewData {
  headers: string[];
  rows: Record<string, string>[];
}

const Dashboard = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [myDatasets, setMyDatasets] = useState<MyDataset[]>([]);
  const [purchasedDatasets, setPurchasedDatasets] = useState<PurchasedDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [stats, setStats] = useState({ totalRevenue: 0, totalDatasets: 0 });
  const [selectedPurchase, setSelectedPurchase] = useState<PurchasedDataset | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  // FIX: Added the missing state for the anonymized datasets modal
  const [isAnonymizedModalOpen, setIsAnonymizedModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (currentUser?.role === 'seller') {
          const [datasetsRes, statsRes] = await Promise.all([
            api.get('/datasets/my-datasets'),
            api.get('/seller/stats')
          ]);
          setMyDatasets(datasetsRes.data);
          setStats(statsRes.data);
        } else if (currentUser?.role === 'buyer') {
          const response = await api.get('/purchases/my-purchases');
          setPurchasedDatasets(response.data);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.response?.data?.message || "Could not load your dashboard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, toast]);
  
  const handleToggleListing = async (dataset: MyDataset) => {
    if (!dataset.isListed) {
      const confirmPayment = window.confirm("Listing this dataset requires a one-time fee. Do you want to proceed?");
      if (!confirmPayment) return;
    }

    try {
      const newStatus = !dataset.isListed;
      await api.patch(`/datasets/${dataset._id}/list`, { isListed: newStatus });
      setMyDatasets(myDatasets.map(d => d._id === dataset._id ? { ...d, isListed: newStatus } : d));
      toast({ title: "Success", description: `Dataset has been ${newStatus ? 'listed' : 'unlisted'}.` });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.response?.data?.message || "Could not update listing.", variant: "destructive" });
    }
  };

  const handleDownload = async (datasetId: string, fileName: string, isAnonymized: boolean) => {
    const url = isAnonymized ? `/datasets/${datasetId}/download-anonymized` : `/datasets/${datasetId}/download`;
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      toast({ title: "Download Failed", description: error.response?.data?.message || "Could not download file.", variant: "destructive" });
    }
  };

  const handleViewClick = async (purchase: PurchasedDataset) => {
    setSelectedPurchase(purchase);
    setIsPreviewLoading(true);
    setPreviewData(null);
    try {
      const response = await api.get(`/datasets/${purchase.dataset._id}/preview`);
      setPreviewData(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Could not load dataset preview.", variant: "destructive" });
    } finally {
      setIsPreviewLoading(false);
    }
  };

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

  const isSeller = currentUser.role === 'seller';
  const anonymizedDatasets = myDatasets.filter(d => d.status === 'anonymized');

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {currentUser.name}</h1>
          <p className="text-muted-foreground">{isSeller ? 'Manage your datasets and track performance' : 'Explore your purchased datasets and insights'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isSeller ? (
            <>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Total Datasets</p><p className="text-2xl font-bold text-foreground">{isLoading ? '...' : myDatasets.length}</p></div><Database className="w-8 h-8 text-primary" /></div></div>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Total Revenue</p><p className="text-2xl font-bold text-foreground">${isLoading ? '...' : stats.totalRevenue.toLocaleString()}</p></div><DollarSign className="w-8 h-8 text-accent" /></div></div>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Total Views</p><p className="text-2xl font-bold text-foreground">{isLoading ? '...' : myDatasets.reduce((sum, ds) => sum + (ds.views || 0), 0)}</p></div><Eye className="w-8 h-8 text-secondary" /></div></div>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Active Since</p><p className="text-2xl font-bold text-foreground">{new Date(currentUser.joinedDate).toLocaleDateString()}</p></div><Calendar className="w-8 h-8 text-primary" /></div></div>
            </>
          ) : (
            <>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Purchased Datasets</p><p className="text-2xl font-bold text-foreground">{isLoading ? '...' : purchasedDatasets.length}</p></div><Database className="w-8 h-8 text-primary" /></div></div>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Insights Generated</p><p className="text-2xl font-bold text-foreground">127</p></div><TrendingUp className="w-8 h-8 text-accent" /></div></div>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Categories Explored</p><p className="text-2xl font-bold text-foreground">8</p></div><Users className="w-8 h-8 text-secondary" /></div></div>
              <div className="card-corporate"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Member Since</p><p className="text-2xl font-bold text-foreground">{new Date(currentUser.joinedDate).toLocaleDateString()}</p></div><Calendar className="w-8 h-8 text-primary" /></div></div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-semibold text-foreground">{isSeller ? 'My Datasets' : 'My Purchases'}</h2>{isSeller && (<Link to="/upload" className="btn-accent inline-flex items-center"><Plus className="w-4 h-4 mr-2" />Upload New Dataset</Link>)}</div>
            <div className="space-y-4">
              {isLoading ? <p>Loading your data...</p> : isSeller ? (
                myDatasets.length > 0 ? myDatasets.map((dataset) => (
                  <div key={dataset._id} className="card-dataset">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{dataset.title}</h3>
                        <p className="text-muted-foreground mb-3">{dataset.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">{dataset.category}</span>
                          <span>{dataset.views} views</span>
                          <span>${dataset.price} earned</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Uploaded</p>
                        <p className="font-medium">{new Date(dataset.createdAt).toLocaleDateString()}</p>
                        <button onClick={() => handleToggleListing(dataset)} className="flex items-center text-sm font-medium text-primary hover:underline mt-2 ml-auto">
                          {dataset.isListed ? <ToggleRight className="w-5 h-5 mr-1 text-green-500"/> : <ToggleLeft className="w-5 h-5 mr-1 text-gray-400"/>}
                          {dataset.isListed ? 'Listed' : 'Unlisted'}
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (<div className="text-center py-12"><Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-medium text-foreground mb-2">No datasets uploaded</h3><p className="text-muted-foreground"><Link to="/upload" className="text-primary hover:underline">Upload your first dataset</Link> to get started.</p></div>)
              ) : (
                purchasedDatasets.length > 0 ? purchasedDatasets.map((purchase) => (
                  <div key={purchase._id} className="card-dataset">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{purchase.dataset.title}</h3>
                        <p className="text-muted-foreground mb-2">{purchase.dataset.description}</p>
                        <p className="text-sm text-muted-foreground mb-3">by {purchase.dataset.seller.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">{purchase.dataset.category}</span>
                          <span>Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end space-y-2">
                        <button onClick={() => handleViewClick(purchase)} className="btn-outline inline-flex items-center text-sm"><Eye className="w-4 h-4 mr-2" /> View</button>
                        <button onClick={() => handleDownload(purchase.dataset._id, purchase.dataset.originalFileName, false)} className="btn-accent inline-flex items-center text-sm"><Download className="w-4 h-4 mr-2" /> Export</button>
                      </div>
                    </div>
                  </div>
                )) : (<p>You have not purchased any datasets yet.</p>)
              )}
            </div>
          </div>

          <div className="space-y-6">
            {!isSeller && (
              <div className="card-corporate">
                <h3 className="text-lg font-semibold text-foreground mb-4">Latest Insights</h3>
                <div className="space-y-4">
                  {purchasedDatasets.slice(0, 2).map((purchase) => (
                    <div key={purchase._id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => handleViewClick(purchase)}>
                      <h4 className="font-medium text-foreground mb-2">{purchase.dataset.title}</h4>
                      <p className="text-sm text-muted-foreground">Click to view insights...</p>
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
                    <Link to="/upload" className="btn-outline w-full text-center block">Upload Dataset</Link>
                    <button onClick={() => setIsAnonymizedModalOpen(true)} className="btn-outline w-full text-center block">View Anonymized Datasets</button>
                    <Link to="/profile" className="btn-outline w-full text-center block">Edit Profile</Link>
                  </>
                ) : (
                  <>
                    <Link to="/marketplace" className="btn-outline w-full text-center block">Browse Marketplace</Link>
                    <Link to="/profile" className="btn-outline w-full text-center block">Edit Profile</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {selectedPurchase && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPurchase(null)}>
            <div className="card-corporate max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">{selectedPurchase.dataset.title}</h2>
                <button onClick={() => setSelectedPurchase(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">X</button>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Dataset Preview</h3>
                {isPreviewLoading ? <p>Loading preview...</p> : previewData && previewData.rows.length > 0 ? (
                  <div className="overflow-x-auto border border-border rounded-lg">
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
                ) : <p>No preview available.</p>}
              </div>
            </div>
          </div>
        )}

        {isAnonymizedModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsAnonymizedModalOpen(false)}>
            <div className="card-corporate max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Anonymized Datasets</h2>
                <button onClick={() => setIsAnonymizedModalOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">X</button>
              </div>
              <div className="space-y-4">
                {anonymizedDatasets.length > 0 ? anonymizedDatasets.map(dataset => (
                  <div key={dataset._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{dataset.title}</p>
                      <p className="text-sm text-muted-foreground">{dataset.originalFileName}</p>
                    </div>
                    <button onClick={() => handleDownload(dataset._id, `anonymized_${dataset.originalFileName}`, true)} className="btn-accent inline-flex items-center text-sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )) : <p>You have no anonymized datasets ready for download.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
