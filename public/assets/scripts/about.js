// Fungsi untuk toggle menu (hamburger menu)
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Tambahkan event listener untuk hamburger menu
document.querySelector('.hamburger').addEventListener('click', toggleMenu);