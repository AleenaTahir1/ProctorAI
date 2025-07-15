// Student Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-links a');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    
    // Show dashboard section by default
    document.getElementById('dashboard-section').classList.add('active');
    
    // Navigation click event
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '../../index.html') {
                // Let the logout link work normally
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all nav items
            navLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            this.parentElement.classList.add('active');
            
            // Hide all sections
            dashboardSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the corresponding section
            const targetId = this.getAttribute('href').substring(1) + '-section';
            document.getElementById(targetId)?.classList.add('active');
        });
    });
    
    // Start Quiz button functionality
    const startQuizButtons = document.querySelectorAll('.quiz-actions .btn.primary');
    startQuizButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizName = this.closest('.quiz-card').querySelector('h3').textContent;
            alert(`Starting quiz: ${quizName}\nThe proctoring system will now initialize.`);
            // In a real implementation, this would redirect to the quiz taking page
        });
    });
    
    // Table Start Quiz buttons
    const tableStartButtons = document.querySelectorAll('.quiz-table .btn.primary');
    tableStartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizName = this.closest('tr').querySelector('td:first-child').textContent;
            alert(`Starting quiz: ${quizName}\nThe proctoring system will now initialize.`);
            // In a real implementation, this would redirect to the quiz taking page
        });
    });
    
    // Quiz code submission
    const quizCodeForm = document.querySelector('.code-input-container');
    if (quizCodeForm) {
        const startButton = quizCodeForm.querySelector('.btn.primary');
        startButton.addEventListener('click', function() {
            const quizCode = quizCodeForm.querySelector('.quiz-code-input').value;
            if (!quizCode) {
                alert('Please enter a quiz code');
                return;
            }
            
            alert(`Joining quiz with code: ${quizCode}\nThe proctoring system will now initialize.`);
            // In a real implementation, this would validate the code and redirect to the quiz
        });
    }
    
    // View Results buttons
    const viewResultButtons = document.querySelectorAll('.results-table .btn.secondary');
    viewResultButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizName = this.closest('tr').querySelector('td:first-child').textContent;
            const score = this.closest('tr').querySelector('td:nth-child(4)').textContent;
            alert(`Viewing results for: ${quizName}\nScore: ${score}`);
            // In a real implementation, this would open a detailed results view
        });
    });
    
    // Settings form submission
    const settingsForm = document.querySelector('.settings-card .form-actions .btn.primary');
    if (settingsForm) {
        settingsForm.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Settings saved successfully!');
        });
    }
    
    // Notification handling
    const notificationBell = document.querySelector('.notification');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            alert('Notifications: \n- Quiz "Operating Systems Quiz 2" starts in 30 minutes\n- Your "Data Structures Quiz" has been graded\n- New quiz "Database Management Systems" has been assigned');
            // In a real implementation, this would show a dropdown with notifications
            
            // Clear notification badge
            const badge = this.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-container input, .search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                alert(`Searching for: ${this.value}`);
                // In a real implementation, this would filter the content based on the search term
            }
        });
    });
});
