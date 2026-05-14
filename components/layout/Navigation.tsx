'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderOpen, User, Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'motion/react';

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Courses', icon: FolderOpen, href: '/my-batches' },
  { label: 'Profile', icon: User, href: '/profile' },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 h-14 md:hidden">
      <div className="flex items-center space-x-2.5">
        <Avatar className="w-8 h-8 border-2 border-blue-100 shadow-sm">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-blue-600 text-white font-bold text-[10px]">SA</AvatarFallback>
        </Avatar>
        <span className="font-black text-lg tracking-tighter text-gray-900">
          SACHIN <span className="text-blue-600 uppercase">Academy</span>
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
          <Bell className="w-4.5 h-4.5" />
        </Button>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 h-14 md:hidden flex justify-around items-center px-4 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={cn("relative flex flex-col items-center justify-center p-1.5 transition-all w-16", pathname === item.href ? "text-blue-600" : "text-gray-400")}>
          <item.icon className={cn("w-4.5 h-4.5 transition-transform", pathname === item.href ? "fill-blue-600/10 scale-110" : "opacity-70")} />
          <span className={cn("text-[8px] font-black mt-1.5 uppercase tracking-[0.1em] transition-all", pathname === item.href ? "opacity-100" : "opacity-60")}>{item.label}</span>
          {pathname === item.href && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -top-px w-6 h-0.5 bg-blue-600 rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Link>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 shadow-sm z-50">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-50">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-200">
          SA
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tighter text-gray-900 leading-none">
            SACHIN <span className="text-blue-600">ACADEMY</span>
          </span>
          <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Official App</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={cn(
              "flex items-center space-x-3 p-3 rounded-xl transition-all font-bold text-xs group", 
              pathname === item.href 
                ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
            )}
          >
            <item.icon className={cn("w-4.5 h-4.5 transition-transform group-hover:scale-110", pathname === item.href ? "text-white" : "text-gray-400")} />
            <span className="uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <div className="bg-gray-900 rounded-2xl p-4 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/40 transition-all"></div>
          <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Support</p>
          <h4 className="font-bold text-sm mt-1">Need Help?</h4>
          <Button size="sm" className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white border-0 font-bold rounded-lg text-[9px] h-7 uppercase tracking-[0.1em]">
            Contact Us
          </Button>
        </div>
      </div>
    </aside>
  );
}
