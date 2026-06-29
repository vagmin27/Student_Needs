import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Code,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Edit2,
} from "lucide-react";
import { githubApi } from "@/services/Referrals/studentProfile.js";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast.jsx";

/**
 * @param {Object} props
 * @param {string} [props.githubUrl] - GitHub URL from profile
 * @param {Function} props.onGitHubChange - Callback to refresh profile data after changes
 */
export function GitHubSection({ githubUrl: initialGithubUrl, onGitHubChange }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || "");

  const hasGithubUrl = !!initialGithubUrl;

  useEffect(() => {
    setGithubUrl(initialGithubUrl || "");
  }, [initialGithubUrl]);

  const validateGithubUrl = (url) => {
    const githubPattern =
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i;
    return githubPattern.test(url.trim());
  };

  const handleSave = async () => {
    if (!githubUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a GitHub URL",
      });
      return;
    }

    if (!validateGithubUrl(githubUrl)) {
      showTransactionToast({
        type: "error",
        message:
          "Please enter a valid GitHub profile URL (e.g. github.com/username)",
      });
      return;
    }

    setSaving(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: hasGithubUrl ? "Updating GitHub URL..." : "Adding GitHub URL...",
    });

    try {
      if (hasGithubUrl) {
        await githubApi.updateGithubUrl(githubUrl.trim());
      } else {
        await githubApi.addGithubUrl(githubUrl.trim());
      }

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: hasGithubUrl ? "GitHub URL updated!" : "GitHub URL added!",
      });

      setIsEditing(false);
      onGitHubChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save GitHub URL",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!hasGithubUrl) return;

    if (!window.confirm("Are you sure you want to remove your GitHub URL?")) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Removing GitHub URL...",
    });

    try {
      await githubApi.deleteGithubUrl();

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "GitHub URL removed!",
      });

      setGithubUrl("");
      setIsEditing(false);
      onGitHubChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to remove GitHub URL",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setGithubUrl(initialGithubUrl || "");
    setIsEditing(false);
  };

  const extractUsername = (url) => {
    if (!url) return "";
    const match = url.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    return match ? match[1] : url;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            <div>
              <CardTitle>GitHub</CardTitle>
              <CardDescription>
                Add your GitHub profile for recruiters
              </CardDescription>
            </div>
          </div>
          {hasGithubUrl && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Added
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasGithubUrl && !isEditing ? (
          <div className="space-y-4">
            <div className="p-4 rounded-[var(--radius-sm)] bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Code className="w-8 h-8 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    @{extractUsername(initialGithubUrl)}
                  </p>
                  <a
                    href={
                      initialGithubUrl.startsWith("http")
                        ? initialGithubUrl
                        : `https://${initialGithubUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                  >
                    {initialGithubUrl}
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
                    initialGithubUrl.startsWith("http")
                      ? initialGithubUrl
                      : `https://${initialGithubUrl}`,
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
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername"
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <Button
                onClick={handleSave}
                disabled={saving || !githubUrl.trim()}
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
                Adding your GitHub profile helps recruiters see your projects,
                contributions, and coding activity.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
