"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2, ScanLine } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { extractProductInfo } from '@/app/actions';
import { type ExtractedProductInfo } from '@/lib/types';

interface CameraScannerProps {
    onScan: (data: ExtractedProductInfo) => void;
}

export function CameraScanner({ onScan }: CameraScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };

      getCameraPermission();

      return () => {
        // Cleanup: stop camera stream when dialog closes
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [isOpen, toast]);

  const handleScan = async () => {
    if (!videoRef.current) return;
    setIsScanning(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        setIsScanning(false);
        return;
    };
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUri = canvas.toDataURL('image/jpeg');

    const result = await extractProductInfo(imageDataUri);

    if (result.success && result.data) {
        onScan(result.data);
        toast({
            title: "Scan Successful",
            description: "Product details extracted.",
        });
        setIsOpen(false);
    } else {
        toast({
            variant: "destructive",
            title: "Scan Failed",
            description: result.error || "Could not extract product details from the image.",
        });
    }

    setIsScanning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Scan Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Scan Product Label</DialogTitle>
        </DialogHeader>
        <div className="relative">
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
            {isScanning && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-md">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                    <p className="text-white mt-2">Extracting info...</p>
                </div>
            )}
        </div>

        {hasCameraPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access in your browser to use this feature.
                </AlertDescription>
            </Alert>
        )}
        
        <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleScan} disabled={!hasCameraPermission || isScanning}>
                {isScanning ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                    </>
                ) : (
                    <>
                        <ScanLine className="mr-2 h-4 w-4" />
                        Capture and Scan
                    </>
                )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
