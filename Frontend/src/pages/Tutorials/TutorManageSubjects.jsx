import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, BookPlus, Pencil, Trash2 } from "lucide-react";
import API, { TUTOR_ATTENDANCE_PATHS } from "@/services/Attendance/tutorAttendanceApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default function TutorManageSubjects() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: "add", id: null, name: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorSubjects);
      setSubjects(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const saveSubject = async () => {
    const name = modal.name.trim();
    if (!name) {
      toast.error("Subject name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (modal.mode === "add") {
        await API.post(TUTOR_ATTENDANCE_PATHS.tutorSubjects, { subjectName: name });
        toast.success("Subject added");
      } else {
        await API.put(TUTOR_ATTENDANCE_PATHS.tutorSubject(modal.id), {
          subjectName: name,
        });
        toast.success("Subject updated");
      }
      setModal({ open: false, mode: "add", id: null, name: "" });
      await loadSubjects();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSubject = async (id, name) => {
    if (
      !window.confirm(
        `Delete "${name}"? This is only allowed if no attendance has been recorded for it.`
      )
    ) {
      return;
    }
    try {
      await API.delete(TUTOR_ATTENDANCE_PATHS.tutorSubject(id));
      toast.success("Subject deleted");
      await loadSubjects();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <Link
        to="/tutorials/attendance"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Attendance Hub
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tutor Subjects</h1>
          <p className="text-muted-foreground mt-1">
            Add courses you teach. The attendance page uses these subjects in the
            dropdown.
          </p>
        </div>
        <Button onClick={() => setModal({ open: true, mode: "add", id: null, name: "" })}>
          <BookPlus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your subjects</CardTitle>
          <CardDescription>
            Examples: Java Programming, Web Development, Python, DSA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="spinner spinner-lg" />
            </div>
          ) : subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No subjects yet. Add a subject before marking attendance.
            </p>
          ) : (
            <ul className="divide-y rounded-[var(--radius-sm)] border">
              {subjects.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="font-medium">{s.subjectName}</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setModal({
                          open: true,
                          mode: "edit",
                          id: s._id,
                          name: s.subjectName,
                        })
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSubject(s._id, s.subjectName)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={modal.open} onOpenChange={(open) => !open && setModal({ ...modal, open: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.mode === "add" ? "Add Subject" : "Edit Subject"}
            </DialogTitle>
          </DialogHeader>
          <input
            type="text"
            className="w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 py-2 text-sm"
            placeholder="e.g. Java Programming"
            value={modal.name}
            onChange={(e) => setModal({ ...modal, name: e.target.value })}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ ...modal, open: false })}>
              Cancel
            </Button>
            <Button onClick={saveSubject} disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
