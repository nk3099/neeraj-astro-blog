// Function to set up navigation menu
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Remove existing event listeners to prevent duplicates
    const oldHamburger = hamburger?.cloneNode(true);
    if (hamburger && oldHamburger) {
        hamburger.parentNode?.replaceChild(oldHamburger, hamburger);
    }

    // Add click event to hamburger menu
    document.querySelector('.hamburger')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('expanded');
    });

    // Close the mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navLinks?.classList.remove('expanded');
            }
        });
    });
}

// Initial setup on DOM load
document.addEventListener('DOMContentLoaded', setupNavigation);

// Setup on Astro page transitions
document.addEventListener('astro:page-load', setupNavigation);

// Handle window resize to show navigation on larger screens
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        document.querySelector('.nav-links')?.classList.remove('expanded');
    }
});