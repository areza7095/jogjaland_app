const hamburger = document.getElementById('hamburger'); // Use ID to select
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Toggle the active class to show/hide links
});

document.getElementById('addActivityButton').addEventListener('click', function() {
    const activityName = document.getElementById('activityName').value;
    const activityDescription = document.getElementById('activityDescription').value;

    if (activityName && activityDescription) {
        // Create a new activity element
        const activityDiv = document.createElement('div');
        activityDiv.classList.add('activity');

        // Create image container (placeholder for now)
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const img = document.createElement('img');
        img.src = 'assets/images/default.jpg'; // Placeholder image
        img.alt = activityName;
        imageContainer.appendChild(img);

        // Create overlay with activity description
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.innerText = activityDescription;
        imageContainer.appendChild(overlay);

        // Append image container to activity div
        activityDiv.appendChild(imageContainer);

        // Create activity name element
        const activityTitle = document.createElement('h3');
        activityTitle.innerText = activityName;
        activityDiv.appendChild(activityTitle);

        // // Append the new activity to the activities container
        document.getElementById('activitiesContainer').appendChild(activityDiv);

        // Clear input fields
        document.getElementById('activityName').value = '';
        document.getElementById('activityDescription').value = '';
    } else {
        alert('Please fill in both fields.');
    }
});