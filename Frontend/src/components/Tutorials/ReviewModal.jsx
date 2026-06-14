import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/Tutorials/ReviewModal.css";
import PropTypes from "prop-types";
import Rate from "./Rate";
import API from "@/services/api/tutorialsApi.js";

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

  return ReactDOM.createPortal(
    <div
      className="overlay"
      style={{
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        display: "grid",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--glass-bg)",
      }}
    >
      <div className="modalContainerReview">
        <div className="modalRightReview">
          <p className="closeBtnReview" onClick={handleModal}>
            <i className="fa-regular fa-x"></i>
          </p>
          <div className="contentReview">
            <p className="titleReview">We appreciate your feedback ! </p>
            <div className="StarDiv">
              <Rate />
            </div>

            <div className="form-group">
              <form onSubmit={handleSubmit}>
                <label
                  className="textTitle"
                  htmlFor="exampleFormControlTextarea1"
                >
                  Leave a review for the tutor
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="6"
                  name="review"
                  value={comment.review}
                  onChange={handleChange}
                ></textarea>
                <span className="submitBtnSpan">
                  <button className="reviewBtn" type="submit">
                    Submit Review
                  </button>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modalRootAddReview")
  );
}

ReviewModal.propTypes = {
  handleModal: PropTypes.func,
  currTutor: PropTypes.object,
};

export default ReviewModal;
