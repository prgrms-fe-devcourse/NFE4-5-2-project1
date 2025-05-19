import {useState} from "react";

export const useNotificationModal = () => {
  const [isShowNotifications, setIsShowNotifications] = useState(false);

  const showNotifications = () => {
    setIsShowNotifications(true);
  };

  const closeNotifications = () => {
    setIsShowNotifications(false);
  };

  return {
    isShowNotifications,
    showNotifications,
    closeNotifications,
  };
};
