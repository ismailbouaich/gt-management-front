"use client"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  ClipboardIcon,
  DollarSignIcon,
  FileTextIcon,
  FolderIcon,
  LayersIcon,
  LayoutDashboardIcon,
  ListIcon,
  LockIcon,
  PackageIcon,
  ReceiptIcon,
  RulerIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  FactoryIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { NavTransactions } from "./nav-transactions"
import { NavProducts } from "./nav-products"
import { NavCheques } from "./nav-cheques"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChartIcon,
    },
    {
      title: "Production",
      url: "/dashboard/production",
      icon: FactoryIcon,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: UsersIcon,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ],
  navProducts: [
    {
      title: "Product List",
      url: "/dashboard/products",
      icon: ListIcon,
    },
    {
      title: "Brands",
      url: "/dashboard/products/brands",
      icon: TagIcon,
    },
    {
      title: "Category",
      url: "/dashboard/products/category",
      icon: FolderIcon,
    },
    {
      title: "Variations",
      url: "/dashboard/products/variations",
      icon: LayersIcon,
    },
    {
      title: "Units",
      url: "/dashboard/products/units",
      icon: RulerIcon,
    },
    {
      title: "Selling Price Group",
      url: "/dashboard/products/selling-price-group",
      icon: DollarSignIcon,
    },
  ],
  navTransactions: [
    {
      title: "Purchase",
      url: "/dashboard/transactions/purchase",
      icon: ShoppingBagIcon,
    },
    {
      title: "Sell",
      url: "/dashboard/transactions/sell",
      icon: ShoppingCartIcon,
    },
    {
      title: "Stock Adjustment",
      url: "/dashboard/transactions/stock-adjustment",
      icon: PackageIcon,
    },
    {
      title: "Expense",
      url: "/dashboard/transactions/expense",
      icon: WalletIcon,
    },
    {
      title: "Transfer",
      url: "/dashboard/transactions/transfer",
      icon: TruckIcon,
    },
    {
      title: "Quote",
      url: "/dashboard/transactions/quote",
      icon: FileTextIcon,
    },
    {
      title: "Purchase Order",
      url: "/dashboard/transactions/purchase-order",
      icon: ClipboardIcon,
    },
    {
      title: "Credit Note",
      url: "/dashboard/transactions/credit-note",
      icon: ReceiptIcon,
    },
    {
      title: "Delivery Note",
      url: "/dashboard/transactions/delivery-note",
      icon: TruckIcon,
    },
  ],
  navCheques: [
    {
      title: "Customer Cheques",
      url: "/dashboard/cheques/customer-cheques",
      icon: UserIcon,
    },
    {
      title: "Supplier Cheques",
      url: "/dashboard/cheques/supplier-cheques",
      icon: TruckIcon,
    },
    {
      title: "Expense Cheques",
      url: "/dashboard/cheques/expense-cheques",
      icon: WalletIcon,
    },
    {
      title: "Customer Guarantee Cheques",
      url: "/dashboard/cheques/customer-guarantee-cheques",
      icon: ShieldIcon,
    },
    {
      title: "Supplier Guarantee Cheques",
      url: "/dashboard/cheques/supplier-guarantee-cheques",
      icon: LockIcon,
    },
  ],
  navSecondary: [
    {
      title: "Help Center",
      url: "/dashboard/help-center",
      icon: SearchIcon,
    },
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProducts items={data.navProducts} />
        <NavTransactions items={data.navTransactions} />
        <NavCheques items={data.navCheques} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
