import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/Tutorials/TutorProfile.css";
import { BASE_URL } from "@/services/api/tutorialsApi.js";
import defaultAvatar from "../../assets/images/bulb2.png";


/**
 * @param {props} searchData object and query string
 * @returns JSX of tutor profiles
 */
function TutorProfile({
  searchData,
  query,
  handleReturn,
  searchProfile,
  searchSize,
}) {
  const [displayPairs, setDisplayPairs] = useState([]);

  /**
   * This function creates the tutor profiles in pairs
   */
  useEffect(() => {
    try {
      // push a new copy to pairs array each time
      let pairs = [];
      let i = 0;
      while (i < searchData.length) {
        // Preserved original logic check
        if (searchData.length) {
          pairs.push(searchData.slice(i, (i += 2)));
        }
      }
      setDisplayPairs(pairs);
    } catch (err) {
      console.error(err);
    }
  }, [searchData]);

  // This function handles the back button
  const handleClick = () => {
    window.localStorage.removeItem("Current_Query");
    handleReturn();
  };

  /**
   * function that generates number of stars in tutor profile
   * @param {int} num of stars
   * @returns star icon JSX element
   */
  const starReview = (num) => {
    let s = [];
    for (let i = 0; i < num; i++) {
      s.push(<i key={i} className="fa-solid fa-star" />);
    }
    return s;
  };

  return (
    <div role="main">
      <h1 className="searchRes">
        {searchSize} Search Results for &quot;{query}&quot;
      </h1>

      <div className="backDiv">
        <span className="back" onClick={handleClick} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-arrow-left-long" /> Back to Search
        </span>
      </div>
      <div className="imgRender">
        {displayPairs?.map((tutorData, idx) => (
          <div className="card-group " key={idx}>
            {tutorData?.map((tutorProfile) => {
              // ✅ NORMALIZE FIELDS
              const tutorName =
                tutorProfile.name ||
                `${tutorProfile.first_name || ""} ${
                  tutorProfile.last_name || ""
                }`.trim() ||
                "Unknown Tutor";

              const tutorSubject =
                tutorProfile.expertise || tutorProfile.subjects || "N/A";

              const tutorPic =
                tutorProfile.profilePic || tutorProfile.pic || tutorProfile.image || null;

              const tutorStars = tutorProfile.stars || tutorProfile.rating || 0;
              const tutorRatings =
                tutorProfile.num_of_ratings || tutorProfile.numRatings || 0;

              const tutorEducation = tutorProfile.education || "Not specified";

              const imageSrc = tutorPic
                ? tutorPic.startsWith("http")
                  ? tutorPic
                  : `${BASE_URL}/uploads/${tutorPic}`
                : defaultAvatar;

              return (
                <div
                  className="card container cardimage"
                  key={tutorProfile._id}
                  onClick={(evt) => {
                    evt.preventDefault();
                    searchProfile(tutorProfile);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h2 className="card-title-tutor">Tutor : {tutorName}</h2>
                    <img
                      className="imgs"
                      src={imageSrc}
                      alt={`image of ${tutorName}`}
                    />
                    <div className="card-text-div">
                      <p className="card-text">
                        Subject: {tutorSubject}
                        <br />
                        Ratings: {starReview(tutorStars)} by {tutorRatings}{" "}
                        members
                        <br />
                        Education: {tutorEducation}
                      </p>
                    </div>
                    <div className="cardlink"></div>
                  </div>
                </div>
              );
            })}

          </div>
        ))}
      </div>
    </div>
  );
}

TutorProfile.propTypes = {
  searchData: PropTypes.array,
  query: PropTypes.string,
  handleReturn: PropTypes.func,
  searchProfile: PropTypes.func,
  searchSize: PropTypes.number,
};

export default TutorProfile;