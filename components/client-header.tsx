'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export function ClientHeader({ openSettings,supabase }: { openSettings: any ,supabase: any}) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    const { error } = await supabase.auth.signOut();
    await fetch('/api/auth/logout', { method: 'POST' });
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    router.push('/login');
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Leads</h1>
      {/* <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => openSettings()}>
          <Settings className="w-5 h-5" />
        </Button>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div> */}
    </div>
  );
}
