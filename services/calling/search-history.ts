import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface SearchHistoryItem {
  id: string;
  user_id: string;
  search_query: string;
  search_type: string;
  route: string;
  created_at: string;
  metadata?: any;
}

export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('reva_search_history_rows')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching search history:', error);
    return [];
  }

  return data || [];
}

export async function addSearchHistoryItem(
  searchQuery: string,
  searchType: string,
  route: string,
  metadata?: any,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('reva_search_history_rows').insert({
    user_id: user.id,
    search_query: searchQuery,
    search_type: searchType,
    route,
    metadata,
  });

  if (error) {
    console.error('Error adding search history:', error);
  }
}

export async function deleteSearchHistoryItem(id: string): Promise<void> {
  const { error } = await supabase.from('reva_search_history_rows').delete().eq('id', id);

  if (error) {
    console.error('Error deleting search history:', error);
  }
}

export async function clearSearchHistory(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('reva_search_history_rows').delete().eq('user_id', user.id);

  if (error) {
    console.error('Error clearing search history:', error);
  }
}
