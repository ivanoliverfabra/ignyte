"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type Items = { value: string, label: string }[]

export function Combobox({items, placeholder, values, setValues}: {items: Items; placeholder?: string, values: Items, setValues: React.Dispatch<React.SetStateAction<Items>>}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {values.length > 0
            ? `${values.length} selected`
            : placeholder || "Select an item"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[334px] p-0">
        <Command filter={(value, search) => {
          const actualValue = items.find((item) => item.value === value)?.label as string
          if (actualValue.includes(search)) {
            return 1; // Full match
          } else if (actualValue.startsWith(search)) {
            return 0.5; // Partial match
          } else {
            return 0; // No match
          }}}>
          <CommandInput placeholder={placeholder || 'Select an item'} />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(value) => {
                  setValues((values) => {
                    if (values.findIndex(v => v.value === item.value) >= 0) {
                      return values.filter((value) => value.value !== item.value)
                    } else {
                      return [...values, item]
                    }
                  })
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    values.findIndex(v => v.value === item.value) >= 0 ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}