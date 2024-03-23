const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Define user and helpdesk tracking (replace with database or session management)
let users = []; // Array of objects containing user ID and waitlist status

let helpdesks = []; // Array of helpdesk IDs (can be expanded to include helpdesk details)

app.use(express.static('public')); // Serve static files from the 'public' directory

io.on('connection', (socket) => {
  console.log('User connected!');

  // Handle user connection requests and add to user list with waitlist flag
  socket.on('initiate_chat', () => {
    users.push({ id: socket.id, isWaiting: true });
1
    const position = users.findIndex((user) => user.id === socket.id);
    socket.emit('waitlist_position', position + 1); // Inform user of their position
  });

  // Handle messages from user and broadcast to assigned helpdesk
  socket.on('message', (msg) => {
    const helpdesk = getAssignedhelpdesk(socket.id); // Replace with logic to find user's helpdesk
    if (helpdesk) {
      io.to(helpdesk).emit('message', { message: msg, user: socket.id });
    }
  });

  // Handle user disconnection and remove from user list
  socket.on('disconnect', () => {
    users = users.filter((user) => user.id !== socket.id);
    // Notify helpdesk about user disconnect (logic not implemented here)
  });
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Function to get an available helpdesk and handle waitlist (replace with actual implementation)
function getAvailablehelpdesk() {
  // Check if any helpdesks are available
  const helpdesk = helpdesks.length > 0 ? helpdesks[0] : null;
  if (helpdesk && users.length > 0) {
    // Find the next user in the waitlist
    const nextUser = users.find((user) => user.isWaiting === true);
    if (nextUser) {
      // Remove user from waitlist and update state
      users = users.filter((user) => user.id !== nextUser.id);
      nextUser.isWaiting = false;
      return helpdesk;
    }
  }
  return null;
}

// Function to get the assigned helpdesk for a user (replace with actual implementation)
function getAssignedhelpdesk(userId) {
  // Retrieve user's associated helpdesk ID
  const user = users.find((user) => user.id === userId);
  if (user && user.helpdeskId) {
    // Find the matching helpdesk object
    const helpdesk = helpdesks.find((helpdesk) => helpdesk.id === user.helpdeskId);
    return helpdesk;
  } else {
    // No helpdesk assigned or user not found
    return null;
  }
}
