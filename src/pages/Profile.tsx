import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Edit2, Save, X, Star } from 'lucide-react';
import { RootState } from '../store';
import { updateProfile } from '../store/userSlice';
import { useToast } from '../hooks/use-toast';
import { getUser, storeUser, AppUser } from '../utils/auth';

const Profile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access your profile.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: currentUser.name,
      email: currentUser.email
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    dispatch(updateProfile({
      name: editForm.name,
      email: editForm.email
    }));

    const storedUser = getUser();
    if (storedUser) {
      const updatedUser: AppUser = {
        ...storedUser,
        name: editForm.name,
        email: editForm.email,
      };
      storeUser(updatedUser);
    }

    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const isSeller = currentUser.role === 'seller';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card-corporate">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
                {!isEditing ? (
                  <button onClick={handleEdit} className="btn-outline inline-flex items-center"><Edit2 className="w-4 h-4 mr-2" />Edit Profile</button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={handleSave} className="btn-accent inline-flex items-center"><Save className="w-4 h-4 mr-2" />Save</button>
                    <button onClick={handleCancel} className="btn-outline inline-flex items-center"><X className="w-4 h-4 mr-2" />Cancel</button>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  {isEditing ? (
                    <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="text" name="name" value={editForm.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="Enter your full name" /></div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"><User className="w-5 h-5 text-muted-foreground" /><span className="text-foreground">{currentUser.name}</span></div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  {isEditing ? (
                    <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="email" name="email" value={editForm.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="Enter your email address" /></div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"><Mail className="w-5 h-5 text-muted-foreground" /><span className="text-foreground">{currentUser.email}</span></div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"><Shield className="w-5 h-5 text-muted-foreground" /><span className="text-foreground capitalize">{currentUser.role}</span><span className="text-xs text-muted-foreground ml-auto">Contact support to change account type</span></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Member Since</label>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"><Calendar className="w-5 h-5 text-muted-foreground" /><span className="text-foreground">{new Date(currentUser.joinedDate).toLocaleDateString()}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="card-corporate">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Account Status</span><span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-sm font-medium">Active</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Verification</span><span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-sm font-medium">Verified</span></div>
                {isSeller && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subscription</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium capitalize">{currentUser.subscription?.tier || 'None'}</span>
                  </div>
                )}
              </div>
            </div>
            {isSeller && (
                <div className="card-corporate">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Manage Subscription</h3>
                    <div className="space-y-3">
                        <Link to="/subscribe" className="btn-outline w-full text-center block">
                            View Plans
                        </Link>
                    </div>
                </div>
            )}
            {isSeller && (
              <div className="card-corporate">
                <h3 className="text-lg font-semibold text-foreground mb-4">Seller Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Datasets</span><span className="font-medium">...</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Views</span><span className="font-medium">...</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="font-medium">...</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
