import React from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Module that renders pagination for tutor search page
 * @param {prop} prop passed from BookClass.jsx
 * @returns JSX of pagination
 */
function TutorPagination({ choosePage }) {
  return (
    <div className="flex justify-center items-center gap-4 mt-8 select-none">
      <Button
        variant="outline"
        size="sm"
        onClick={(evt) => {
          evt.preventDefault();
          choosePage("prev");
        }}
        className="flex items-center gap-1 h-9 px-4 text-xs font-semibold"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={(evt) => {
          evt.preventDefault();
          choosePage("next");
        }}
        className="flex items-center gap-1 h-9 px-4 text-xs font-semibold"
      >
        Next <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

TutorPagination.propTypes = {
  choosePage: PropTypes.func,
};

export default TutorPagination;