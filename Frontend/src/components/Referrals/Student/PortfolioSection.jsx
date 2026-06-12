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
import { portfolioApi } from "@/services/Referrals/studentProfile.js";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast.jsx";

/**
 * @param {Object} props
 * @param {string} [props.portfolioUrl] - Portfolio URL from profile
 * @param {Function} props.onPortfolioChange - Callback to refresh profile data after changes
 */
export function PortfolioSection({ portfolioUrl: initialPortfolioUrl, onPortfolioChange }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState(initialPortfolioUrl || "");

  const hasPortfolioUrl = !!initialPortfolioUrl;

  useEffect(() => {
    setPortfolioUrl(initialPortfolioUrl || "");
  }, [initialPortfolioUrl]);

  const validateUrl = (url) => {
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!portfolioUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a Portfolio URL",
      });
      return;
    }

    if (!validateUrl(portfolioUrl)) {
      showTransactionToast({
        type: "error",
        message:
          "Please enter a valid URL (e.g. https://myportfolio.com)",
      });
      return;
    }

    setSaving(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: hasPortfolioUrl ? "Updating Portfolio URL..." : "Adding Portfolio URL...",
    });

    try {
      if (hasPortfolioUrl) {
        await portfolioApi.updatePortfolioUrl(portfolioUrl.trim());
      } else {
        await portfolioApi.addPortfolioUrl(portfolioUrl.trim());
      }

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: hasPortfolioUrl ? "Portfolio URL updated!" : "Portfolio URL added!",
      });

      setIsEditing(false);
      onPortfolioChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save Portfolio URL",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!hasPortfolioUrl) return;

    if (!window.confirm("Are you sure you want to remove your Portfolio URL?")) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Removing Portfolio URL...",
    });

    try {
      await portfolioApi.deletePortfolioUrl();

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "Portfolio URL removed!",
      });

      setPortfolioUrl("");
      setIsEditing(false);
      onPortfolioChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to remove Portfolio URL",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setPortfolioUrl(initialPortfolioUrl || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <div>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>
                Add your personal website or online portfolio
              </CardDescription>
            </div>
          </div>
          {hasPortfolioUrl && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Added
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPortfolioUrl && !isEditing ? (
          <div className="space-y-4">
            <div className="p-4 rounded-[var(--radius-sm)] bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    Personal Portfolio
                  </p>
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                  >
                    {portfolioUrl}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(portfolioUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Site
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
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://myportfolio.com"
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <Button
                onClick={handleSave}
                disabled={saving || !portfolioUrl.trim()}
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
                Add your personal website, GitHub Pages site, or Behance/Dribbble link to showcase your best works.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
