import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateSubscription } from '../store/userSlice';
import { storeUser, getUser } from '../utils/auth';
import api from '../services/api';
import { useToast } from '../hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const Subscription = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();

    const handleSubscribe = async (tier: 'basic' | 'pro' | 'enterprise') => {
        setIsLoading(true);
        try {
            const response = await api.post('/subscriptions/subscribe', { tier });
            const { subscription } = response.data.user;

            // Dispatch update to Redux
            dispatch(updateSubscription(subscription));

            // Update user in localStorage
            const storedUser = getUser();
            if (storedUser) {
                const updatedUser = { ...storedUser, subscription };
                storeUser(updatedUser);
            }

            toast({
                title: 'Subscription Successful!',
                description: `You are now on the ${tier} plan.`,
            });
            navigate('/profile');
        } catch (error: any) {
            toast({
                title: 'Subscription Failed',
                description: error.response?.data?.message || 'An error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const currentTier = currentUser?.subscription?.tier;

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
            <p className="text-center text-muted-foreground mb-12">Select a subscription to start uploading datasets.</p>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Basic Tier */}
                <div className={`card-corporate ${currentTier === 'basic' ? 'border-primary' : ''}`}>
                    <h2 className="text-2xl font-bold mb-2">Basic</h2>
                    <p className="text-4xl font-bold mb-4">$19<span className="text-lg font-normal">/mo</span></p>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/>Up to 5 uploads</li>
                    </ul>
                    <button onClick={() => handleSubscribe('basic')} disabled={isLoading || currentTier === 'basic'} className="btn-hero w-full">
                        {currentTier === 'basic' ? 'Current Plan' : 'Choose Basic'}
                    </button>
                </div>
                {/* Pro Tier */}
                <div className={`card-corporate ${currentTier === 'pro' ? 'border-primary' : ''}`}>
                    <h2 className="text-2xl font-bold mb-2">Pro</h2>
                    <p className="text-4xl font-bold mb-4">$49<span className="text-lg font-normal">/mo</span></p>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/>Up to 20 uploads</li>
                    </ul>
                    <button onClick={() => handleSubscribe('pro')} disabled={isLoading || currentTier === 'pro'} className="btn-hero w-full">
                        {currentTier === 'pro' ? 'Current Plan' : 'Choose Pro'}
                    </button>
                </div>
                {/* Enterprise Tier */}
                <div className={`card-corporate ${currentTier === 'enterprise' ? 'border-primary' : ''}`}>
                    <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
                    <p className="text-4xl font-bold mb-4">$99<span className="text-lg font-normal">/mo</span></p>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/>Unlimited uploads</li>
                    </ul>
                    <button onClick={() => handleSubscribe('enterprise')} disabled={isLoading || currentTier === 'enterprise'} className="btn-hero w-full">
                        {currentTier === 'enterprise' ? 'Current Plan' : 'Choose Enterprise'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
