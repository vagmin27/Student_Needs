import Student from "../../models/Referrals/StudentModel.js";
import Opportunity from "../../models/Referrals/OpportunityModel.js";
import { cosineSimilarity } from "../../utils/cosineSimilarity.js";

export const getRecommendedOpportunities = async (req, res) => {
    try {
        const studentId = req.user.id;
        
        // 1. Fetch Student Vector
        const student = await Student.findById(studentId).select("+embeddingVector skills branch college");
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        
        const studentVector = student.embeddingVector;
        
        if (!studentVector || studentVector.length === 0) {
            // Profile hasn't been embedded yet, return empty or fallback
            return res.status(200).json({
                success: true,
                data: [],
                message: "Update your profile to get AI recommendations.",
            });
        }

        // 2. Fetch Open Opportunities in the same college
        // Scalability Note: Currently O(N). In the future, this should be an Atlas Vector Search pipeline.
        const opportunities = await Opportunity.find({
            status: "Open",
            college: student.college,
        })
        .select("+embeddingVector")
        .populate('postedBy', 'firstName lastName company currentRole image')
        .populate('college', 'name matchingName');

        // 3. Compute Similarities
        const recommendations = opportunities.map(opp => {
            const oppVector = opp.embeddingVector;
            let score = 0;
            if (oppVector && oppVector.length > 0) {
                score = cosineSimilarity(studentVector, oppVector);
            }

            // Normalize score from [-1, 1] to [0, 100] percentage for UI
            const percentageMatch = Math.round(((score + 1) / 2) * 100);

            // Determine matched skills for explainability
            const matchedSkills = opp.requiredSkills.filter(skill => 
                student.skills?.some(s => s.toLowerCase() === skill.toLowerCase())
            );

            // Strip the huge vector from the response
            const oppObj = opp.toObject();
            delete oppObj.embeddingVector;

            return {
                opportunity: oppObj,
                similarityScore: percentageMatch,
                matchedSkills
            };
        });

        // 4. Sort by highest match, filter out very low matches (< 40%)
        const filteredRecommendations = recommendations
            .filter(r => r.similarityScore >= 40)
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, 10); // Return top 10

        return res.status(200).json({
            success: true,
            data: filteredRecommendations,
            message: "Recommendations generated successfully",
        });

    } catch (error) {
        console.error("Recommendation Engine Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate recommendations",
        });
    }
};
