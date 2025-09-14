"use client";

import { type InventoryStats } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Boxes, CalendarClock, TriangleAlert } from "lucide-react";

interface DashboardStatsProps {
  stats: InventoryStats;
}

const statCards = [
  {
    title: "Total Products",
    key: "total" as keyof InventoryStats,
    icon: Package,
    color: "text-primary",
  },
  {
    title: "Near Expiry",
    key: "nearExpiry" as keyof InventoryStats,
    icon: CalendarClock,
    color: "text-orange-500",
  },
  {
    title: "Donation Ready",
    key: "donationReady" as keyof InventoryStats,
    icon: Boxes,
    color: "text-blue-500",
  },
  {
    title: "Expired",
    key: "expired" as keyof InventoryStats,
    icon: TriangleAlert,
    color: "text-red-500",
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats[card.key]}</div>
              <p className="text-xs text-muted-foreground">
                Total count of {card.title.toLowerCase()} items
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
