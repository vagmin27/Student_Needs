import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import {
  Loader2,
  Hash,
  QrCode,
  Download,
} from 'lucide-react';

/**
 * Component to generate and display a student's verification QR code stored on IPFS.
 * @param {Object} props
 * @param {Object} props.student - The student data object
 * @param {string} props.address - The wallet address of the student
 */
export function QRCodeSection({ student, address }) {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  /**
   * Simulates generating a data hash and uploading to IPFS
   */
  const handleGenerateQR = async () => {
    if (!student) return;
    setIsGeneratingQR(true);
    try {
      // Simulate IPFS upload and QR generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mocked IPFS CID and Data Hash
      const dataHash = `hash_${Date.now()}`;
      const ipfsCid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      
      // For demonstration - placeholder SVG QR code
      const qrCodeUrl = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="50%" y="50%" text-anchor="middle" font-size="16">QR Code</text></svg>`;
      
      setQrCodeData({
        qrCodeUrl,
        dataHash,
        ipfsCid,
      });
      
      toast.success('QR Code generated and stored on IPFS!');
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  /**
   * Handles the downloading of the generated QR image
   */
  const handleDownloadQR = () => {
    if (!qrCodeData) return;
    const link = document.createElement('a');
    const fileName = student.name ? student.name.replace(/\s+/g, '-') : 'student';
    link.download = `student-qr-${fileName}.png`;
    link.href = qrCodeData.qrCodeUrl;
    link.click();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Your Student QR Code
        </h3>
        
        <p className="text-sm text-muted-foreground text-center mb-6">
          This QR code contains your encoded student data and resume hash. 
          Share it with verifiers or employers for quick verification via blockchain.
        </p>

        {qrCodeData ? (
          <div className="space-y-4 mb-2">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border">
                <img 
                  src={qrCodeData.qrCodeUrl} 
                  alt="Student QR Code" 
                  className="w-64 h-64"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  IPFS CID
                </p>
                <code className="text-xs font-mono text-foreground break-all">
                  {qrCodeData.ipfsCid}
                </code>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Data Hash (SHA-256)
                </p>
                <code className="text-xs font-mono text-foreground break-all">
                  {qrCodeData.dataHash.slice(0, 32)}...
                </code>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Student Info</p>
                <p className="text-xs text-foreground">
                  Name: {student.name}<br />
                  Status: <StatusBadge status={student.resumeStatus} className="inline-flex" />
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border"
              onClick={handleDownloadQR}
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <QrCode className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>

            <Button
              variant="student"
              className="w-full bg-primary text-background rounded-md"
              onClick={handleGenerateQR}
              disabled={isGeneratingQR}
            >
              {isGeneratingQR ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading to IPFS...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code & Store on IPFS
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}