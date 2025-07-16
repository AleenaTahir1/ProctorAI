/**
 * Basic Navigation Script for ProctorAI Teacher Dashboard
 * Developed by R Lab Work (Aleena Tahir & Saqlain Abbas)
 */

// Wait until the page is fully loaded
window.onload = function() {
    console.log('Page loaded - basic navigation script');
    
    // Setup sidebar toggle
    var sidebar = document.querySelector('.sidebar');
    var mainContent = document.querySelector('.main-content');
    var sidebarToggle = document.getElementById('sidebar-toggle');
    
    if (sidebarToggle) {
        console.log('Sidebar toggle button found');
        sidebarToggle.onclick = function() {
            console.log('Sidebar toggle clicked');
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            } else {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            }
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        };
    } else {
        console.error('Sidebar toggle button not found');
    }
    
    // Check localStorage for sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Setup navigation links
    var navLinks = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('main > section');
    
    for (var i = 0; i < navLinks.length; i++) {
        console.log('Setting up nav link:', navLinks[i].getAttribute('data-section'));
        navLinks[i].onclick = function(e) {
            e.preventDefault();
            var targetSectionId = this.getAttribute('data-section');
            console.log('Nav link clicked:', targetSectionId);
            
            // Remove active class from all links
            for (var j = 0; j < navLinks.length; j++) {
                navLinks[j].parentElement.classList.remove('active');
            }
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Hide all sections
            for (var k = 0; k < sections.length; k++) {
                sections[k].classList.remove('active');
            }
            
            // Show target section
            var targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error('Target section not found:', targetSectionId);
            }
        };
    }
    
    // Setup user dropdown
    var userDropdown = document.querySelector('.user-dropdown');
    var dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userDropdown && dropdownMenu) {
        userDropdown.onclick = function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        };
        
        document.onclick = function() {
            dropdownMenu.classList.remove('show');
        };
    }
};
