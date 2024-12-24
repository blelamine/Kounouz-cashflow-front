// src/notificationPermission.js
export async function requestNotificationPermission() {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.error("Notification permission denied.");
    }
    return permission;
  }
  return "denied";
}
