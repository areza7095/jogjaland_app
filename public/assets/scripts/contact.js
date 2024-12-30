document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('messageForm');
    const messagesList = document.getElementById('messagesList');
    const confirmationMessage = document.getElementById('confirmationMessage');
  
    // Fetch existing messages when the page loads
    fetch('/messages')
      .then((response) => response.json())
      .then((messages) => {
        messages.forEach((message) => {
          addMessageToList(
            message.firstName,
            message.lastName,
            message.message,
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s' // Default avatar
          );
        });
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  
    // Handle form submission
    messageForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
  
      // Validate input
      if (!firstName || !lastName || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }
  
      // Send the message to the server
      fetch('/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, message }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Message saved successfully!') {
            // Show confirmation message
            confirmationMessage.textContent = 'Message sent successfully!';
            confirmationMessage.classList.remove('hidden');
  
            // Add new message to the list
            addMessageToList(
              firstName,
              lastName,
              message,
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s' // Default avatar
            );
  
            // Reset form
            messageForm.reset();
  
            // Hide confirmation message after 3 seconds
            setTimeout(() => {
              confirmationMessage.classList.add('hidden');
            }, 3000);
          } else {
            alert('Failed to send message.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
        });
    });
  
    // Function to add a message to the list
    function addMessageToList(firstName, lastName, message, avatarUrl) {
      const messageItem = document.createElement('div');
      messageItem.classList.add('message-item');
  
      messageItem.innerHTML = `
        <div class="message-avatar">
          <img src="${avatarUrl}" alt="${firstName} ${lastName}'s Avatar">
        </div>
        <div class="message-content">
          <strong>${firstName} ${lastName}</strong>
          <p>${message}</p>
        </div>
      `;
  
      messagesList.appendChild(messageItem);
    }
  });
  