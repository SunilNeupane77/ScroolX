'use client';

import { ModeToggle } from '@/components/mode-toggle';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b shadow-sm">
      {/* Logo */}
      <div>
        <Link href="/">
          <h1 className="font-bold text-xl">
            Scroll<span className="text-red-500">X</span>
          </h1>
        </Link>
      </div>

      {/* Search Input */}
      <div className="w-1/2">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>
      </div>

      {/* Account Management */}
      <div className="flex items-center space-x-2">
        <Link href="/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </Link>

        {/* Authentication Buttons */}
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;