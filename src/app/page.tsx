"use client";

import { DashboardStats } from "@/components/dashboard-stats";
import { InventoryTable } from "@/components/inventory-table";
import { ProductForm } from "@/components/product-form";
import { useInventory } from "@/hooks/use-inventory";

export default function Home() {
  const { products, addProduct, removeProduct, clearInventory, stats } = useInventory();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-8">
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProductForm addProduct={addProduct} />
          </div>
          <div className="lg:col-span-2">
            <InventoryTable 
              products={products} 
              removeProduct={removeProduct} 
              clearInventory={clearInventory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
