import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from './ui/toast';
import { settingsService } from '@/services/calling/settings';

interface SettingsModalProps {
  initialSettings: any;
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function SettingsModal({ initialSettings, isModalVisible, setModalVisible }: SettingsModalProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateSettings = async () => {
    if (!settings) return
    const aiType = localStorage.getItem("aiType")
    setLoading(true)
    const { success, error } = await settingsService.updateAllSettings(settings)
    setLoading(false)

    if (!success) {
      toast({
        title: "Error",
        description: error || "Failed to update settings",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Settings updated successfully",
      variant: "success",
    })
    setModalVisible(false)
    if (aiType !== settings.ai_dailer)
      window.location.reload();
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field: string, min: number) => {
    if (!settings) return

    const input = e.target
    const value = input.value.trim()

    if (value === "") {
      input.value = settings[field].toString()
      return
    }

    let finalValue: string | number
    if (field !== "followupboss_apikey" && field !== "selected_assistant" && field !== "ai_dailer") {
      const numValue = parseInt(value)
      if (isNaN(numValue)) {
        input.value = settings[field].toString()
        return
      }
      finalValue = Math.max(min, numValue)
    } else {
      finalValue = value
    }
    console.log(field, finalValue)
    setSettings({ ...settings, [field]: finalValue })
    input.value = typeof finalValue === "number" ? finalValue.toString() : finalValue
  }

  if (!settings) return <div>Loading...</div>

  return (
    <Dialog open={isModalVisible} onOpenChange={setModalVisible}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Dialer Settings</DialogTitle>
        </DialogHeader>
        <CardHeader>
          <CardDescription>Configure your automated calling system parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="max-calls-batch">Maximum Calls per Batch</Label>
            <Input
              id="max-calls-batch"
              type="number"
              min={1}
              defaultValue={settings.max_calls_batch}
              onBlur={(e) => handleBlur(e, "max_calls_batch", 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retry-interval">Retry Interval (minutes)</Label>
            <Input
              id="retry-interval"
              type="number"
              min={0}
              defaultValue={settings.retry_interval}
              onBlur={(e) => handleBlur(e, "retry_interval", 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-attempts">Maximum Attempts per Lead</Label>
            <Input
              id="max-attempts"
              type="number"
              min={1}
              defaultValue={settings.max_attempts}
              onBlur={(e) => handleBlur(e, "max_attempts", 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followupboss_apikey">Follow Up Boss API Key</Label>
            <Input
              id="followupboss_apikey"
              defaultValue={settings.followupboss_apikey}
              onBlur={(e) => handleBlur(e, "followupboss_apikey", 1)}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Select AI Dailer</Label>
            <Select
              value={settings.ai_dailer}
              onValueChange={(value) => setSettings({ ...settings, ai_dailer: value, selected_assistant: null })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vapi">Vapi</SelectItem>
                <SelectItem value="insighto">Insighto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={updateSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
