const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const quizContainer = document.getElementById('quiz-container'); // New element for quiz

// Replace 'ws://your-server.com:port' with your actual WebSocket endpoint
const socket = new WebSocket('ws://your-server.com:port');

// Define quiz question and answer options (replace with your actual content)
const quizQuestion = "What is the capital of France?";
const answerOptions = ["London", "Berlin", "Paris", "Rome", "Madrid"];

function displayQuiz() {
  const quizHTML = `
    <h2>Pre-Chat Quiz</h2>
    <p>${quizQuestion}</p>
    <ul>`;

  // Generate list of answer options with radio buttons
  for (const option of answerOptions) {
    quizHTML += `<li><input type="radio" name="answer" value="${option}"> ${option}</li>`;
  }

  quizHTML += `</ul>`;
  quizContainer.innerHTML = quizHTML;
}

function submitQuiz() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    socket.send(JSON.stringify({ type: 'initiate_chat', answer: answer }));
    quizContainer.style.display = 'none'; // Hide quiz after submission
    messageInput.style.display = 'block'; // Show message input field
    sendButton.style.display = 'block'; // Show send button
  } else {
    alert('Please select an answer before starting the chat.');
  }
}

socket.onopen = function(event) {
  console.log('Connection established!');
  displayQuiz(); // Display quiz on connection open
};

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.type === 'message') {
    // Append received message to chat window
    chatWindow.innerHTML += `<p><b>Helpdesk:</b> ${data.message}</p>`;
  } else if (data.type === 'agent_joined') {
    // Display notification that an agent joined the chat
    chatWindow.innerHTML += `<p><i>A helpdesk agent has joined the chat.</i></p>`;
  }
};

sendButton.addEventListener('click', function() {
  const message = messageInput.value;
  // Clear input field
  messageInput.value = '';
  if (message.trim()) {
    socket.send(JSON.stringify({ type: 'message', message: message }));
    chatWindow.innerHTML += `<p><b>You:</b> ${message}</p>`;
  }
});

// Event listener for quiz submit button (replace with actual button element)
document.getElementById('submit-quiz-btn').addEventListener('click', submitQuiz);

// Hide message input and send button initially (shown after quiz submission)
messageInput.style.display = 'none';
sendButton.style.display = 'none';
