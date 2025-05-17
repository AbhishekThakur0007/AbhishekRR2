"use client"
import { useEffect, useState } from 'react';
import { SettingsService } from '@/services/calling/settings';
import { LeadsService } from '@/services/calling/leads';
import { getAssistants } from '@/services/calling/assistant';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { ClientHeader } from '@/components/client-header';
import SettingsModal from '@/components/settings-modal';
import { AutomationControl } from '@/components/client-automation-control';
import { LeadTable } from '@/components/lead-table';


export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [assistants, setAssistants] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      const settingsService = new SettingsService(supabase);
      const leadsService = new LeadsService(supabase);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [leadsResult, settingsResult] = await Promise.all([
        leadsService.getLeads({}, user.id),
        settingsService.getAutomationSettings(user.id),
      ]);

      if (leadsResult.error) {
        console.error(leadsResult.error.message);
        return;
      }

      setLeads(leadsResult.data || []);
      setSettings(settingsResult);
      setLoading(false);
      fetchAssistants();
    };

    fetchData();
  }, []);

  const fetchAssistants = async () => {
    try {
      const data = await getAssistants();
      setAssistants(data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <AutomationControlSkeleton />
        <LeadTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientHeader openSettings={() => setModalVisible(true)} supabase={supabase} />
      <SettingsModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        initialSettings={settings}
      />
      <AutomationControl initialSettings={settings} />
      <LeadTable
        initialLeads={leads}
        settings={settings}
        assistants={assistants}
        setModalVisible={setModalVisible}
      />
    </div>
  );
}


function HeaderSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

function AutomationControlSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-6 w-11" />
    </div>
  );
}

function LeadTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-3">
        <Skeleton className="h-8 w-full" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b last:border-0">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

