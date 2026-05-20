import myDB from "../../db/Tutorials/myDB.js";

export const addReview = async (req, res) => {
  try {
    const { tutor, tutor_lastname, review } = req.body;

    if (!tutor || !tutor_lastname || !review) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    await myDB.addReview(tutor, tutor_lastname, review.trim());

    res.status(201).json({ msg: "Review Added Successfully!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getReviewsByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const reviews = await myDB.getReviewsByTutor(tutorId);

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await myDB.deleteReview(reviewId);

    res.status(200).json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};