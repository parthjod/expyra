
"use client";

import { useMemo, useState, useEffect } from "react";
import { type Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import { getAISuggestion } from "@/app/actions";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateProductStatus } from "@/lib/inventory";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface InventoryAnalysisProps {
  products: Product[];
}

type SuggestionWithProduct = {
  productName: string;
  batchId: string;
  suggestedAction: string;
  reason: string;
};

const CHART_COLORS = {
  Valid: "hsl(var(--chart-1))",
  "Near Expiry": "hsl(var(--chart-2))",
  Expired: "hsl(var(--destructive))",
};

export function InventoryAnalysis({ products }: InventoryAnalysisProps) {
  const [suggestions, setSuggestions] = useState<SuggestionWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const productStats = useMemo(() => {
    const stats = {
      Valid: 0,
      "Near Expiry": 0,
      Expired: 0,
    };
    products.forEach((p) => {
      stats[calculateProductStatus(p.expDate)]++;
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .filter((entry) => entry.value > 0);
  }, [products]);

  const nearExpiryProducts = useMemo(() => {
    return products.filter(
      (p) => calculateProductStatus(p.expDate) === "Near Expiry"
    ).sort((a,b) => a.expDate.getTime() - b.expDate.getTime());
  }, [products]);

  const upcomingExpiriesData = useMemo(() => {
    const data: { date: string; count: number }[] = [];
    nearExpiryProducts.forEach(p => {
        const dateStr = format(p.expDate, "MMM d");
        const existingEntry = data.find(e => e.date === dateStr);
        if (existingEntry) {
            existingEntry.count += p.quantity;
        } else {
            data.push({ date: dateStr, count: p.quantity });
        }
    });
    return data;
  }, [nearExpiryProducts]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (nearExpiryProducts.length === 0) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      const newSuggestions: SuggestionWithProduct[] = [];
      // To avoid overwhelming, let's just get suggestions for the first 5 near-expiry products
      for (const product of nearExpiryProducts.slice(0, 5)) {
        const result = await getAISuggestion(product);
        if (result.success && result.data) {
          newSuggestions.push({
            productName: product.name,
            batchId: product.batchId,
            ...result.data,
          });
        }
      }
      setSuggestions(newSuggestions);
      setIsLoading(false);
    };

    fetchSuggestions();
  }, [nearExpiryProducts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Analysis</CardTitle>
        <CardDescription>
          An overview of your inventory status and AI-powered recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Product Status</h3>
            <div className="h-60 w-full">
              {products.length > 0 ? (
                <ChartContainer config={{}} className="h-full w-full">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={productStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {productStats.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={
                            CHART_COLORS[
                              entry.name as keyof typeof CHART_COLORS
                            ]
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                      No data to display.
                  </div>
              )}
            </div>
             <div className="flex justify-center gap-4 mt-4">
                {Object.entries(CHART_COLORS).map(([name, color]) => (
                    <div key={name} className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full" style={{backgroundColor: color}} />
                        <span>{name}</span>
                    </div>
                ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Upcoming Expiries</h3>
             <div className="h-60 w-full">
                {upcomingExpiriesData.length > 0 ? (
                     <ChartContainer config={{}} className="h-full w-full">
                        <BarChart data={upcomingExpiriesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={4} />
                        </BarChart>
                     </ChartContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No products are nearing expiry.
                    </div>
                )}
             </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">AI-Powered Suggestions</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="ml-2">Generating suggestions...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="rounded-md border max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Suggested Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.productName}
                        <p className="text-xs text-muted-foreground">{item.batchId}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.suggestedAction}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-muted-foreground rounded-md border">
              No suggestions available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
