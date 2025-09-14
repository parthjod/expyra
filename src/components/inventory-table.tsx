"use client";

import { type Product } from "@/lib/types";
import { calculateProductStatus } from "@/lib/inventory";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AiSuggestionDialog } from "./ai-suggestion-dialog";

interface InventoryTableProps {
  products: Product[];
  removeProduct: (id: string) => void;
  clearInventory: () => void;
}

export function InventoryTable({ products, removeProduct, clearInventory }: InventoryTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Valid":
        return "default";
      case "Near Expiry":
        return "secondary";
      case "Expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Log</CardTitle>
        <CardDescription>
          A list of all products you have scanned.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products
                .sort((a, b) => a.expDate.getTime() - b.expDate.getTime())
                .map((product) => {
                  const status = calculateProductStatus(product.expDate);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{format(product.expDate, "PPP")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(status)}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {status === "Near Expiry" && (
                            <AiSuggestionDialog product={product} />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(product.id)}
                            aria-label="Remove product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No products in inventory.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </CardContent>
      {products.length > 0 && (
         <CardFooter>
            <Button variant="destructive" onClick={clearInventory}>Clear All</Button>
         </CardFooter>
      )}
    </Card>
  );
}
