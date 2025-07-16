/**
 * ProctorAI Teacher Dashboard Navigation Fix
 * Developed by R Lab Work (Aleena Tahir & Saqlain Abbas)
 */

// Use the most basic and compatible approach possible
window.onload = function() {
    console.log('Final fix script loaded');
    
    // Direct DOM manipulation with explicit event handlers
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var sidebar = document.querySelector('.sidebar');
    var mainContent = document.querySelector('.main-content');
    
    // Setup sidebar toggle with direct event handler
    if (sidebarToggle) {
        sidebarToggle.onclick = function(event) {
            if (event) {
                event.preventDefault();
            }
            console.log('Sidebar toggle clicked');
            
            // Toggle sidebar collapsed state
            if (sidebar.className.indexOf('collapsed') > -1) {
                sidebar.className = sidebar.className.replace(' collapsed', '');
                mainContent.className = mainContent.className.replace(' expanded', '');
            } else {
                sidebar.className += ' collapsed';
                mainContent.className += ' expanded';
            }
            
            // Store in localStorage
            try {
                localStorage.setItem('sidebarCollapsed', sidebar.className.indexOf('collapsed') > -1);
            } catch (e) {
                console.error('LocalStorage error:', e);
            }
        };
    }
    
    // Check localStorage for sidebar state
    try {
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            if (sidebar.className.indexOf('collapsed') === -1) {
                sidebar.className += ' collapsed';
            }
            if (mainContent.className.indexOf('expanded') === -1) {
                mainContent.className += ' expanded';
            }
        }
    } catch (e) {
        console.error('LocalStorage error:', e);
    }
    
    // Setup navigation with direct event handlers
    var navLinks = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('main > section');
    
    for (var i = 0; i < navLinks.length; i++) {
        (function(index) {
            var link = navLinks[index];
            link.onclick = function(event) {
                if (event) {
                    event.preventDefault();
                }
                
                var targetSectionId = this.getAttribute('data-section');
                console.log('Navigation clicked:', targetSectionId);
                
                // Remove active class from all nav items
                for (var j = 0; j < navLinks.length; j++) {
                    var navItem = navLinks[j].parentElement;
                    navItem.className = navItem.className.replace(' active', '');
                }
                
                // Add active class to clicked nav item
                var thisNavItem = this.parentElement;
                if (thisNavItem.className.indexOf('active') === -1) {
                    thisNavItem.className += ' active';
                }
                
                // Hide all sections
                for (var k = 0; k < sections.length; k++) {
                    sections[k].className = sections[k].className.replace(' active', '');
                }
                
                // Show target section
                var targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    if (targetSection.className.indexOf('active') === -1) {
                        targetSection.className += ' active';
                    }
                }
            };
        })(i);
    }
    
    // Setup user dropdown
    var userDropdown = document.querySelector('.user-dropdown');
    var dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userDropdown && dropdownMenu) {
        userDropdown.onclick = function(event) {
            if (event) {
                event.stopPropagation();
            }
            
            if (dropdownMenu.className.indexOf('show') > -1) {
                dropdownMenu.className = dropdownMenu.className.replace(' show', '');
            } else {
                dropdownMenu.className += ' show';
            }
        };
        
        document.onclick = function() {
            if (dropdownMenu.className.indexOf('show') > -1) {
                dropdownMenu.className = dropdownMenu.className.replace(' show', '');
            }
        };
    }
};
