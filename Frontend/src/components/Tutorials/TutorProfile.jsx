import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/services/api/tutorialsApi.js";
import defaultAvatar from "../../assets/images/bulb2.png";
import { PremiumCard } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";

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
  const navigate = useNavigate();
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
    for (let i = 0; i < 5; i++) {
      s.push(
        <Star
          key={i}
          className={`w-4 h-4 inline-block ${
            i < num ? "text-amber-400 fill-amber-400" : "text-border"
          }`}
        />
      );
    }
    return s;
  };

  return (
    <div role="main" className="space-y-6">
      <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
        {searchSize} Search Results for &quot;{query}&quot;
      </h1>

      <div className="flex">
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[var(--accent)] transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {displayPairs?.map((tutorData, idx) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" key={idx}>
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

              const tutorStars = tutorProfile.stars || tutorProfile.rating || 0;
              const tutorRatings =
                tutorProfile.num_of_ratings || tutorProfile.numRatings || 0;

              const tutorEducation = tutorProfile.education || "Not specified";

              const tutorPic =
                tutorProfile.profilePic || tutorProfile.pic || tutorProfile.image || null;

              const imageSrc = tutorPic
                ? tutorPic.startsWith("http")
                  ? tutorPic
                  : `${BASE_URL}/uploads/${tutorPic}`
                : defaultAvatar;

              return (
                <PremiumCard
                  key={tutorProfile._id}
                  glow={false}
                  hoverEffect={true}
                  className="cursor-pointer flex flex-col justify-between p-6 transition-all duration-300 h-full border border-[var(--border-color)] bg-[var(--card-bg)]"
                  onClick={(evt) => {
                    evt.preventDefault();
                    searchProfile(tutorProfile);
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                    <img
                      className="w-20 h-20 rounded-full object-cover border-2 border-[var(--border-color)] shadow-sm shrink-0"
                      src={imageSrc}
                      alt={`image of ${tutorName}`}
                    />
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">Tutor: {tutorName}</h3>
                      <p className="text-sm font-semibold text-[var(--accent)]">{tutorSubject}</p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 text-xs text-[var(--text-muted)]">
                        <div className="flex gap-0.5 mr-1">{starReview(tutorStars)}</div>
                        <span>({tutorRatings} ratings)</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                        Education: <span className="text-[var(--text-secondary)] font-medium">{tutorEducation}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-2 select-none w-full">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        searchProfile(tutorProfile);
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tutorials/chat?tutorId=${tutorProfile._id}`);
                      }}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Message
                    </Button>
                  </div>
                </PremiumCard>
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