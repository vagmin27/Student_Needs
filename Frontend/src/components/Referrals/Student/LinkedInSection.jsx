import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Referrals/ui/card.jsx";
import { Button } from "@/components/Referrals/ui/button.jsx";
import { Input } from "@/components/Referrals/ui/input.jsx";
import { Badge } from "@/components/Referrals/ui/badge.jsx";
import {
  Globe,
  Upload,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Save,
} from "lucide-react";
import { linkedInApi } from "@/services/Referrals/studentProfile.js";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast.jsx";

/**
 * @param {Object} props
 * @param {Object} [props.linkedIn] - LinkedIn data from profile
 * @param {Function} props.onLinkedInChange - Refresh profile after changes
 */
export function LinkedInSection({ linkedIn, onLinkedInChange }) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingUrl, setUpdatingUrl] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState(linkedIn?.linkedInUrl || "");

  const fileInputRef = useRef(null);

  const hasLinkedInPdf = linkedIn?.fileName && linkedIn?.fileSize;
  const hasLinkedInUrl = !!linkedIn?.linkedInUrl;

  useEffect(() => {
    setLinkedInUrl(linkedIn?.linkedInUrl || "");
  }, [linkedIn]);

  const validateLinkedInUrl = (url) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;
    return pattern.test(url.trim());
  };

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
      message: hasLinkedInPdf
        ? "Updating LinkedIn PDF..."
        : "Uploading LinkedIn PDF...",
    });

    try {
      if (hasLinkedInPdf) {
        await linkedInApi.updateLinkedInPdf(file);
      } else {
        await linkedInApi.uploadLinkedIn(
          file,
          linkedInUrl.trim() || undefined,
        );
      }

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: hasLinkedInPdf
          ? "LinkedIn PDF updated!"
          : "LinkedIn PDF uploaded!",
      });

      onLinkedInChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message:
          error.response?.data?.message || "Failed to upload LinkedIn PDF",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdateUrl = async () => {
    if (!linkedInUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a LinkedIn profile URL",
      });
      return;
    }

    if (!validateLinkedInUrl(linkedInUrl)) {
      showTransactionToast({
        type: "error",
        message:
          "Enter a valid LinkedIn URL (e.g. linkedin.com/in/username)",
      });
      return;
    }

    setUpdatingUrl(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Updating LinkedIn URL...",
    });

    try {
      await linkedInApi.updateLinkedInUrl(linkedInUrl.trim());

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "LinkedIn URL updated successfully!",
      });

      onLinkedInChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update LinkedIn URL",
      });
    } finally {
      setUpdatingUrl(false);
    }
  };

  const handleDownload = async () => {
    if (!hasLinkedInPdf) return;

    setDownloading(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Downloading LinkedIn PDF...",
    });

    try {
      const blob = await linkedInApi.getLinkedIn();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = linkedIn?.fileName || "linkedin-profile.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "LinkedIn PDF downloaded!",
      });
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message:
          error.response?.data?.message || "Failed to download LinkedIn PDF",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!hasLinkedInPdf) return;
    if (!window.confirm("Delete your LinkedIn PDF?")) return;

    setDeleting(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Deleting LinkedIn PDF...",
    });

    try {
      await linkedInApi.deleteLinkedIn();
      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "LinkedIn PDF deleted!",
      });
      onLinkedInChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message:
          error.response?.data?.message || "Failed to delete LinkedIn PDF",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let size = bytes;

    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }

    return `${size.toFixed(1)} ${units[i]}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0A66C2]" />
            <div>
              <CardTitle>LinkedIn</CardTitle>
              <CardDescription>
                Upload LinkedIn PDF and add profile URL
              </CardDescription>
            </div>
          </div>
          {(hasLinkedInPdf || hasLinkedInUrl) && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {hasLinkedInPdf && hasLinkedInUrl
                ? "Complete"
                : hasLinkedInPdf
                  ? "PDF"
                  : "URL"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex gap-2">
          <Input
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleUpdateUrl}
            disabled={updatingUrl}
            aria-label="Save LinkedIn URL"
          >
            {updatingUrl ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
          {hasLinkedInUrl && (
            <Button variant="outline" size="icon" asChild>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>

        {hasLinkedInPdf ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="font-medium truncate">{linkedIn.fileName}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(linkedIn.fileSize)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Replace
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload LinkedIn PDF
              </>
            )}
          </Button>
        )}

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Export your LinkedIn profile as PDF from LinkedIn settings, then
            upload it here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
