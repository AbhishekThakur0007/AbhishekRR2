import { supabase as defaultClient } from '@/lib/supabase/client'

export const DEFAULT_SETTINGS = {
  automation_enabled: false,
  max_calls_batch: 10,
  retry_interval: 15,
  max_attempts: 3,
}

class SettingsService {

  constructor(supabaseClient = defaultClient) {
    this.supabase = supabaseClient
  }

  async getAutomationSettings(userId) {
    const { data, error } = await this.supabase
      .from('reva-settings')
      .select('automation_enabled, max_calls_batch, retry_interval, max_attempts, followupboss_apikey, selected_assistant, ai_dailer')
      .eq('user_id', userId)
      .single()

    if (error) {

      // If no settings exist, try to create default settings
      if (error.code === 'PGRST116') { // PostgreSQL "no rows returned" error
        const { data: newData, error: insertError } = await this.supabase
          .from('reva-settings')
          .insert([{ ...DEFAULT_SETTINGS, user_id: userId }])
          .select()
          .single()

        if (insertError) {
          // If we can't create settings (e.g., due to permissions), just use defaults in memory
          // This ensures the app still works even if we can't persist settings
          console.log('Using in-memory default settings')
          return DEFAULT_SETTINGS
        }

        return newData || DEFAULT_SETTINGS
      }

      // For any other errors, log them but continue with defaults
      console.log('Using default settings due to error:', error.message)
      return DEFAULT_SETTINGS
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiType', data.ai_dailer)
    }
    // Return data with fallback to defaults for any missing fields
    return {
      automation_enabled: data.automation_enabled ?? DEFAULT_SETTINGS.automation_enabled,
      max_calls_batch: data.max_calls_batch ?? DEFAULT_SETTINGS.max_calls_batch,
      retry_interval: data.retry_interval ?? DEFAULT_SETTINGS.retry_interval,
      max_attempts: data.max_attempts ?? DEFAULT_SETTINGS.max_attempts,
      followupboss_apikey: data.followupboss_apikey,
      selected_assistant: data.selected_assistant,
      ai_dailer: data.ai_dailer
    }
  }

  async createSetting(userId, followupbossApi) {
    const newSettings = {
      user_id: userId,
      followupboss_apikey: followupbossApi,
    };

    const { data, error } = await this.supabase
      .from('reva-settings')
      .insert([newSettings])
      .select()
      .single();

    if (error) {
      console.error('Error creating settings:', error.message);
      return newSettings;
    }

    return data;
  }

  async updateAutomationEnabled(enabled) {
    try {
      const { error } = await this.supabase
        .from('reva-settings')
        .update({ automation_enabled: enabled })
        .not('id', 'is', null) // Update all rows (should only be one)

      if (error) throw error

      return { success: true }
    } catch (error) {
      const errorMessage = error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Failed to update settings'

      console.log('Error updating automation settings:', errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async updateAllSettings(settings) {
    try {
      const userId = localStorage.getItem('userId')
      const { error } = await this.supabase
        .from('reva-settings')
        .update(settings)
        .eq('user_id', userId) // Update all rows (should only be one)

      if (error) throw error
      localStorage.setItem('aiType', settings.ai_dailer)
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Failed to update settings'

      console.log('Error updating automation settings:', errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

// Export a singleton instance with the default client for client-side use
export const settingsService = new SettingsService()

// Export the class for server-side use with different clients
export { SettingsService }
