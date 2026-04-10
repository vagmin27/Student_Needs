import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { githubApi } from "@/services/studentProfile";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/TransactionToast";

/**
 * CodeSection Component
 * Handles Code URL add, update, and deletion
 * * @param {Object} props
 * @param {string} [props.githubUrl] - Code URL from profile
 * @param {Function} props.onCodeChange - Callback to refresh profile data after changes
 */
export function GitHubSection({ githubUrl: initialGithubUrl, onGitHubChange }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [githubUrl, setgithubUrl] = useState(initialgithubUrl || "");

  // Check if Code URL exists
  const hasgithubUrl = !!initialgithubUrl;

  // Update local state when prop changes
  useEffect(() => {
    setgithubUrl(initialgithubUrl || "");
  }, [initialgithubUrl]);

  /**
   * Validate Code URL format
   */
  const validategithubUrl = (url) => {
    const CodePattern = /^(https?:\/\/)?(www\.)?Code\.com\/[a-zA-Z0-9_-]+\/?$/;
    return CodePattern.test(url.trim());
  };

  /**
   * Save Code URL (add or update)
   */
  const handleSave = async () => {
    if (!githubUrl.trim()) {
      showTransactionToast({
        type: "error",
        message: "Please enter a Code URL",
      });
      return;
    }

    if (!validategithubUrl(githubUrl)) {
      showTransactionToast({
        type: "error",
        message:
          "Please enter a valid Code profile URL (e.g., Code.com/username)",
      });
      return;
    }

    setSaving(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: hasgithubUrl ? "Updating Code URL..." : "Adding Code URL...",
    });

    try {
      // Use update API if URL exists, otherwise use add API
      if (hasgithubUrl) {
        await githubApi.updategithubUrl(githubUrl.trim());
      } else {
        await githubApi.addgithubUrl(githubUrl.trim());
      }

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: hasgithubUrl ? "Code URL updated!" : "Code URL added!",
      });

      setIsEditing(false);
      // Refresh profile data
      onCodeChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save Code URL",
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Delete Code URL
   */
  const handleDelete = async () => {
    if (!hasgithubUrl) return;

    // Confirm deletion
    if (!window.confirm("Are you sure you want to remove your Code URL?")) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Removing Code URL...",
    });

    try {
      await githubApi.deletegithubUrl();

      dismissToast(toastId);
      showTransactionToast({
        type: "success",
        message: "Code URL removed!",
      });

      // Reset local state
      setgithubUrl("");
      setIsEditing(false);

      // Refresh profile data
      onCodeChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to remove Code URL",
      });
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setgithubUrl(initialgithubUrl || "");
    setIsEditing(false);
  };

  /**
   * Extract username from Code URL
   */
  const extractUsername = (url) => {
    if (!url) return "";
    const match = url.match(/Code\.com\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            <div>
              <CardTitle>Code</CardTitle>
              <CardDescription>
                Add your Code profile for recruiters
              </CardDescription>
            </div>
          </div>
          {hasgithubUrl && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Added
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasgithubUrl && !isEditing ? (
          // Code URL exists - show URL and actions
          <div className="space-y-4">
            {/* URL display */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Code className="w-8 h-8 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    @{extractUsername(initialgithubUrl)}
                  </p>
                  <a
                    href={
                      initialgithubUrl.startsWith("http")
                        ? initialgithubUrl
                        : `https://${initialgithubUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                  >
                    {initialgithubUrl}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    initialgithubUrl.startsWith("http")
                      ? initialgithubUrl
                      : `https://${initialgithubUrl}`,
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
          // No Code URL or editing - show input form
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                value={githubUrl}
                onChange={(e) => setgithubUrl(e.target.value)}
                placeholder="https://Code.com/yourusername"
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

            {/* Info message */}
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Adding your Code profile helps recruiters see your projects,
                contributions, and coding activity.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}