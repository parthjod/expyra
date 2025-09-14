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
import { type Product, type ExtractedProductInfo } from "@/lib/types";
import { DatePicker } from "@/components/ui/date-picker";
import { PlusCircle } from "lucide-react";
import { CameraScanner } from "./camera-scanner";
import { Separator } from "./ui/separator";

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
      mfgDate: undefined,
      expDate: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addProduct(values);
    form.reset({ name: "", batchId: "", quantity: 1, mfgDate: undefined, expDate: undefined });
  }

  const handleScan = (data: ExtractedProductInfo) => {
    form.setValue("name", data.productName);
    form.setValue("batchId", data.batchId);
    // Dates from AI might be strings, so we parse them.
    // We add a day to account for timezone issues where parsing might result in the previous day.
    const mfg = new Date(data.mfgDate);
    mfg.setDate(mfg.getDate() + 1);
    const exp = new Date(data.expDate);
    exp.setDate(exp.getDate() + 1);
    
    form.setValue("mfgDate", mfg);
    form.setValue("expDate", exp);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Scan a product or fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CameraScanner onScan={handleScan} />
          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
