import React, { useState, useEffect } from "react";
import "../../styles/Tutorials/BookModal.css";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const MODAL_ROOT_ID = "modal-root";

function getModalRoot() {
  const el = document.getElementById(MODAL_ROOT_ID);
  if (!el) {
    throw new Error(
      `Booking modal requires #${MODAL_ROOT_ID} in index.html (portal target missing)`
    );
  }
  return el;
}

function BookModal({
  open,
  handleModal,
  confirmClasses,
  tutorProfile,
  availability = [],
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedSlot(null);
    }
  }, [open, availability]);

  if (!open) return null;
  if (!mounted) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error("modal-root element not found in DOM");
    return null;
  }

  const profile = tutorProfile?.profile || {};
  const tutorName = profile.fName || tutorProfile?.first_name || "Tutor";

  const groupedSlots = availability.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return createPortal(
    <div className="overlay">
      <div className="modalContainer">
        <div className="modalRight">
          <p className="closeBtn" onClick={handleModal}>
            <i className="fa-regular fa-x"></i>
          </p>

          <div className="content">
            {Object.keys(groupedSlots).length === 0 ? (
              <p>No available slots for this tutor. Check back later.</p>
            ) : (
              Object.entries(groupedSlots)?.map(([date, slots]) => (
                <div className="time" key={date}>
                  <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    {date}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {slots?.map((slot, i) => {
                      const isSelected =
                        selectedSlot?.date === slot.date &&
                        selectedSlot?.time === slot.time;

                      return (
                        <button
                          key={`${date}-${slot.time}-${i}`}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          disabled={slot.isBooked}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: isSelected
                              ? "2px solid #ff7a2f"
                              : "1px solid #ccc",
                            background: isSelected ? "#fff3ec" : "#fff",
                            color: isSelected ? "#ff7a2f" : "#333",
                            fontWeight: isSelected ? "bold" : "normal",
                            cursor: slot.isBooked ? "not-allowed" : "pointer",
                          }}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="btnContainer">
          <button
            type="button"
            className="confirmBtn"
            onClick={() => confirmClasses(selectedSlot)}
            disabled={!selectedSlot}
            style={{
              background: selectedSlot ? "#ff7a2f" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 32px",
              cursor: selectedSlot ? "pointer" : "not-allowed",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
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
