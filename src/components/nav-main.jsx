"use client"

import { PlusCircleIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="min-w-8 bg-primary cursor-pointer text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                  <PlusCircleIcon />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
              <Link href="/dashboard/products/create"> <DropdownMenuItem className="cursor-pointer" ><PlusCircleIcon />  Product  </DropdownMenuItem></Link>
              <Link href="/dashboard/transactions/sell/create">  <DropdownMenuItem className="cursor-pointer" > <PlusCircleIcon />  Sell    </DropdownMenuItem></Link>
              <Link href="/dashboard/transactions/purchase/create">  <DropdownMenuItem className="cursor-pointer" > <PlusCircleIcon />  Purchase </DropdownMenuItem></Link>
              <Link href="/dashboard/customers/create">  <DropdownMenuItem className="cursor-pointer" > <PlusCircleIcon />  Customer </DropdownMenuItem></Link>
              <Link href="/dashboard/products/expense">  <DropdownMenuItem className="cursor-pointer" > <PlusCircleIcon />  Expense  </DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="icon" className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0" variant="outline">
              <PlusCircleIcon />
              <span className="sr-only">Quick Create</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="cursor-pointer" tooltip={item.title}>
                  <Link href={item.url}>
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
