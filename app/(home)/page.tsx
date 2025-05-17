import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// import ChatPage from '../chatpage';
import { NewHomePageClient } from '../newhome/NewHomePageClient';

// export const runtime = "edge";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <NewHomePageClient session={session} />;
}
