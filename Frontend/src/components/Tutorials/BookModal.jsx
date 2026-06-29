import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

function BookModal({
  open,
  handleModal,
  confirmClasses,
  tutorProfile,
  availability = [],
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedSlot(null);
    }
  }, [open, availability]);

  const profile = tutorProfile?.profile || {};
  const tutorName = profile.fName || tutorProfile?.first_name || "Tutor";

  const groupedSlots = availability.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleModal()}>
      <DialogContent className="max-w-lg bg-[var(--card-bg)] border border-[var(--border-color)] max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold text-[var(--text-primary)]">
            Book Class with {tutorName}
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--text-muted)] mt-1">
            Choose an available date and time slot below to confirm your booking.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-1 my-4 space-y-4 min-h-[150px] max-h-[45vh]">
          {Object.keys(groupedSlots).length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] italic text-center py-6">
              No available slots for this tutor. Check back later.
            </p>
          ) : (
            Object.entries(groupedSlots)?.map(([date, slots]) => (
              <div className="space-y-2" key={date}>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {date}
                </p>
                <div className="flex flex-wrap gap-2">
                  {slots?.map((slot, i) => {
                    const isSelected =
                      selectedSlot?.date === slot.date &&
                      selectedSlot?.time === slot.time;

                    return (
                      <button
                        key={`${date}-${slot.time}-${i}`}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2.5 rounded-[var(--radius-md)] border text-xs font-semibold transition-all flex flex-col items-center justify-center shrink-0 cursor-pointer min-w-[90px] ${
                          isSelected
                            ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm hover:opacity-95"
                            : "bg-[var(--bg-secondary)]/30 border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/80 hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <div>{slot.time}</div>
                        {slot.bookingCount > 0 && (
                          <span className={`text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                            👥 {slot.bookingCount} enrolled
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2 justify-end select-none">
          <Button
            type="button"
            variant="outline"
            onClick={handleModal}
            className="w-full sm:w-auto h-10 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => confirmClasses(selectedSlot)}
            disabled={!selectedSlot}
            className="w-full sm:w-auto h-10 text-xs font-bold"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

BookModal.propTypes = {
  open: PropTypes.bool,
  handleModal: PropTypes.func,
  confirmClasses: PropTypes.func,
  tutorProfile: PropTypes.object,
  availability: PropTypes.array,
};

export default BookModal;

