import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Link,
  Upload,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Link as LinkIcon,
  ExternalLink,
  Save,
} from "lucide-react";

import { linkedInApi } from "@/services/studentProfile";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/TransactionToast";

export function LinkedInSection({ Link, onLinkChange }) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingUrl, setUpdatingUrl] = useState(false);
  const [LinkUrl, setLinkUrl] = useState(Link?.LinkUrl || "");

  const fileInputRef = useRef(null);

  const hasLinkPdf = Link?.fileName && Link?.fileSize;
  const hasLinkUrl = !!Link?.LinkUrl;

  useEffect(() => {
    setLinkUrl(Link?.LinkUrl || "");
  }, [Link]);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showTransactionToast({
        type: "error",
        message: "Please upload a PDF file only",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showTransactionToast({
        type: "error",
        message: "File size must be less than 5MB",
      });
      return;
    }

    setUploading(true);

    const toastId = showTransactionToast({
      type: "pending",
      message: hasLinkPdf ? "Updating Link PDF..." : "Uploading Link PDF...",
    });

    try {
      if (hasLinkPdf) {
        await linkedInApi.updateLinkPdf(file);
      } else {
        await linkedInApi.uploadLink(file, LinkUrl || undefined);
      }

      dismissToast(toastId);

      showTransactionToast({
        type: "success",
        message: hasLinkPdf ? "Link PDF updated!" : "Link PDF uploaded!",
      });

      onLinkChange();
    } catch (error) {
      dismissToast(toastId);

      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to upload Link PDF",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateUrl = async () => {
    if (!LinkUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a Link URL",
      });
      return;
    }

    const pattern = /^(https?:\/\/)?(www\.)?Link\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;

    if (!pattern.test(LinkUrl.trim())) {
      showTransactionToast({
        type: "error",
        message: "Enter a valid Link profile URL",
      });
      return;
    }

    setUpdatingUrl(true);

    const toastId = showTransactionToast({
      type: "pending",
      message: "Updating Link URL...",
    });

    try {
      await linkedInApi.updateLinkUrl(LinkUrl.trim());

      dismissToast(toastId);

      showTransactionToast({
        type: "success",
        message: "Link URL updated successfully!",
      });

      onLinkChange();
    } catch (error) {
      dismissToast(toastId);

      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to update Link URL",
      });
    } finally {
      setUpdatingUrl(false);
    }
  };

  const handleDownload = async () => {
    if (!hasLinkPdf) return;

    setDownloading(true);

    const blob = await linkedInApi.getLink();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = Link?.fileName || "Link.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    setDownloading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete Link PDF?")) return;

    setDeleting(true);

    await linkedInApi.deleteLink();

    setLinkUrl("");

    onLinkChange();

    setDeleting(false);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }

    return `${bytes.toFixed(1)} ${units[i]}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-[#0A66C2]" />
          <CardTitle>Link</CardTitle>
        </div>

        <CardDescription>Upload Link PDF and add profile URL</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex gap-2">
          <Input
            value={LinkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://Link.com/in/username"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={handleUpdateUrl}
            disabled={updatingUrl}
          >
            {updatingUrl ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
        </div>

        {hasLinkPdf && (
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <p className="font-medium">{Link.fileName}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(Link.fileSize)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="icon" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>

              <Button size="icon" onClick={() => fileInputRef.current.click()}>
                <RefreshCw className="w-4 h-4" />
              </Button>

              <Button size="icon" variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {!hasLinkPdf && (
          <Button
            className="w-full"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Link PDF
          </Button>
        )}

        <div className="flex gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          Export Link profile as PDF from Link settings.
        </div>
      </CardContent>
    </Card>
  );
}