import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/services/api/tutorialsApi.js";
import defaultAvatar from "../../assets/images/bulb2.png";
import { PremiumCard } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Star, MessageSquare, Calendar } from "lucide-react";

function TutorInfo({ tutorProfile, returnToSearch, handleModal }) {
  const navigate = useNavigate();
  // ✅ SAFETY: prevent crash
  if (!tutorProfile) {
    return <div>Loading tutor...</div>;
  }

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

  const handleClick = () => {
    returnToSearch();
  };

  return (
    <div className="space-y-8" role="main">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[var(--accent)] transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: Tutor details */}
        <div className="lg:col-span-1 space-y-6">
          <PremiumCard glow={true} className="text-center p-6 border border-[var(--border-color)] bg-[var(--card-bg)]">
            <div className="flex flex-col items-center">
              <img
                className="w-32 h-32 rounded-full object-cover border-4 border-[var(--border-color)] shadow-md mb-4"
                src={imageSrc}
                alt={`image of ${firstName}`}
              />
              <h2 className="text-xl font-black text-[var(--text-primary)]">
                Tutor: {firstName} {lastName}
              </h2>
              <p className="text-sm font-semibold text-[var(--accent)] mt-1">{subjects}</p>
              
              <div className="flex items-center gap-1.5 mt-2 justify-center text-xs text-[var(--text-muted)]">
                <div className="flex gap-0.5">{starReview(stars)}</div>
                <span>({numRatings} ratings)</span>
              </div>
              
              <hr className="w-full my-4 border-[var(--border-color)]" />
              
              <div className="text-left w-full space-y-2">
                <p className="text-xs text-[var(--text-muted)]">
                  Education: <span className="text-[var(--text-secondary)] font-semibold">{education}</span>
                </p>
              </div>
            </div>
          </PremiumCard>
          
          <div className="flex flex-col gap-3 select-none">
            <Button
              className="w-full h-11 text-sm font-bold"
              onClick={handleModal}
            >
              <Calendar className="w-4 h-4 mr-2" /> Book Class with {firstName}
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 text-sm font-semibold"
              onClick={() => {
                navigate(`/tutorials/chat?tutorId=${tutorProfile._id}`);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Message {firstName}
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Reviews list */}
        <div className="lg:col-span-2 space-y-6" tabIndex="0">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Student Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] italic">No reviews available yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews?.map((review, idx) => {
                const regex = /Tutor/i;
                const r = review.replace(regex, firstName);

                return (
                  <div 
                    key={`tutor_${idx}`} 
                    className="p-4 bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-md transition-shadow"
                  >
                    <blockquote className="border-l-4 border-[var(--accent)]/40 pl-4 py-1 italic text-sm text-[var(--text-secondary)] leading-relaxed">
                      &ldquo;{r}&rdquo;
                    </blockquote>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TutorInfo.propTypes = {
  tutorProfile: PropTypes.object,
  returnToSearch: PropTypes.func,
  handleModal: PropTypes.func,
};

export default TutorInfo;