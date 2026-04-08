// ElevenLabs Conversational AI Interview Controller

// Get Signed URL for ElevenLabs Conversation
exports.getSignedUrl = async (req, res) => {
    try {
        console.log("getSignedUrl called");
        console.log("Environment variables:", {
            AGENT_ID: process.env.AGENT_ID ? "set" : "not set",
            ELEVENLABS_AGENT_ID: process.env.ELEVENLABS_AGENT_ID ? "set" : "not set",
            ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY ? "set" : "not set",
        });

        const AGENT_ID = process.env.AGENT_ID || process.env.ELEVENLABS_AGENT_ID;
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

        // Check for required environment variables
        if (!AGENT_ID || !ELEVENLABS_API_KEY) {
            console.log("Missing environment variables");
            return res.status(500).json({
                success: false,
                message: "Missing ElevenLabs environment variables (AGENT_ID or ELEVENLABS_API_KEY)",
            });
        }

        console.log("Fetching signed URL from ElevenLabs API with AGENT_ID:", AGENT_ID);

        // Fetch signed URL from ElevenLabs API with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const response = await fetch(
                `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
                {
                    headers: {
                        "xi-api-key": ELEVENLABS_API_KEY,
                    },
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            console.log("ElevenLabs API response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("ElevenLabs API error:", errorText);
                return res.status(500).json({
                    success: false,
                    message: "Failed to get signed URL from ElevenLabs",
                    error: errorText,
                });
            }

            const data = await response.json();
            console.log("Successfully got signed URL");

            return res.status(200).json({
                success: true,
                signedUrl: data.signed_url,
                message: "Signed URL generated successfully",
            });
        } catch (fetchError) {
            clearTimeout(timeout);
            if (fetchError.name === 'AbortError') {
                console.error("Request timeout");
                return res.status(504).json({
                    success: false,
                    message: "Request timeout. Please try again.",
                });
            }
            throw fetchError;
        }

    } catch (error) {
        console.error("Get signed URL error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get signed URL. Please try again.",
            error: error.message,
        });
    }
}