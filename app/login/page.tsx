'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Lock, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error('Please fill in all details');
      return;
    }

    setIsLoading(true);
    try {
      const email = `${phone}@sachinacademy.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          loginPhone: phone,
          password: password,
          token: idToken,
          lastLogin: serverTimestamp(),
          purchasedBatches: [], 
          status: 'Active'
        }, { merge: true });
      } catch (err) {
         console.error(err);
      }

      toast.success('Welcome back!');
      router.push('/my-batches');
    } catch (error: any) {
      toast.error('Login failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center">
            <Rocket className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Member Login</h2>
          </div>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <Button className="w-full h-12 bg-blue-600" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
