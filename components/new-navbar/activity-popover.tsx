"use client"
import { Bell, AlertTriangle, FileText, User, MessageSquare, Settings, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ActivityType = "login" | "message" | "file" | "settings" | "alert" | "download"

interface Activity {
  id: string
  title: string
  description: string
  time: string
  type: ActivityType
}

interface ActivityPopoverProps {
  activities: Activity[]
  onViewAll?: () => void
}

export function ActivityPopover({ activities, onViewAll }: ActivityPopoverProps) {
  const unreadCount = activities.length

  const getIconForType = (type: ActivityType) => {
    switch (type) {
      case "login":
        return <User className="h-4 w-4 text-blue-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "file":
        return <FileText className="h-4 w-4 text-yellow-500" />
      case "settings":
        return <Settings className="h-4 w-4 text-purple-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "download":
        return <Download className="h-4 w-4 text-teal-500" />
    }
  }

  return (
    <div className="relative group">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Activity</span>
      </Button>
      {unreadCount > 0 && (
        <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}

      <div className="absolute right-0 top-full mt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-80">
        <div className="bg-popover rounded-md border shadow-md">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={onViewAll}>
              View all
            </Button>
          </div>
          <div className="max-h-[350px] overflow-y-auto">
            {activities.length > 0 ? (
              <div>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-1 flex-shrink-0">{getIconForType(activity.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
