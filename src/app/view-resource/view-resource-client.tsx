"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, AlertCircle } from "lucide-react";

export default function ViewResourceClient() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url") || "";
  const title = searchParams.get("title") || "Resource";
  const type = searchParams.get("type") || "file";

  // Rewrite direct public URL to API route for correct headers (MIME types)
  let url = rawUrl;
  if (url.includes("/resources/") && !url.includes("/api/resources/")) {
    url = url.replace("/resources/", "/api/resources/");
  }

  const isPdf = url.toLowerCase().endsWith(".pdf");
  const isImage = type === "image" || !!url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  const isWordDoc = url.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/i);
  
  const isBase64 = url.startsWith("data:");
  const isBase64Pdf = isBase64 && url.includes("application/pdf");
  const isBase64Image = isBase64 && url.includes("image/");

  if (!url) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-500">Invalid Resource URL</div>;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-white dark:bg-slate-900 shrink-0">
        <h1 className="font-medium text-sm truncate max-w-md flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <FileText className="h-4 w-4 text-primary" />
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={url} download>
              <Download className="h-4 w-4 mr-2" /> Download
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> Open Direct
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative flex items-center justify-center">
        {(isPdf || isBase64Pdf) ? (
          <object data={url} type="application/pdf" className="w-full h-full border-0">
            <iframe src={url} className="w-full h-full border-0" title={title}>
               This browser does not support PDFs. Please download the PDF to view it.
            </iframe>
          </object>
        ) : (isImage || isBase64Image) ? (
          <div className="w-full h-full p-8 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
             <img src={url} alt={title} className="max-w-full max-h-full object-contain rounded-md shadow-sm border border-slate-200 dark:border-slate-800" />
          </div>
        ) : isWordDoc ? (
          <div className="w-full h-full flex flex-col">
            {url.includes("localhost") || url.includes("127.0.0.1") ? (
               <div className="text-center p-8 max-w-md mx-auto mt-20">
                 <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm space-y-6">
                   <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                     <FileText className="h-6 w-6" />
                   </div>
                   <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Office Document</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">
                     This file cannot be previewed natively in local development mode. In production, a secure viewer will be used.
                   </p>
                   <Button className="w-full h-12 text-md" asChild>
                      <a href={url} download><Download className="mr-2 h-4 w-4" /> Download File</a>
                   </Button>
                 </div>
               </div>
            ) : (
               <iframe 
                 src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`} 
                 className="w-full h-full border-0" 
                 title={title}
               />
            )}
          </div>
        ) : (
          <div className="text-center p-8 max-w-md">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm space-y-6">
               <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl flex items-center justify-center mb-4">
                 <AlertCircle className="h-6 w-6" />
               </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Preview Not Available</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This file type cannot be previewed directly in the browser. Please download it to view the content.
              </p>
              <Button className="w-full h-12 text-md" asChild>
                 <a href={url} download><Download className="mr-2 h-4 w-4" /> Download File</a>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
