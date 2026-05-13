import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { resumeApi } from '@/services/studentProfile.js';
import { showTransactionToast, dismissToast } from '@/components/TransactionToast.jsx';

/**
 * ResumeSection Component
 * Handles resume upload, update, download, and deletion.
 * Stores resume as PDF in MongoDB.
 * * @param {Object} props
 * @param {Object} [props.resume] - Resume data from profile (fileName, fileSize, uploadedAt)
 * @param {Function} props.onResumeChange - Callback to refresh profile data after changes
 */
export function ResumeSection({ resume, onResumeChange }) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Check if resume exists
  const hasResume = resume?.fileName && resume?.fileSize;

  /**
   * Handle file selection and upload
   * @param {React.ChangeEvent<HTMLInputElement>} event 
   */
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      showTransactionToast({
        type: 'error',
        message: 'Please upload a PDF file only',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showTransactionToast({
        type: 'error',
        message: 'File size must be less than 5MB',
      });
      return;
    }

    setUploading(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: hasResume ? 'Updating resume...' : 'Uploading resume...',
    });

    try {
      // Use update API if resume exists, otherwise use upload API
      if (hasResume) {
        await resumeApi.updateResume(file);
      } else {
        await resumeApi.uploadResume(file);
      }

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: hasResume ? 'Resume updated successfully!' : 'Resume uploaded successfully!',
      });

      // Refresh profile data
      onResumeChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload resume',
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Download resume PDF
   */
  const handleDownload = async () => {
    if (!hasResume) return;

    setDownloading(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Downloading resume...',
    });

    try {
      const blob = await resumeApi.getResume();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume?.fileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: 'Resume downloaded successfully!',
      });
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to download resume',
      });
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Delete resume
   */
  const handleDelete = async () => {
    if (!hasResume) return;

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Deleting resume...',
    });

    try {
      await resumeApi.deleteResume();

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: 'Resume deleted successfully!',
      });

      // Refresh profile data
      onResumeChange();
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete resume',
      });
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your resume (PDF only, max 5MB)</CardDescription>
            </div>
          </div>
          {hasResume && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Uploaded
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="resume-upload"
        />

        {hasResume ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{resume?.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(resume?.fileSize)}
                  </p>
                  {resume?.uploadedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded: {formatDate(resume.uploadedAt)}
                    </p>
                  )}
                </div>
              </div>
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
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-muted">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Click to upload your resume</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF format only (max 5MB)
                  </p>
                </div>
              </div>
            </div>

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
                  Upload Resume
                </>
              )}
            </Button>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                A well-formatted resume increases your chances of getting noticed by recruiters.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}