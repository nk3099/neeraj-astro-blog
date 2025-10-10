document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger?.addEventListener('click', () => {
        navLinks?.classList.toggle('expanded');
    });

    // Close the mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navLinks?.classList.remove('expanded');
            }
        });
    });

    // Handle window resize to show navigation on larger screens
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            navLinks?.classList.remove('expanded');
        }
    });
});