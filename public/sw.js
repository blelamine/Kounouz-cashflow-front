// public/firebase-messaging-sw.js
self.addEventListener("push", function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/favicon-32x32.png", // Add your icon here
  });
});
// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();

//   // Add your logic to open the app when notification is clicked
//   event.waitUntil(
//     clients.openWindow('your-app-url')
//   );
// });
// self.addEventListener("install", function (event) {
//   // Perform installation tasks, like precaching assets
//   // This event is triggered once when the service worker is installed
// });

// Activation
// self.addEventListener("activate", function (event) {
//   // Perform activation tasks, like cleaning up old caches
//   // This event is triggered once when the service worker is activated
// });
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Open your PWA or web app when the notification is clicked
  event.waitUntil(clients.openWindow("https://cashflow.taysirsolutions.net"));
});
