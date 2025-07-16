/**
 * ProctorAI Teacher Dashboard Content Management
 * Developed by R Lab Work (Aleena Tahir & Saqlain Abbas)
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard content script loaded');
    
    // Initialize all dashboard sections
    initializeDashboard();
    initializeQuizzes();
    initializeCreateQuiz(); // Initialize quiz creation section
    initializeSubmissions();
    initializeAnalytics();
    initializeSettings();
    
    // Setup tab switching in settings
    setupSettingsTabs();
});

// Initialize Dashboard Section
function initializeDashboard() {
    console.log('Initializing dashboard section');
    
    // Initialize performance chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Average Score (%)',
                    data: [75, 78, 82, 79, 85, 82],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Initialize Quizzes Section
function initializeQuizzes() {
    console.log('Initializing quizzes section');
    
    // Sample quiz data
    const quizzes = [
        {
            id: 'q1',
            title: 'Computer Networks Mid-term',
            course: 'CS-405',
            questions: 30,
            duration: 60,
            date: 'Jul 15, 2025',
            time: '10:00 AM',
            status: 'scheduled'
        },
        {
            id: 'q2',
            title: 'Data Structures Quiz',
            course: 'CS-301',
            questions: 20,
            duration: 45,
            date: 'Jul 10, 2025',
            time: '09:00 AM',
            status: 'active'
        },
        {
            id: 'q3',
            title: 'Software Engineering Quiz',
            course: 'CS-402',
            questions: 20,
            duration: 40,
            date: 'Jul 18, 2025',
            time: '11:30 AM',
            status: 'scheduled'
        },
        {
            id: 'q4',
            title: 'Database Systems Final',
            course: 'CS-303',
            questions: 40,
            duration: 90,
            date: 'Jun 30, 2025',
            time: '10:00 AM',
            status: 'completed'
        },
        {
            id: 'q5',
            title: 'Artificial Intelligence Quiz',
            course: 'CS-501',
            questions: 25,
            duration: 50,
            date: 'Jul 25, 2025',
            time: '02:00 PM',
            status: 'draft'
        },
        {
            id: 'q6',
            title: 'Operating Systems Quiz',
            course: 'CS-304',
            questions: 25,
            duration: 45,
            date: 'Jul 22, 2025',
            time: '09:00 AM',
            status: 'scheduled'
        }
    ];
    
    // Render quizzes
    renderQuizzes(quizzes);
    
    // Setup filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter quizzes
            if (filter === 'all') {
                renderQuizzes(quizzes);
            } else {
                const filteredQuizzes = quizzes.filter(quiz => quiz.status === filter);
                renderQuizzes(filteredQuizzes);
            }
        });
    });
    
    // Setup search functionality
    const quizSearchInput = document.querySelector('#quizzes-section .search-box input');
    if (quizSearchInput) {
        quizSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm === '') {
                renderQuizzes(quizzes);
            } else {
                const filteredQuizzes = quizzes.filter(quiz => 
                    quiz.title.toLowerCase().includes(searchTerm) || 
                    quiz.course.toLowerCase().includes(searchTerm)
                );
                renderQuizzes(filteredQuizzes);
            }
        });
    }
}

// Render quizzes to the container
function renderQuizzes(quizzes) {
    const quizzesContainer = document.querySelector('.quizzes-container');
    if (!quizzesContainer) return;
    
    quizzesContainer.innerHTML = '';
    
    if (quizzes.length === 0) {
        quizzesContainer.innerHTML = '<div class="no-data">No quizzes found</div>';
        return;
    }
    
    quizzes.forEach(quiz => {
        const statusClass = getStatusClass(quiz.status);
        const statusText = quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1);
        
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.innerHTML = `
            <div class="quiz-header">
                <h3>${quiz.title}</h3>
                <span class="quiz-status ${statusClass}">${statusText}</span>
            </div>
            <div class="quiz-details">
                <p><i class="fas fa-book"></i> ${quiz.course}</p>
                <p><i class="fas fa-question-circle"></i> ${quiz.questions} Questions</p>
                <p><i class="fas fa-clock"></i> ${quiz.duration} Minutes</p>
                <p><i class="fas fa-calendar"></i> ${quiz.date} at ${quiz.time}</p>
            </div>
            <div class="quiz-actions">
                <button class="btn btn-primary btn-sm">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-secondary btn-sm">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <div class="quiz-menu">
                    <button class="btn btn-icon">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="quiz-menu-dropdown">
                        <a href="#"><i class="fas fa-copy"></i> Duplicate</a>
                        <a href="#"><i class="fas fa-share"></i> Share</a>
                        <a href="#"><i class="fas fa-trash"></i> Delete</a>
                    </div>
                </div>
            </div>
        `;
        
        quizzesContainer.appendChild(quizCard);
    });
    
    // Setup quiz menu dropdown toggles
    setupQuizMenuToggles();
}

// Setup quiz menu dropdown toggles
function setupQuizMenuToggles() {
    const menuButtons = document.querySelectorAll('.quiz-menu .btn-icon');
    menuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.quiz-menu-dropdown').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            dropdown.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.quiz-menu-dropdown').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

// Get CSS class for quiz status
function getStatusClass(status) {
    switch (status) {
        case 'active': return 'status-active';
        case 'scheduled': return 'status-scheduled';
        case 'draft': return 'status-draft';
        case 'completed': return 'status-completed';
        default: return '';
    }
}

// Initialize Submissions Section
function initializeSubmissions() {
    console.log('Initializing submissions section');
    
    // Sample submissions data
    const submissions = [
        {
            id: 's1',
            student: 'Ali Ahmed',
            studentId: 'CS-2021-042',
            quiz: 'Data Structures Quiz',
            submitted: 'Jul 10, 2025 09:45 AM',
            duration: '42 min',
            score: '85%',
            status: 'graded'
        },
        {
            id: 's2',
            student: 'Sara Khan',
            studentId: 'CS-2021-056',
            quiz: 'Data Structures Quiz',
            submitted: 'Jul 10, 2025 09:30 AM',
            duration: '38 min',
            score: '92%',
            status: 'graded'
        },
        {
            id: 's3',
            student: 'Usman Ali',
            studentId: 'CS-2021-023',
            quiz: 'Computer Networks Mid-term',
            submitted: 'Jul 05, 2025 11:15 AM',
            duration: '55 min',
            score: '78%',
            status: 'graded'
        },
        {
            id: 's4',
            student: 'Fatima Zahra',
            studentId: 'CS-2021-018',
            quiz: 'Database Systems Final',
            submitted: 'Jun 30, 2025 11:45 AM',
            duration: '82 min',
            score: '90%',
            status: 'graded'
        },
        {
            id: 's5',
            student: 'Hassan Raza',
            studentId: 'CS-2021-037',
            quiz: 'Data Structures Quiz',
            submitted: 'Jul 10, 2025 09:50 AM',
            duration: '40 min',
            score: '-',
            status: 'pending'
        }
    ];
    
    // Render submissions
    renderSubmissions(submissions);
    
    // Setup quiz filter
    const quizFilter = document.getElementById('quiz-filter');
    if (quizFilter) {
        quizFilter.addEventListener('change', function() {
            const filter = this.value;
            
            if (filter === 'all') {
                renderSubmissions(submissions);
            } else {
                const filteredSubmissions = submissions.filter(submission => 
                    submission.quiz.toLowerCase().includes(filter)
                );
                renderSubmissions(filteredSubmissions);
            }
        });
    }
    
    // Setup search functionality
    const submissionSearchInput = document.querySelector('#submissions-section .search-box input');
    if (submissionSearchInput) {
        submissionSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm === '') {
                renderSubmissions(submissions);
            } else {
                const filteredSubmissions = submissions.filter(submission => 
                    submission.student.toLowerCase().includes(searchTerm) || 
                    submission.quiz.toLowerCase().includes(searchTerm) ||
                    submission.studentId.toLowerCase().includes(searchTerm)
                );
                renderSubmissions(filteredSubmissions);
            }
        });
    }
}

// Render submissions to the table
function renderSubmissions(submissions) {
    const submissionsTableBody = document.querySelector('.submissions-table tbody');
    if (!submissionsTableBody) return;
    
    submissionsTableBody.innerHTML = '';
    
    if (submissions.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="7" class="no-data">No submissions found</td>';
        submissionsTableBody.appendChild(emptyRow);
        return;
    }
    
    submissions.forEach(submission => {
        const statusClass = submission.status === 'graded' ? 'status-completed' : 'status-pending';
        const statusText = submission.status.charAt(0).toUpperCase() + submission.status.slice(1);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="student-info">
                    <div class="student-avatar">${submission.student.charAt(0)}</div>
                    <div>
                        <h4>${submission.student}</h4>
                        <p>${submission.studentId}</p>
                    </div>
                </div>
            </td>
            <td>${submission.quiz}</td>
            <td>${submission.submitted}</td>
            <td>${submission.duration}</td>
            <td>${submission.score}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-icon" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon" title="Grade">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="btn btn-icon" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;
        
        submissionsTableBody.appendChild(row);
    });
}

// Initialize Analytics Section
function initializeAnalytics() {
    console.log('Initializing analytics section');
    
    const analyticsContainer = document.querySelector('.analytics-container');
    if (!analyticsContainer) return;
    
    // Create analytics cards
    analyticsContainer.innerHTML = `
        <div class="analytics-grid">
            <div class="analytics-card">
                <div class="card-header">
                    <h3>Quiz Performance</h3>
                </div>
                <div class="card-content">
                    <canvas id="quizPerformanceChart"></canvas>
                </div>
            </div>
            
            <div class="analytics-card">
                <div class="card-header">
                    <h3>Student Engagement</h3>
                </div>
                <div class="card-content">
                    <canvas id="engagementChart"></canvas>
                </div>
            </div>
            
            <div class="analytics-card">
                <div class="card-header">
                    <h3>Question Analysis</h3>
                </div>
                <div class="card-content">
                    <canvas id="questionAnalysisChart"></canvas>
                </div>
            </div>
            
            <div class="analytics-card">
                <div class="card-header">
                    <h3>Time Distribution</h3>
                </div>
                <div class="card-content">
                    <canvas id="timeDistributionChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Initialize charts
    initializeAnalyticsCharts();
}

// Initialize analytics charts
function initializeAnalyticsCharts() {
    // Quiz Performance Chart
    const quizPerformanceCtx = document.getElementById('quizPerformanceChart');
    if (quizPerformanceCtx) {
        new Chart(quizPerformanceCtx, {
            type: 'bar',
            data: {
                labels: ['Data Structures', 'Computer Networks', 'Software Engineering', 'Database Systems', 'AI'],
                datasets: [{
                    label: 'Average Score (%)',
                    data: [85, 78, 82, 90, 75],
                    backgroundColor: '#4361ee'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Engagement Chart
    const engagementCtx = document.getElementById('engagementChart');
    if (engagementCtx) {
        new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Participation Rate (%)',
                    data: [95, 92, 88, 90, 94, 96],
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Question Analysis Chart
    const questionAnalysisCtx = document.getElementById('questionAnalysisChart');
    if (questionAnalysisCtx) {
        new Chart(questionAnalysisCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [40, 45, 15],
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Time Distribution Chart
    const timeDistributionCtx = document.getElementById('timeDistributionChart');
    if (timeDistributionCtx) {
        new Chart(timeDistributionCtx, {
            type: 'radar',
            data: {
                labels: ['Reading', 'Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Coding'],
                datasets: [{
                    label: 'Average Time (minutes)',
                    data: [2, 1, 0.5, 3, 5, 8],
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    borderColor: '#2196f3',
                    pointBackgroundColor: '#2196f3'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialize Settings Section
function initializeSettings() {
    console.log('Initializing settings section');
    
    // Setup forms submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Profile updated successfully', 'success');
        });
    }
    
    const quizDefaultsForm = document.getElementById('quiz-defaults-form');
    if (quizDefaultsForm) {
        quizDefaultsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Quiz defaults updated successfully', 'success');
        });
    }
}

// Initialize Create Quiz Section
function initializeCreateQuiz() {
    console.log('Initializing quiz creation section');
    
    // This function is a bridge to the quiz-creation.js module
    // The actual implementation is in quiz-creation.js
    
    // Add initial question if container is empty
    const questionsContainer = document.getElementById('questions-container');
    if (questionsContainer && questionsContainer.children.length === 0) {
        // If quiz-creation.js is loaded, it will handle this
        // Otherwise, we'll add a basic question template
        if (typeof addNewQuestion !== 'function') {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';
            questionCard.innerHTML = `
                <div class="question-header">
                    <div class="question-number">
                        <span class="badge">1</span>
                        Question 1
                    </div>
                    <div class="question-actions">
                        <button type="button" class="btn-icon" title="Move Up">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button type="button" class="btn-icon" title="Move Down">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button type="button" class="btn-icon delete" title="Remove Question">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="question-type-selector">
                    <button type="button" class="question-type-btn active" data-type="mcq">Multiple Choice</button>
                    <button type="button" class="question-type-btn" data-type="text">Text Answer</button>
                </div>
                
                <div class="question-content">
                    <label for="question-text-1">Question Text</label>
                    <textarea id="question-text-1" placeholder="Enter your question here" required></textarea>
                    
                    <div class="question-type-content mcq-type active">
                        <label>Options</label>
                        <div class="options-container">
                            <div class="option-item">
                                <input type="radio" name="correct-1" checked>
                                <input type="text" placeholder="Option 1" required>
                                <button type="button" class="remove-option" title="Remove Option">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="option-item">
                                <input type="radio" name="correct-1">
                                <input type="text" placeholder="Option 2" required>
                                <button type="button" class="remove-option" title="Remove Option">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="add-option-btn">
                            <i class="fas fa-plus"></i> Add Option
                        </button>
                    </div>
                    
                    <div class="question-type-content text-type">
                        <label>Student Answer</label>
                        <div class="text-answer-container">
                            <span class="answer-placeholder">Students will enter their text response here</span>
                            <textarea disabled placeholder="Student answer will appear here" readonly></textarea>
                        </div>
                    </div>
                </div>
            `;
            
            questionsContainer.appendChild(questionCard);
            
            // Setup question type switching
            const typeButtons = questionCard.querySelectorAll('.question-type-btn');
            typeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    
                    // Update button active state
                    typeButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show/hide appropriate content
                    const mcqContent = questionCard.querySelector('.mcq-type');
                    const textContent = questionCard.querySelector('.text-type');
                    
                    if (type === 'mcq') {
                        mcqContent.classList.add('active');
                        textContent.classList.remove('active');
                    } else {
                        mcqContent.classList.remove('active');
                        textContent.classList.add('active');
                    }
                });
            });
            
            // Setup add option button
            const addOptionBtn = questionCard.querySelector('.add-option-btn');
            if (addOptionBtn) {
                addOptionBtn.addEventListener('click', function() {
                    const optionsContainer = this.previousElementSibling;
                    const optionItems = optionsContainer.querySelectorAll('.option-item');
                    const optionCount = optionItems.length + 1;
                    
                    // Create new option
                    const optionItem = document.createElement('div');
                    optionItem.className = 'option-item';
                    optionItem.innerHTML = `
                        <input type="radio" name="correct-1">
                        <input type="text" placeholder="Option ${optionCount}" required>
                        <button type="button" class="remove-option" title="Remove Option">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    // Add to container
                    optionsContainer.appendChild(optionItem);
                });
            }
        }
    }
    
    // Setup add question button
    const addQuestionBtn = document.getElementById('add-question');
    if (addQuestionBtn && typeof addNewQuestion !== 'function') {
        addQuestionBtn.addEventListener('click', function() {
            showNotification('Quiz creation module is loading...', 'info');
        });
    }
}

// Setup settings tabs
function setupSettingsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to notifications container
    const notificationsContainer = document.querySelector('.notifications-container');
    if (!notificationsContainer) {
        // Create container if it doesn't exist
        const container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
        container.appendChild(notification);
    } else {
        notificationsContainer.appendChild(notification);
    }
    
    // Setup close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}
