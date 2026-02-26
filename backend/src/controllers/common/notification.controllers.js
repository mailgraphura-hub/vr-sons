import Notification from "../../models/common/notification.model.js"


const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id; 

    const notifications = await Notification.find({ userId, isRead:false })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { isRead: true });

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {createNotification, getUserNotifications, getUnreadCount, markAsRead, deleteNotification};