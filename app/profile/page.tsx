'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Mail, Shield, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) {
    router.push('/login');
    return null;
  }

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="px-4 py-8 md:px-8 max-w-2xl mx-auto space-y-8 pb-20">
      <header className="text-center space-y-4">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24 border-4 border-white shadow-xl mx-auto">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
            <AvatarFallback className="text-2xl bg-blue-600 text-white font-bold">{userInitial}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.displayName || 'Learner'}</h1>
          <p className="text-gray-500 font-mono text-sm">{user.email}</p>
        </div>
      </header>

      <div className="grid gap-4">
        <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
             <div className="p-4 flex items-center space-x-4 border-b hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Personal Info</p>
                  <p className="text-xs text-gray-500">Edit your profile details</p>
                </div>
             </div>
             <div className="p-4 flex items-center space-x-4 border-b hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">My Subscriptions</p>
                  <p className="text-xs text-gray-500">View active batches and expiry</p>
                </div>
             </div>
             <div className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Privacy & Security</p>
                  <p className="text-xs text-gray-500">Manage password and sessions</p>
                </div>
             </div>
          </CardContent>
        </Card>

        <Button 
          variant="destructive" 
          className="w-full h-14 rounded-2xl shadow-sm text-lg font-bold"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      <div className="text-center opacity-30 text-xs">
        <p>Sachin Academy Pro v1.0.0</p>
        <p>© 2024 Sachin Academy</p>
      </div>
    </div>
  );
}
