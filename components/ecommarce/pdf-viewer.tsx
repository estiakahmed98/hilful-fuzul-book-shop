"use client";

import { useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  pdfUrl?: string;
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
    setError(null);
  };

  const onLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setError("PDF লোড করা যায়নি");
    setIsLoading(false);
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale((prev) => prev + 0.2);
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">PDF URL পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-between">
      <div className="flex gap-2 mb-2 flex-wrap justify-center">
        <Button
          variant="outline"
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
        >
          পূর্বের পৃষ্ঠা
        </Button>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          পরের পৃষ্ঠা
        </Button>
        <Button variant="outline" onClick={zoomOut} disabled={scale <= 0.6}>
          - জুম
        </Button>
        <Button variant="outline" onClick={zoomIn}>
          + জুম
        </Button>
      </div>

      <div className="flex-1 overflow-auto w-full flex justify-center items-center">
        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setIsLoading(true);
                setError(null);
              }}
            >
              আবার চেষ্টা করুন
            </Button>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-2">লোড হচ্ছে...</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {!isLoading && !error && (
        <p className="mt-2 text-sm text-muted-foreground">
          পৃষ্ঠা {pageNumber} এর {numPages}
        </p>
      )}
    </div>
  );
}
