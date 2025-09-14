"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Product } from "@/lib/types";
import { DatePicker } from "@/components/ui/date-picker";
import { PlusCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  batchId: z.string().min(1, { message: "Batch ID is required." }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
  mfgDate: z.date({ required_error: "Manufacturing date is required." }),
  expDate: z.date({ required_error: "Expiry date is required." }),
}).refine(data => data.expDate > data.mfgDate, {
  message: "Expiry date must be after manufacturing date.",
  path: ["expDate"],
});

interface ProductFormProps {
  addProduct: (product: Omit<Product, "id">) => void;
}

export function ProductForm({ addProduct }: ProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      batchId: "",
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addProduct(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Simulate scanning a product label by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Organic Milk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., BATCH-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="mfgDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Manufacturing Date</FormLabel>
                   <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="expDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
                   <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
