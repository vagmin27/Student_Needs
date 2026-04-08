import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, User, Mail, Building2, GraduationCap, Calendar, Hash, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * QRScanner Component
 * Uses the device camera to scan student QR codes and fetch corresponding
 * data from IPFS/Backend.
 */
export function QRScanner({ isOpen, onClose }) {
  const [scanning, setScanning] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isOpen && scanning) {
      // Small delay to ensure the DOM element 'qr-reader' is fully rendered
      const timer = setTimeout(() => {
        try {
          scannerRef.current = new Html5QrcodeScanner(
            'qr-reader',
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            },
            false
          );

          scannerRef.current.render(
            async (decodedText) => {
              console.log('QR Code scanned:', decodedText);
              setScanning(false);
              setLoading(true);
              setError(null);

              try {
                const qrData = JSON.parse(decodedText);
                
                if (qrData.cid) {
                  // TODO: Fetch student data from backend API
                  // For now, using placeholder data from the QR payload
                  setStudentData({
                    name: qrData.name || 'Student Name',
                    email: qrData.email || 'student@example.com',
                    college: qrData.college || 'Sample College',
                    department: qrData.dept || 'Computer Science',
                    graduationYear: qrData.year || 2024,
                    resumeHash: qrData.hash || '',
                    walletAddress: qrData.addr || '0x000...000',
                    verificationStatus: qrData.status || 'verified',
                    verifiedAt: Date.now()
                  });
                } else {
                  setError('Invalid QR code format');
                }
              } catch (e) {
                console.error('Error parsing QR data:', e);
                setError('Invalid QR code data');
              } finally {
                setLoading(false);
              }

              // Stop and clear the scanner after a successful scan
              if (scannerRef.current) {
                scannerRef.current.clear();
              }
            },
            (errorMessage) => {
              // Ignore frequent non-critical scan errors
            }
          );
        } catch (e) {
          console.error('Error initializing scanner:', e);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          try {
            scannerRef.current.clear();
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      };
    }
  }, [isOpen, scanning]);

  const handleClose = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (e) {
        // Ignore
      }
    }
    setScanning(true);
    setStudentData(null);
    setError(null);
    onClose();
  };

  const handleScanAgain = () => {
    setScanning(true);
    setStudentData(null);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Animated Header */}
              <div className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-6 border-b border-border">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Scan Student QR</h2>
                    <p className="text-sm text-muted-foreground">Verify student credentials</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Scanner View */}
                {scanning && (
                  <div className="space-y-4">
                    <div id="qr-reader" className="rounded-xl overflow-hidden" />
                    <p className="text-sm text-muted-foreground text-center">
                      Point your camera at a student QR code
                    </p>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground">Fetching student data from IPFS...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="py-8 space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                        <XCircle className="w-8 h-8 text-destructive" />
                      </div>
                      <p className="text-destructive font-medium">{error}</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleScanAgain}>
                      Scan Again
                    </Button>
                  </div>
                )}

                {/* Student Result View */}
                {studentData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Status Badge */}
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${
                      studentData.verificationStatus === 'verified' 
                        ? 'bg-success/10 border border-success/20' 
                        : studentData.verificationStatus === 'rejected'
                        ? 'bg-destructive/10 border border-destructive/20'
                        : 'bg-warning/10 border border-warning/20'
                    }`}>
                      {studentData.verificationStatus === 'verified' ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : studentData.verificationStatus === 'rejected' ? (
                        <XCircle className="w-6 h-6 text-destructive" />
                      ) : (
                        <QrCode className="w-6 h-6 text-warning" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">
                          {studentData.verificationStatus === 'verified' ? 'Verified Student' : studentData.verificationStatus}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {studentData.verifiedAt 
                            ? `Processed on ${new Date(studentData.verifiedAt).toLocaleDateString()}`
                            : 'Awaiting verification'}
                        </p>
                      </div>
                    </div>

                    {/* Info Rows */}
                    <div className="space-y-3">
                      <InfoRow icon={User} label="Name" value={studentData.name} />
                      <InfoRow icon={Mail} label="Email" value={studentData.email} />
                      <InfoRow icon={Building2} label="College" value={studentData.college} />
                      <InfoRow icon={GraduationCap} label="Department" value={studentData.department} />
                      <InfoRow icon={Calendar} label="Graduation" value={studentData.graduationYear} />
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-2">
                       <MetadataBox label="Resume Hash (SHA-256)" icon={Hash} value={studentData.resumeHash} />
                       <MetadataBox label="Wallet Address" icon={QrCode} value={studentData.walletAddress} />
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleScanAgain}>
                      Scan Another
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper components for layout
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

const MetadataBox = ({ label, icon: Icon, value }) => (
  <div className="p-4 rounded-xl bg-muted/50">
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <code className="text-xs font-mono text-foreground break-all">
          {value}
        </code>
      </div>
    </div>
  </div>
);