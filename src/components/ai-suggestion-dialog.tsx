"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { type Product } from "@/lib/types";
import { getAISuggestion } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AiSuggestionDialogProps {
  product: Product;
}

type Suggestion = {
    suggestedAction: string;
    reason: string;
}

export function AiSuggestionDialog({ product }: AiSuggestionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    const result = await getAISuggestion(product);
    
    if (result.success && result.data) {
        setSuggestion(result.data);
    } else {
        setError(result.error || "An unknown error occurred.");
    }

    setIsLoading(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
        handleFetchSuggestion();
    } else {
        // Reset state when closing
        setSuggestion(null);
        setError(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bot className="mr-2 h-4 w-4" />
          AI Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Inventory Suggestion</DialogTitle>
          <DialogDescription>
            AI-powered recommendation for {product.name} (Batch: {product.batchId}).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {isLoading && (
                <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p>Generating suggestion...</p>
                </div>
            )}
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {suggestion && (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Suggested Action:</h3>
                        <p className="text-primary">{suggestion.suggestedAction}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Reason:</h3>
                        <p className="text-muted-foreground">{suggestion.reason}</p>
                    </div>
                </div>
            )}
        </div>
        <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
