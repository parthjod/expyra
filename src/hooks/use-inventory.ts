"use client";

import { useState, useEffect, useMemo } from 'react';
import { type Product, type InventoryStats } from '@/lib/types';
import { calculateProductStatus } from '@/lib/inventory';
import { useToast } from '@/hooks/use-toast';

export const useInventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('inventory');
      const savedProducts = item ? JSON.parse(item) : [];
      // Dates are stored as strings in JSON, need to convert them back to Date objects
      const parsedProducts = savedProducts.map((p: any) => ({
        ...p,
        mfgDate: new Date(p.mfgDate),
        expDate: new Date(p.expDate),
      }));
      setProducts(parsedProducts);
    } catch (error) {
      console.error('Failed to load inventory from local storage', error);
      setProducts([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        const item = JSON.stringify(products);
        window.localStorage.setItem('inventory', item);
      } catch (error) {
        console.error('Failed to save inventory to local storage', error);
      }
    }
  }, [products, isLoaded]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: new Date().toISOString() };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    toast({
        title: "Product Added",
        description: `${product.name} has been added to your inventory.`,
      });
  };

  const removeProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );
     toast({
        title: "Product Removed",
        description: `Product has been removed from your inventory.`,
        variant: "destructive"
      });
  };
  
  const clearInventory = () => {
    setProducts([]);
    toast({
        title: "Inventory Cleared",
        description: `All products have been removed.`,
        variant: "destructive"
      });
  };

  const stats = useMemo<InventoryStats>(() => {
    const counts = {
      total: products.length,
      valid: 0,
      nearExpiry: 0,
      expired: 0,
    };

    products.forEach(product => {
      const status = calculateProductStatus(product.expDate);
      if (status === 'Valid') counts.valid++;
      else if (status === 'Near Expiry') counts.nearExpiry++;
      else if (status === 'Expired') counts.expired++;
    });

    return { ...counts, donationReady: counts.nearExpiry };
  }, [products]);

  return { products, addProduct, removeProduct, clearInventory, stats, isLoaded };
};
