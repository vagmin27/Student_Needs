import { ContactMessage } from "../models/ContactMessage.js";

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields (name, email, subject, message)",
      });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully. We will be in touch soon!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit message: " + error.message,
    });
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private (Admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve messages: " + error.message,
    });
  }
};

// @desc    Mark inquiry as read
// @route   PATCH /api/contact/:id/read
// @access  Private (Admin)
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Inquiry message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update message: " + error.message,
    });
  }
};

// @desc    Delete inquiry message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Inquiry message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete message: " + error.message,
    });
  }
};
