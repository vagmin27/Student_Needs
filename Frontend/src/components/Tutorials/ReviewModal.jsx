import React, { useState } from "react";
import PropTypes from "prop-types";
import Rate from "./Rate";
import API from "@/services/api/tutorialsApi.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * @param {props} props from parent component ClassHistory.jsx
 * @returns JSX of review modal
 */
function ReviewModal({ handleModal, currTutor }) {
  const [comment, setComment] = useState({
    tutor: currTutor.tutor,
    tutor_lastname: currTutor.last_name,
    review: "", // Initialized to avoid uncontrolled input warnings
  });

  /**
   * function that handles submit
   * @param {*} evt
   */
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { data: resMsg } = await API.post("/addReview", comment);
      alert(resMsg.msg);
      handleModal();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * function that handles change when user starts typing
   * @param {*} evt
   */
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && handleModal()}>
      <DialogContent className="max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold text-[var(--text-primary)]">
            We appreciate your feedback!
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--text-muted)] mt-1">
            Rate your session and share your experience with the tutor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 my-4">
          <div className="flex justify-center py-2 select-none">
            <Rate />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-[var(--text-secondary)] block"
              htmlFor="tutor-review-text"
            >
              Leave a review for the tutor
            </label>
            <textarea
              className="w-full min-h-[100px] p-3 text-sm rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-transparent transition-all resize-none"
              id="tutor-review-text"
              rows="4"
              name="review"
              value={comment.review}
              onChange={handleChange}
              placeholder="How was your session? What did you focus on?"
              required
            />
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
              className="w-full sm:w-auto h-10 text-xs font-bold" 
              type="submit"
            >
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

ReviewModal.propTypes = {
  handleModal: PropTypes.func,
  currTutor: PropTypes.object,
};

export default ReviewModal;

