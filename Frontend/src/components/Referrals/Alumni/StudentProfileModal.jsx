import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Link,
  FileText,
  Star,
  Briefcase,
  Code,
  Award,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { applicationsApi } from "@/services/application";
import { showToast } from "@/components/TransactionToast";

/**
 * Modal component to display a detailed student profile to alumni/verifiers.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility
 * @param {Function} props.onClose - Close handler
 * @param {Object|null} props.student - Student profile data object
 * @param {boolean} [props.loading] - Loading state for fetching data
 */
export function StudentProfileModal({ isOpen, onClose, student, loading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : student ? (
            <div className="p-6">
              {/* Header Section */}
              <div className="flex items-start gap-6 pb-6 border-b border-border/50">
                <div className="flex-shrink-0">
                  {student.image ? (
                    <img
                      src={student.image}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    {student.branch || "Student"} • Class of{" "}
                    {student.graduationYear || "N/A"}
                  </p>

                  {student.profileCompleteness !== undefined && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[200px]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            student.profileCompleteness >= 80
                              ? "bg-success"
                              : student.profileCompleteness >= 50
                                ? "bg-yellow-500"
                                : "bg-destructive",
                          )}
                          style={{ width: `${student.profileCompleteness}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {student.profileCompleteness}% complete
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(student.linkedIn?.linkedInUrl || student.linkedinUrl) && (
                      <a
                        href={
                          student.linkedIn?.linkedInUrl || student.linkedinUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-sm hover:bg-blue-500/20 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                        LinkedIn
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {student.githubUrl && (
                      <a
                        href={
                          student.githubUrl.startsWith("http")
                            ? student.githubUrl
                            : `https://github.com/${student.githubUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-500/10 text-gray-400 text-sm hover:bg-gray-500/20 transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {student.portfolioUrl && (
                      <a
                        href={student.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-sm hover:bg-purple-500/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contact Information
                    </h3>
                    <div className="space-y-2 bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{student.email}</span>
                      </div>
                      {student.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {student.phone}
                          </span>
                        </div>
                      )}
                      {(student.city || student.state || student.address) && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {[student.address, student.city, student.state]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">
                            {student.college?.name || "College not specified"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.branch || "Branch not specified"}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            Expected Graduation:{" "}
                            {student.graduationYear || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {student.resume?.fileName && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Resume
                      </h3>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {student.resume.fileName}
                              </p>
                              {student.resume.fileSize && (
                                <p className="text-xs text-muted-foreground">
                                  {(student.resume.fileSize / 1024).toFixed(1)}{" "}
                                  KB
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                await applicationsApi.downloadStudentResume(
                                  student._id,
                                );
                                showToast({
                                  type: "success",
                                  message: "Resume downloaded!",
                                });
                              } catch (error) {
                                showToast({
                                  type: "error",
                                  message: "Failed to download resume",
                                });
                              }
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {student.bio && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        About
                      </h3>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm text-foreground leading-relaxed">
                          {student.bio}
                        </p>
                      </div>
                    </div>
                  )}

                  {student.skills && student.skills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.experience && student.experience.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Experience
                      </h3>
                      <div className="space-y-3">
                        {student.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="bg-muted/30 rounded-lg p-4"
                          >
                            <p className="font-medium text-foreground">
                              {exp.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {exp.company}
                            </p>
                            {exp.description && (
                              <p className="text-sm text-foreground mt-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.projects && student.projects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Projects
                      </h3>
                      <div className="space-y-3">
                        {student.projects.map((project, index) => (
                          <div
                            key={index}
                            className="bg-muted/30 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-foreground">
                                {project.title || project.name}
                              </p>
                              {project.link && (
                                <a
                                  href={
                                    project.link.startsWith("http")
                                      ? project.link
                                      : `https://${project.link}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                            {project.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {project.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50 flex justify-end">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              <p>Student profile not found</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}