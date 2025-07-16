/**
 * Simple test script to verify click events
 * Developed by R Lab Work (Aleena Tahir & Saqlain Abbas)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Test script loaded');
    
    // Test sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        console.log('Sidebar toggle found');
        sidebarToggle.addEventListener('click', function() {
            console.log('Sidebar toggle clicked');
            alert('Sidebar toggle clicked');
        });
    } else {
        console.error('Sidebar toggle not found');
    }
    
    // Test navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    console.log(`Found ${navLinks.length} navigation links`);
    
    navLinks.forEach((link, index) => {
        console.log(`Setting up click for nav link ${index}: ${link.getAttribute('data-section')}`);
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Nav link clicked: ${this.getAttribute('data-section')}`);
            alert(`Nav link clicked: ${this.getAttribute('data-section')}`);
        });
    });
});
