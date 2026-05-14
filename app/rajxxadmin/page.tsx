'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Video, Activity, Search, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Control</h1>
          <p className="text-gray-500">Manage your academy operations here.</p>
        </div>
        <Button className="bg-blue-600">
          Sync All Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Batches', value: '42', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Videos Hosted', value: '850', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 bg-gray-50/30">
          <CardTitle className="text-lg">Recent Users & Activity</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search user ID..." className="pl-10 h-10 rounded-xl" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-50">
                  <TableHead className="font-bold">User Identity</TableHead>
                  <TableHead className="font-bold">Last Token</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { phone: '9140256954', token: 'a8f3cc...ced', status: 'Active' },
                  { phone: '9508063031', token: 'vPz1MV...10==', status: 'Active' },
                  { phone: '8877665544', token: 'xJyS3i...Qw==', status: 'Pending' },
                ].map((user, i) => (
                  <TableRow key={i} className="border-gray-50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{user.phone}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">UID: SA_{i*1000}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 p-1 rounded text-gray-500 font-mono">
                        {user.token.substring(0, 15)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
