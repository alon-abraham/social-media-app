import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead } from '../redux/notificationSlice';

function NotificationList() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} style={{ background: notification.isRead ? '#f3f3f3' : '#fff' }}>
            <p>{notification.message}</p>
            {!notification.isRead && (
              <button onClick={() => handleMarkAsRead(notification._id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationList;
