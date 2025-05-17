// Supabase imports
import { supabase as defaultClient } from '@/lib/supabase/client';

// Define lead status types as a reference
const LeadStatus = {
  PENDING: "pending",
  CALLING: "calling",
  NO_ANSWER: "no_answer",
  SCHEDULED: "scheduled",
  NOT_INTERESTED: "not_interested"
};

export class LeadsService {
  constructor(supabaseClient = defaultClient) {
    this.supabase = supabaseClient;
  }

  async getLeads(options = {}, userId) {
    const {
      sortBy = { column: null, ascending: false },
      page,
      pageSize
    } = options;

    try {
      let query = this.supabase
        .from('reva-leads')
        .select('*', { count: 'exact' }).eq('user_id', userId);

      // Sorting logic
      if (sortBy.column) {
        query = query.order(sortBy.column, {
          ascending: sortBy.ascending
        });
      } else {
        // Default sort by created_at desc if no sort specified
        query = query.order('created_at', { ascending: false });
      }

      // Pagination logic
      if (typeof page === 'number' && typeof pageSize === 'number') {
        const start = (page - 1) * pageSize;
        query = query.range(start, start + pageSize - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
        return {
          data: null,
          error: {
            message: error.message || 'Failed to fetch leads',
            details: error
          },
          count: 0
        };
      }

      return {
        data,
        error: null,
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching leads:', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          details: error
        },
        count: 0
      };
    }
  }

  async updateLead(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from('reva-leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating lead:', error);
      return {
        success: false,
        error
      };
    }
  }

  async deleteLead(id) {
    try {
      const { error } = await this.supabase
        .from('reva-leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting lead:', error);
      return {
        success: false,
        error
      };
    }
  }

  async createLead(lead) {
    try {
      const { data, error } = await this.supabase
        .from('reva-leads')
        .insert([lead])
        .select()
        .single();

      if (error) throw error;

      return {
        data
      };
    } catch (error) {
      console.error('Error creating lead:', error);
      return {
        data: null,
        error
      };
    }
  }

  async createLeads(leads) {
    try {
      const { error } = await this.supabase
        .from('reva-leads')
        .insert(leads);

      if (error) throw error;

      return {
        success: true
      };
    } catch (error) {
      console.error('Error creating leads:', error);
      return {
        success: false,
        error
      };
    }
  }

  async deleteCrmLeads(source) {
    try {
      const userId = localStorage.getItem('userId')
      const { error } = await this.supabase
        .from('reva-leads')
        .delete()
        .eq('source', source)
        .eq('user_id', userId);

      if (error) throw error;

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting lead:', error);
      return {
        success: false,
        error
      };
    }
  }

  async updateLeadStatus(ids, status) {
    try {
      const { data, error } = await this.supabase
        .from('reva-leads')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', ids)
        .select();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating lead status:', error);
      return {
        success: false,
        error
      };
    }
  }

  async updateCallStatus(phoneNumber, status) {
    try {
      const { error } = await this.supabase
        .from('reva-leads')
        .update({
          status,
          last_called_at: new Date().toISOString()
        })
        .eq('phone', phoneNumber)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating call status:', error);
      return { success: false, error };
    }
  }

  async fetchPendingLeads(maxCallsBatch, retryInterval, maxAttempts, userId) {
    try {
      // First count how many leads are currently being called
      const { count: activeCallsCount, error: countError } = await this.supabase
        .from('reva-leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'calling').eq('user_id', userId);

      if (countError) throw countError;

      // Calculate how many new calls we can make
      const availableSlots = Math.max(0, maxCallsBatch - (activeCallsCount || 0));

      // If no slots available, return empty array
      if (availableSlots === 0) {
        return {
          success: true,
          leads: []
        };
      }

      const query = this.supabase
        .from('reva-leads')
        .select('*')
        .eq('status', 'pending')
        .or(`last_called_at.is.null,last_called_at.lt.${new Date(Date.now() - retryInterval * 60 * 1000).toISOString()}`)
        .lt('call_attempts', maxAttempts)
        .order('last_called_at', { ascending: true, nullsFirst: true })
        .limit(availableSlots);

      console.log('Fetching pending leads with conditions:', {
        status: 'pending',
        retryIntervalMinutes: retryInterval,
        maxAttempts,
        maxCallsBatch,
        activeCallsCount,
        availableSlots,
        retryTime: new Date(Date.now() - retryInterval * 60 * 1000).toISOString()
      });

      const { data: leads, error } = await query;

      if (error) throw error;

      return {
        success: true,
        leads
      };
    } catch (error) {
      console.error('Error fetching pending leads:', error);
      return {
        success: false,
        error
      };
    }
  }

  async updateLeadWithCallAttempt(leadId, currentAttempts) {
    try {
      const { error } = await this.supabase
        .from('reva-leads')
        .update({
          call_attempts: currentAttempts + 1,
          last_called_at: new Date().toISOString(),
          status: 'calling'
        })
        .eq('id', leadId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating lead call attempt:', error);
      return { success: false, error };
    }
  }
}

export const leadsService = new LeadsService();