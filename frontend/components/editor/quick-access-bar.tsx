"use client";

import { quickActions } from "@/schemas/quick_access_schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export const QuickAccessBar = () => {
  return (
    <TooltipProvider>
      <div className="w-full flex space-x-2 border-b bg-gray-50 px-2 py-1">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => console.log(`Run command: ${action.command}`)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {action.label}
                {action.shortcut && <span className="ml-1 text-xs opacity-70">({action.shortcut})</span>}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
