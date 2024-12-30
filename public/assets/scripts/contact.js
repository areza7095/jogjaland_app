// Fungsi untuk toggle menu (hamburger menu)
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Tambahkan event listener untuk hamburger menu setelah DOM siap
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.hamburger').addEventListener('click', toggleMenu);
});

function openWhatsApp() {
    window.open('https://wa.me/1234567890', '_blank');
}

function openEmail() {
    window.location.href = 'mailto:your-email@example.com';
}

function showMap() {
    const map = document.getElementById('map');
    map.style.display = 'block'; // Tampilkan peta
    map.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll ke peta dengan halus dan posisikan di tengah
}
document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Ambil nilai input
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validasi sederhana
    if (!firstName || !lastName || !message) {
        alert('Please fill out all fields.');
        return;
    }

    // Tampilkan pesan konfirmasi
    const confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.classList.remove('hidden');
    confirmationMessage.innerHTML = `Pesan berhasil terkirim! <span>&#128077;</span>`;

    // Create a new message item with an avatar
    const messageItem = document.createElement('div');
    messageItem.classList.add('message-item');

    // Use a placeholder avatar image
    const avatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s'; // Placeholder avatar URL
    messageItem.innerHTML = `
        <div class="message-avatar">
            <img src="${avatarUrl}" alt="${firstName} ${lastName}'s Avatar">
        </div>
        <div class="message-content">
            <strong>${firstName} ${lastName}</strong>
            <p>${message}</p>
        </div>
    `;

    // Append the new message to the messages list
    const messagesList = document.getElementById('messagesList');
    messagesList.appendChild(messageItem);

    // Reset form
    document.getElementById('messageForm').reset();
});