import { Notification } from "../models/Notification.js";
import { getIO } from "../sockets/index.js";
import { logger } from "../utils/logger.js";

class NotificationService {
  /**
   * Creates a notification in DB and emits it via WebSocket.
   */
  async createAndEmitNotification({ recipientId, senderId = null, type, title, message, link = "" }) {
    try {
      // 1. Persist to DB
      const notification = await Notification.create({
        recipientId,
        senderId,
        type,
        title,
        message,
        link,
      });

      // 2. Emit Real-Time Event
      try {
        const io = getIO();
        io.to(recipientId.toString()).emit("notification", notification);
      } catch (wsError) {
        // We log WS errors but do not fail the function, 
        // as the notification is safely persisted in DB.
        logger.warn(`Failed to emit websocket notification to ${recipientId}: ${wsError.message}`);
      }

      return notification;
    } catch (error) {
      logger.error(`Error creating notification: ${error.message}`, { stack: error.stack });
      throw new Error("Failed to process notification");
    }
  }

  /**
   * Emits a real-time event to a specific user.
   */
  emitToUser(userId, event, data) {
    try {
      const io = getIO();
      if (io && userId) {
        io.to(userId.toString()).emit(event, data);
      }
    } catch (wsError) {
      if (typeof logger !== 'undefined' && logger.warn) {
        logger.warn(`Failed to emit real-time event ${event} to user ${userId}: ${wsError.message}`);
      } else {
        console.warn(`Failed to emit real-time event ${event} to user ${userId}: ${wsError.message}`);
      }
    }
  }

  /**
   * Fetch paginated notifications for a user.
   */
  async getUserNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ recipientId: userId }),
      Notification.countDocuments({ recipientId: userId, isRead: false }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { isRead: true },
      { new: true }
    );
    return notification;
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true }
    );
    return true;
  }
}

export const notificationService = new NotificationService();
