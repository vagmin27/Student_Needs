import { useState, useEffect } from "react";
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
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Edit2,
} from "lucide-react";
import { linkedInApi } from "@/services/Referrals/studentProfile.js";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast.jsx";

/**
 * @param {Object} props
 * @param {string} [props.linkedinUrl] - LinkedIn URL from profile
 * @param {Function} props.onLinkedInChange - Callback to refresh profile data after changes
 */
export function LinkedInSection({ linkedinUrl: initialLinkedinUrl, onLinkedInChange }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedinUrl || "");

  const hasLinkedinUrl = !!initialLinkedinUrl;

  useEffect(() => {
    setLinkedinUrl(initialLinkedinUrl || "");
  }, [initialLinkedinUrl]);

  const validateLinkedInUrl = (url) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;
    return pattern.test(url.trim());
  };

  const handleSave = async () => {
    if (!linkedinUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a LinkedIn profile URL",
      });
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      showTransactionToast({
        type: "error",
        message:
          "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/username)",
      });
      return;
    }

    setSaving(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: hasLinkedinUrl ? "Updating LinkedIn URL..." : "Adding LinkedIn URL...",
    });

    try {
      if (hasLinkedinUrl) {
        await linkedInApi.updateLinkedInUrl(linkedinUrl.trim());
      } else {
        await linkedInApi.addLinkedInUrl(linkedinUrl.trim());
      }

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: hasLinkedinUrl ? "LinkedIn URL updated!" : "LinkedIn URL added!",
      });

      setIsEditing(false);
      onLinkedInChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save LinkedIn URL",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!hasLinkedinUrl) return;

    if (!window.confirm("Are you sure you want to remove your LinkedIn URL?")) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Removing LinkedIn URL...",
    });

    try {
      await linkedInApi.deleteLinkedInUrl();

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "LinkedIn URL removed!",
      });

      setLinkedinUrl("");
      setIsEditing(false);
      onLinkedInChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to remove LinkedIn URL",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setLinkedinUrl(initialLinkedinUrl || "");
    setIsEditing(false);
  };

  const extractUsername = (url) => {
    if (!url) return "";
    const match = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    return match ? match[1] : url;
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
                Add your LinkedIn profile for recruiters
              </CardDescription>
            </div>
          </div>
          {hasLinkedinUrl && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Added
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasLinkedinUrl && !isEditing ? (
          <div className="space-y-4">
            <div className="p-4 rounded-[var(--radius-sm)] bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 flex-shrink-0 text-[#0A66C2]" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    @{extractUsername(initialLinkedinUrl)}
                  </p>
                  <a
                    href={
                      initialLinkedinUrl.startsWith("http")
                        ? initialLinkedinUrl
                        : `https://${initialLinkedinUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                  >
                    {initialLinkedinUrl}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    initialLinkedinUrl.startsWith("http")
                      ? initialLinkedinUrl
                      : `https://${initialLinkedinUrl}`,
                    "_blank",
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
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
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <Button
                onClick={handleSave}
                disabled={saving || !linkedinUrl.trim()}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Linking your LinkedIn profile helps recruiters learn more about your professional background and accomplishments.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
