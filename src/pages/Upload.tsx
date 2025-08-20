import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { RootState } from '../store';
import { useToast } from '../hooks/use-toast';

const Upload = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'E-commerce'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const categories = [
    'E-commerce',
    'Social Media',
    'Mobile Apps',
    'Retail',
    'Healthcare',
    'Finance',
    'Travel',
    'Education',
    'Entertainment',
    'Other'
  ];

  // Redirect if not a seller
  if (!currentUser || currentUser.role !== 'Seller') {
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
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setUploadComplete(true);
      toast({
        title: "Upload successful!",
        description: "Your dataset has been uploaded and is being processed",
      });

      // Reset form after a delay
      setTimeout(() => {
        setFile(null);
        setFormData({ title: '', description: '', category: 'E-commerce' });
        setUploadComplete(false);
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your dataset",
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
          <p className="text-muted-foreground">Your dataset is being processed and will be available soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Dataset</h1>
          <p className="text-muted-foreground">
            Upload your CSV dataset for privacy-preserving processing and marketplace listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <div className="card-corporate">
                <h2 className="text-xl font-semibold text-foreground mb-6">File Upload</h2>
                
                {!file ? (
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Drag and drop your CSV file here
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      or click to browse and select a file
                    </p>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Only CSV files are supported
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">{file.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Dataset Metadata */}
                <div className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                      Dataset Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Enter a descriptive title for your dataset"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Describe your dataset, its contents, and potential use cases"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Info */}
            <div className="space-y-6">
              <div className="card-corporate">
                <h3 className="text-lg font-semibold text-foreground mb-4">Upload Guidelines</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>CSV format only</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Maximum file size: 100MB</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Data is automatically anonymized</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>GDPR compliant processing</span>
                  </li>
                </ul>
              </div>

              <div className="card-corporate">
                <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Protection</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your dataset will be processed using our advanced privacy engine:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personal identifiers removed</li>
                  <li>• Data anonymization applied</li>
                  <li>• Secure encryption throughout</li>
                  <li>• No reverse-engineering possible</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={!file || isUploading}
                className="btn-hero w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processing...' : 'Upload Dataset'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;