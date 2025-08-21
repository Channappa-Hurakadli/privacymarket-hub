import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { RootState } from '../store';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Import the API service

const Upload = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Add price and isListed to the form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'E-commerce',
    price: '',
    isListed: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const categories = [
    'E-commerce', 'Social Media', 'Mobile Apps', 'Retail', 'Healthcare',
    'Finance', 'Travel', 'Education', 'Entertainment', 'Other'
  ];

  // Corrected role check to lowercase
  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Only sellers can upload datasets.</p>
        </div>
      </div>
    );
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => setFile(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: checked });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // This is the fully functional handleSubmit that sends data to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to upload", variant: "destructive" });
      return;
    }
    if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
      toast({ title: "Missing information", description: "Please fill in title, description, and price.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('price', formData.price);
    uploadFormData.append('isListed', String(formData.isListed));
    uploadFormData.append('category', formData.category);

    try {
      await api.post('/datasets/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUploadComplete(true);
      toast({
        title: "Upload successful!",
        description: "Your dataset has been uploaded and is being processed.",
      });

      setTimeout(() => navigate('/dashboard'), 2000);
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "There was an error uploading your dataset.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Complete!</h1>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Dataset</h1>
          <p className="text-muted-foreground">Upload your CSV dataset for privacy-preserving processing and marketplace listing</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card-corporate">
                <h2 className="text-xl font-semibold text-foreground mb-6">File Upload</h2>
                {!file ? (
                  <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                    <input type="file" accept=".csv" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Drag and drop your CSV file here</h3>
                    <p className="text-muted-foreground mb-4">or click to browse and select a file</p>
                    <div className="flex items-center justify-center text-sm text-muted-foreground"><AlertCircle className="w-4 h-4 mr-2" />Only CSV files are supported</div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">{file.name}</h3>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button type="button" onClick={removeFile} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                  </div>
                )}
                <div className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">Dataset Title *</label>
                    <input type="text" id="title" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="Enter a descriptive title for your dataset" />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">Description *</label>
                    <textarea id="description" name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none" placeholder="Describe your dataset, its contents, and potential use cases" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">Category *</label>
                    <select id="category" name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors">
                      {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
                    </select>
                  </div>
                  {/* Added Price and IsListed inputs to match the original UI style */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">Price ($) *</label>
                    <input type="number" id="price" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="0.00" />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                      <input type="checkbox" id="isListed" name="isListed" checked={formData.isListed} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="isListed" className="text-sm font-medium text-foreground">List this dataset on the marketplace immediately</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="card-corporate">
                <h3 className="text-lg font-semibold text-foreground mb-4">Upload Guidelines</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /><span>CSV format only</span></li>
                  <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /><span>Maximum file size: 10MB</span></li>
                  <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /><span>Data is automatically anonymized</span></li>
                  <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /><span>GDPR compliant processing</span></li>
                </ul>
              </div>
              <div className="card-corporate">
                <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Protection</h3>
                <p className="text-sm text-muted-foreground mb-4">Your dataset will be processed using our advanced privacy engine:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personal identifiers removed</li>
                  <li>• Data anonymization applied</li>
                  <li>• Secure encryption throughout</li>
                  <li>• No reverse-engineering possible</li>
                </ul>
              </div>
              <button type="submit" disabled={!file || isUploading} className="btn-hero w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploading ? 'Uploading...' : 'Upload Dataset'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
