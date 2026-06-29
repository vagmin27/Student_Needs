import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

/**
 * component that renders star ratings in Review Modal
 * Source: https://youtu.be/eDw46GYAIDQ
 */
function Rate() {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[...Array(5)]?.map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
              style={{ display: "none" }}
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
            <FaStar
              className="star"
              color={
                ratingValue <= (hover || rating)
                  ? "var(--warning)"
                  : "var(--border-color)"
              }
              size={40}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => {
                setHover(null);
              }}
              style={{ cursor: "pointer" }}
            />
          </label>
        );
      })}
    </div>
  );
}

Rate.propTypes = {};

export default Rate;