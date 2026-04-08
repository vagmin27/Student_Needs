const axios = require('axios');

// Get jobs from Arbeitnow API
exports.getExternalJobs = async (req, res) => {
    try {
        const { page = 1 } = req.query;

        // Fetch jobs from Arbeitnow API
        const response = await axios.get(`https://www.arbeitnow.com/api/job-board-api`, {
            params: { page }
        });

        if (!response.data || !response.data.data) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch jobs from external API"
            });
        }

        // Transform the data to match our frontend needs
        const jobs = response.data.data.map(job => ({
            slug: job.slug,
            company_name: job.company_name,
            title: job.title,
            description: job.description,
            remote: job.remote,
            url: job.url,
            tags: job.tags || [],
            job_types: job.job_types || [],
            location: job.location,
            created_at: job.created_at
        }));

        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs,
            links: response.data.links || {},
            meta: response.data.meta || {}
        });

    } catch (error) {
        console.error("Error fetching external jobs:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching external jobs",
            error: error.message
        });
    }
};

// Search jobs from Arbeitnow API
exports.searchExternalJobs = async (req, res) => {
    try {
        const { search, page = 1 } = req.query;

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        // Fetch jobs from Arbeitnow API with search
        const response = await axios.get(`https://www.arbeitnow.com/api/job-board-api`, {
            params: { search, page }
        });

        if (!response.data || !response.data.data) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch jobs from external API"
            });
        }

        // Transform the data
        const jobs = response.data.data.map(job => ({
            slug: job.slug,
            company_name: job.company_name,
            title: job.title,
            description: job.description,
            remote: job.remote,
            url: job.url,
            tags: job.tags || [],
            job_types: job.job_types || [],
            location: job.location,
            created_at: job.created_at
        }));

        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs,
            links: response.data.links || {},
            meta: response.data.meta || {}
        });

    } catch (error) {
        console.error("Error searching external jobs:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error searching external jobs",
            error: error.message
        });
    }
};