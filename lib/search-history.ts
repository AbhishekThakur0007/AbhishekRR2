import { createClient } from '@/lib/supabase/client';

export type SearchType = 'property' | 'map' | 'agent';

export interface SearchHistoryItem {
  id: string;
  search_query: string;
  search_type: SearchType;
  route: string; // The actual route to navigate to
  created_at: string;
  metadata?: Record<string, any>;
}

export async function addToSearchHistory(
  search_query: string,
  search_type: 'property' | 'map' | 'agent',
  route: string,
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.warn('No user found, skipping search history update');
    return;
  }

  try {
    // First check if we already have this search
    const { data: existing } = await supabase
      .from('reva_search_history_rows')
      .select('id')
      .eq('user_id', user.id)
      .eq('search_query', search_query)
      .single();

    if (existing) {
      // Update the existing record
      await supabase
        .from('reva_search_history_rows')
        .update({
          updated_at: new Date().toISOString(),
          route,
        })
        .eq('id', existing.id);
    } else {
      // Insert a new record
      await supabase.from('reva_search_history_rows').insert({
        user_id: user.id,
        search_query,
        search_type,
        route,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error updating search history:', error);
  }
}

export async function getSearchHistory(limit = 10): Promise<SearchHistoryItem[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('reva_search_history_rows')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function deleteSearchHistoryItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('reva_search_history_rows').delete().eq('id', id);

  if (error) throw error;
}
