import React from "react";
import PropTypes from "prop-types";
import "../../styles/Tutorials/TutorInfo.css";
import { BASE_URL } from "../../utils/Tutorials/api";
import defaultAvatar from "../assets/images/bulb2.png";


function TutorInfo({ tutorProfile, returnToSearch, handleModal }) {
  // ✅ SAFETY: prevent crash
  if (!tutorProfile) {
    return <div>Loading tutor...</div>;
  }

  // ✅ normalize data (STATIC + DB support)
  const profile = tutorProfile?.profile || {};

  const firstName =
    tutorProfile.name ||
    tutorProfile.fName ||
    tutorProfile.first_name ||
    "Tutor";
  const lastName = tutorProfile.lName || tutorProfile.last_name || "";
  const subjects =
    tutorProfile.expertise || tutorProfile.subjects || "Not specified";

  const tutorPic = tutorProfile.profilePic || tutorProfile.pic || tutorProfile.image || null;
  const imageSrc = tutorPic
    ? tutorPic.startsWith("http")
      ? tutorPic
      : `${BASE_URL}/uploads/${tutorPic}`
    : defaultAvatar;

  const reviews = tutorProfile.reviews || [];
  const stars = tutorProfile.stars || tutorProfile.rating || 0;
  const numRatings = tutorProfile.num_of_ratings || tutorProfile.numRatings || 0;
  const education = tutorProfile.education || "Not specified";


  // ⭐ star generator
  const starReview = (num) => {
    let s = [];
    for (let i = 0; i < num; i++) {
      s.push(<i key={i} className="fa-solid fa-star" />);
    }
    return s;
  };

  const handleClick = () => {
    returnToSearch();
  };

  return (
    <>
      <div className="card-group2" role="main">
        <div className="card2 container-xl">
          <div className="card-body2">
            <div className="row rowDiv">
              
              {/* LEFT SIDE */}
              <div className="col div1">
                <h1 className="card-title2">
                  Tutor : {firstName} {lastName}
                </h1>

                <img
                  className="imgs2"
                  src={imageSrc}
                  alt={`image of ${firstName}`}
                />

                <div className="card-text-div2">
                  <p className="card-text2">
                    Subject: {subjects}
                    <br />
                    Ratings: {starReview(stars)} by {numRatings} members
                    <br />
                    Education: {education}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col div2" tabIndex="0">
                <h2 className="student">Student Reviews</h2>

                {reviews.length === 0 ? (
                  <p>No reviews available</p>
                ) : (
                  reviews.map((review, idx) => {
                    const regex = /Tutor/i;
                    const r = review.replace(regex, firstName);

                    return (
                      <div className="innerDiv" key={`tutor_${idx}`}>
                        <section className="rectangle">
                          <div className="wrapper">
                            <div className="review">
                              <div className="review-base">
                                <blockquote
                                  className={
                                    idx % 2 === 0
                                      ? "review-text"
                                      : "review-text2"
                                  }
                                >
                                  {r}
                                </blockquote>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <span className="btnSpan">
            <button className="bookBtnTutor" onClick={handleModal}>
              Book Class with {firstName}
            </button>
          </span>
        </div>

        {/* BACK BUTTON */}
        <div className="backDiv">
          <span className="back">
            <button className="backBtn" onClick={handleClick}>
              <i className="fa-solid fa-arrow-left-long" /> Back to Search
            </button>
          </span>
        </div>
      </div>
    </>
  );
}

TutorInfo.propTypes = {
  tutorProfile: PropTypes.object,
  returnToSearch: PropTypes.func,
  handleModal: PropTypes.func,
};

export default TutorInfo;