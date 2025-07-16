// Student Dashboard JavaScript
// Developed by R Lab Work (Aleena Tahir & Saqlain Abbas)

document.addEventListener('DOMContentLoaded', function() {
    // Create notifications container if it doesn't exist
    if (!document.querySelector('.notifications-container')) {
        const notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
    // Initialize mock data
    const studentData = {
        profile: {
            name: "Ali Ahmed",
            id: "CS-2023-042",
            email: "student.ali@nutech.edu.pk",
            department: "Computer Science",
            profilePic: ""
        },
        quizzes: [
            { id: 1, title: "Data Structures Quiz", course: "CS-301", duration: "45 min", questions: 25, dueDate: "Jul 14, 2025", status: "completed", score: "85%" },
            { id: 2, title: "Computer Networks Mid-term", course: "CS-405", duration: "60 min", questions: 30, dueDate: "Jul 15, 2025", status: "upcoming" },
            { id: 3, title: "Software Engineering Quiz", course: "CS-402", duration: "40 min", questions: 20, dueDate: "Jul 18, 2025", status: "upcoming" },
            { id: 4, title: "Database Systems Final", course: "CS-303", duration: "90 min", questions: 40, dueDate: "Jul 10, 2025", status: "completed", score: "92%" },
            { id: 5, title: "Operating Systems Quiz", course: "CS-304", duration: "30 min", questions: 15, dueDate: "Today", status: "due-today" },
            { id: 6, title: "Artificial Intelligence Quiz", course: "CS-501", duration: "45 min", questions: 25, dueDate: "Today", status: "due-today" }
        ],
        results: [
            { id: 1, title: "Data Structures Quiz", course: "CS-301", date: "Jul 10, 2025", score: "85%", status: "passed" },
            { id: 2, title: "Database Systems Final", course: "CS-303", date: "Jul 8, 2025", score: "92%", status: "passed" },
            { id: 3, title: "Web Development Quiz", course: "CS-401", date: "Jul 5, 2025", score: "78%", status: "passed" },
            { id: 4, title: "Computer Architecture Test", course: "CS-302", date: "Jun 28, 2025", score: "65%", status: "passed" },
            { id: 5, title: "Discrete Mathematics Quiz", course: "CS-201", date: "Jun 20, 2025", score: "72%", status: "passed" }
        ],
        notifications: [
            { id: 1, message: "Quiz 'Operating Systems Quiz' starts in 30 minutes", type: "reminder", time: "Today, 1:30 PM" },
            { id: 2, message: "Your 'Data Structures Quiz' has been graded", type: "result", time: "Yesterday, 5:15 PM" },
            { id: 3, message: "New quiz 'Artificial Intelligence Quiz' has been assigned", type: "new", time: "Today, 9:00 AM" }
        ],
        activeQuiz: null
    };
    
    // Sample quiz data
    const quizData = {
        id: 5,
        title: "Operating Systems Quiz",
        course: "CS-304",
        duration: 30, // minutes
        instructions: "This quiz contains multiple choice and text-based questions. Answer all questions to the best of your ability. The quiz will auto-submit when the timer ends.",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                text: "Which of the following is NOT a function of an operating system?",
                options: [
                    "Memory management",
                    "Process scheduling",
                    "Web browsing",
                    "File management"
                ],
                correctAnswer: 2
            },
            {
                id: 2,
                type: "multiple-choice",
                text: "What is a deadlock in an operating system?",
                options: [
                    "When a process is terminated abnormally",
                    "When two or more processes are unable to proceed because each is waiting for resources held by others",
                    "When the CPU utilization is 100%",
                    "When a process is in an infinite loop"
                ],
                correctAnswer: 1
            },
            {
                id: 3,
                type: "text-answer",
                text: "Explain the difference between preemptive and non-preemptive scheduling algorithms.",
                expectedLength: "3-5 sentences"
            },
            {
                id: 4,
                type: "multiple-choice",
                text: "Which scheduling algorithm is most appropriate for time-sharing systems?",
                options: [
                    "First-Come, First-Served (FCFS)",
                    "Shortest Job First (SJF)",
                    "Round Robin (RR)",
                    "Priority Scheduling"
                ],
                correctAnswer: 2
            },
            {
                id: 5,
                type: "text-answer",
                text: "Describe how virtual memory works in modern operating systems.",
                expectedLength: "3-5 sentences"
            }
        ]
    };
    
    // Fetch random user profile picture from randomuser.me API
    fetchRandomUserProfile();
    
    // Function to fetch random user profile
    function fetchRandomUserProfile() {
        fetch('https://randomuser.me/api/')
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const user = data.results[0];
                    const profilePic = user.picture.medium;
                    
                    // Update student data
                    studentData.profile.profilePic = profilePic;
                    
                    // Update profile picture in UI
                    const userImages = document.querySelectorAll('.user img');
                    userImages.forEach(img => {
                        img.src = profilePic;
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching random user:', error);
            });
    }
    
    // Create missing sections if they don't exist
    createMissingDashboardSections();
    
    // Initialize notifications
    initializeNotifications();
    
    // Function to create missing dashboard sections
    function createMissingDashboardSections() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        // Check if take-quiz section exists, if not create it
        if (!document.getElementById('take-quiz-section')) {
            const takeQuizSection = document.createElement('div');
            takeQuizSection.id = 'take-quiz-section';
            takeQuizSection.className = 'dashboard-section';
            mainContent.appendChild(takeQuizSection);
        }
    }
    
    // Function to initialize notifications
    function initializeNotifications() {
        // Create notifications container if it doesn't exist
        if (!document.querySelector('.notifications-container')) {
            const notificationsContainer = document.createElement('div');
            notificationsContainer.className = 'notifications-container';
            document.body.appendChild(notificationsContainer);
        }
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        const notificationsContainer = document.querySelector('.notifications-container');
        if (!notificationsContainer) return;
        
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <p>${message}</p>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        notificationsContainer.appendChild(notification);
        
        // Add event listener to close button
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // Function to show notifications dropdown
    function showNotifications() {
        const notificationsList = document.createElement('div');
        notificationsList.className = 'notifications-dropdown';
        
        if (studentData.notifications.length === 0) {
            notificationsList.innerHTML = '<p class="no-notifications">No notifications</p>';
        } else {
            const notificationsContent = studentData.notifications.map(notification => `
                <div class="notification-item ${notification.type}">
                    <p>${notification.message}</p>
                    <span class="time">${notification.time}</span>
                </div>
            `).join('');
            
            notificationsList.innerHTML = `
                <h3>Notifications</h3>
                <div class="notifications-list">
                    ${notificationsContent}
                </div>
                <div class="notifications-actions">
                    <button class="btn secondary">Mark all as read</button>
                </div>
            `;
        }
        
        // Check if dropdown already exists, if so remove it
        const existingDropdown = document.querySelector('.notifications-dropdown');
        if (existingDropdown) existingDropdown.remove();
        
        // Append to notification bell
        const notificationBell = document.querySelector('.notification');
        if (notificationBell) {
            notificationBell.appendChild(notificationsList);
            
            // Add event listener to close when clicking outside
            document.addEventListener('click', function closeNotifications(e) {
                if (!notificationsList.contains(e.target) && !notificationBell.contains(e.target)) {
                    notificationsList.remove();
                    document.removeEventListener('click', closeNotifications);
                }
            });
            
            // Add event listener to mark all as read button
            const markAllAsReadBtn = notificationsList.querySelector('.notifications-actions .btn');
            if (markAllAsReadBtn) {
                markAllAsReadBtn.addEventListener('click', function() {
                    studentData.notifications = [];
                    notificationsList.remove();
                    showNotification('All notifications marked as read', 'success');
                });
            }
        }
    }
    
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
    
    // Populate upcoming quizzes
    populateUpcomingQuizzes();
    
    // Populate results
    populateResults();
    
    // Function to populate upcoming quizzes
    function populateUpcomingQuizzes() {
        const upcomingQuizzesSection = document.getElementById('upcoming-quizzes-section');
        if (!upcomingQuizzesSection) return;
        
        // Find the quiz list container or create one if it doesn't exist
        let quizList = upcomingQuizzesSection.querySelector('.quiz-list');
        if (!quizList) {
            quizList = document.createElement('div');
            quizList.className = 'quiz-list';
            upcomingQuizzesSection.appendChild(quizList);
        } else {
            quizList.innerHTML = ''; // Clear existing content
        }
        
        // Filter only upcoming and due today quizzes
        const upcomingQuizzes = studentData.quizzes.filter(quiz => 
            quiz.status === 'upcoming' || quiz.status === 'due-today');
        
        if (upcomingQuizzes.length === 0) {
            quizList.innerHTML = '<p class="no-quizzes">No upcoming quizzes</p>';
            return;
        }
        
        // Create quiz cards
        upcomingQuizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.className = `quiz-card ${quiz.status}`;
            quizCard.dataset.quizId = quiz.id;
            
            let statusText = 'Upcoming';
            let statusClass = 'upcoming';
            
            if (quiz.status === 'due-today') {
                statusText = 'Due Today';
                statusClass = 'due-today';
            }
            
            quizCard.innerHTML = `
                <div class="quiz-info">
                    <h3>${quiz.title}</h3>
                    <p class="course">${quiz.course}</p>
                    <div class="quiz-details">
                        <span><i class="fas fa-clock"></i> ${quiz.duration}</span>
                        <span><i class="fas fa-question-circle"></i> ${quiz.questions} Questions</span>
                        <span><i class="fas fa-calendar"></i> Due: ${quiz.dueDate}</span>
                    </div>
                    <div class="quiz-status ${statusClass}">${statusText}</div>
                </div>
                <div class="quiz-actions">
                    <button class="btn primary">Start Quiz</button>
                </div>
            `;
            
            quizList.appendChild(quizCard);
        });
        
        // Add event listeners to the newly created buttons
        const startButtons = quizList.querySelectorAll('.quiz-actions .btn.primary');
        startButtons.forEach(button => {
            button.addEventListener('click', function() {
                const quizCard = this.closest('.quiz-card');
                const quizId = parseInt(quizCard.dataset.quizId);
                startQuiz(quizId);
            });
        });
    }
    
    // Function to populate results
    function populateResults() {
        const resultsSection = document.getElementById('results-section');
        if (!resultsSection) return;
        
        // Find the results table or create one if it doesn't exist
        let resultsTable = resultsSection.querySelector('.results-table');
        if (!resultsTable) {
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-container';
            
            resultsContainer.innerHTML = `
                <div class="table-header">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search results...">
                    </div>
                </div>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Quiz Name</th>
                            <th>Course</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `;
            
            resultsSection.appendChild(resultsContainer);
            resultsTable = resultsContainer.querySelector('.results-table');
        }
        
        const tableBody = resultsTable.querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing content
        
        // Add results to table
        studentData.results.forEach(result => {
            const row = document.createElement('tr');
            row.dataset.quizId = result.id;
            
            let statusClass = 'passed';
            if (result.status === 'failed') statusClass = 'failed';
            
            row.innerHTML = `
                <td>${result.title}</td>
                <td>${result.course}</td>
                <td>${result.date}</td>
                <td>${result.score}</td>
                <td><span class="status ${statusClass}">${result.status}</span></td>
                <td>
                    <button class="btn secondary">View Details</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to the view details buttons
        const viewButtons = tableBody.querySelectorAll('.btn.secondary');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const quizId = parseInt(row.dataset.quizId);
                const quizName = row.querySelector('td:first-child').textContent;
                const score = row.querySelector('td:nth-child(4)').textContent;
                showNotification(`Viewing results for: ${quizName} - Score: ${score}`, 'info');
            });
        });
    }
    
    // Function to filter quizzes
    function filterQuizzes(searchTerm) {
        const quizCards = document.querySelectorAll('.quiz-card');
        let found = false;
        
        quizCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const course = card.querySelector('.course').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || course.includes(searchTerm)) {
                card.style.display = 'flex';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!found) {
            showNotification(`No quizzes found matching: ${searchTerm}`, 'info');
        }
    }
    
    // Function to filter results
    function filterResults(searchTerm) {
        const resultRows = document.querySelectorAll('.results-table tbody tr');
        let found = false;
        
        resultRows.forEach(row => {
            const title = row.querySelector('td:first-child').textContent.toLowerCase();
            const course = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || course.includes(searchTerm)) {
                row.style.display = '';
                found = true;
            } else {
                row.style.display = 'none';
            }
        });
        
        if (!found) {
            showNotification(`No results found matching: ${searchTerm}`, 'info');
        }
    }
    
    // Start Quiz button functionality
    const startQuizButtons = document.querySelectorAll('.quiz-actions .btn.primary');
    startQuizButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizCard = this.closest('.quiz-card');
            const quizName = quizCard.querySelector('h3').textContent;
            const quizId = parseInt(quizCard.dataset.quizId);
            
            // Find the quiz in our data
            const quiz = studentData.quizzes.find(q => q.id === quizId);
            if (quiz) {
                startQuiz(quizId);
            } else {
                showNotification(`Quiz not found: ${quizName}`, 'error');
            }
        });
    });
    
    // Table Start Quiz buttons
    const tableStartButtons = document.querySelectorAll('.quiz-table .btn.primary');
    tableStartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const quizName = row.querySelector('td:first-child').textContent;
            const quizId = parseInt(row.dataset.quizId);
            
            // Find the quiz in our data
            const quiz = studentData.quizzes.find(q => q.id === quizId);
            if (quiz) {
                startQuiz(quizId);
            } else {
                showNotification(`Quiz not found: ${quizName}`, 'error');
            }
        });
    });
    
    // Quiz code submission
    const quizCodeForm = document.querySelector('.code-input-container');
    if (quizCodeForm) {
        const startButton = quizCodeForm.querySelector('.btn.primary');
        startButton.addEventListener('click', function() {
            const quizCode = quizCodeForm.querySelector('.quiz-code-input').value;
            if (!quizCode) {
                showNotification('Please enter a quiz code', 'error');
                return;
            }
            
            // For demo purposes, we'll assume code 'OS304' corresponds to our sample quiz
            if (quizCode === 'OS304') {
                startQuiz(quizData.id);
            } else {
                showNotification(`Invalid quiz code: ${quizCode}`, 'error');
            }
        });
    }
    
    // Function to start a quiz
    function startQuiz(quizId) {
        // For demo purposes, we'll use our sample quiz data
        studentData.activeQuiz = quizData;
        
        // Show the take quiz section
        navLinks.forEach(item => {
            item.parentElement.classList.remove('active');
        });
        document.querySelector('a[href="#take-quiz"]').parentElement.classList.add('active');
        
        dashboardSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const takeQuizSection = document.getElementById('take-quiz-section');
        if (takeQuizSection) {
            takeQuizSection.classList.add('active');
            renderQuiz(quizData);
        }
    }
    
    // View Results buttons
    const viewResultButtons = document.querySelectorAll('.results-table .btn.secondary');
    viewResultButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizName = this.closest('tr').querySelector('td:first-child').textContent;
            const score = this.closest('tr').querySelector('td:nth-child(4)').textContent;
            showNotification(`Viewing results for: ${quizName} - Score: ${score}`, 'info');
            // In a real implementation, this would open a detailed results view
        });
    });
    
    // Settings form submission
    const settingsForm = document.querySelector('.settings-card .form-actions .btn.primary');
    if (settingsForm) {
        settingsForm.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully!', 'success');
        });
    }
    
    // Notification handling
    const notificationBell = document.querySelector('.notification');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotifications();
            
            // Clear notification badge
            const badge = this.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const searchContainer = this.closest('.dashboard-section');
            
            if (searchContainer.id === 'upcoming-quizzes-section') {
                filterQuizzes(searchTerm);
            } else if (searchContainer.id === 'results-section') {
                filterResults(searchTerm);
            } else {
                showNotification(`Searching for: ${searchTerm}`, 'info');
            }
        });
    });
    
    // Top bar search functionality
    const topBarSearch = document.querySelector('.search-container input');
    if (topBarSearch) {
        topBarSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                if (searchTerm) {
                    // Global search across all sections
                    const activeSection = document.querySelector('.dashboard-section.active');
                    
                    if (activeSection.id === 'upcoming-quizzes-section') {
                        filterQuizzes(searchTerm);
                    } else if (activeSection.id === 'results-section') {
                        filterResults(searchTerm);
                    } else {
                        // Search in all sections
                        showSection('upcoming-quizzes-section');
                        setTimeout(() => filterQuizzes(searchTerm), 100);
                        showNotification(`Searching for: ${searchTerm}`, 'info');
                    }
                }
            }
        });
    }
    
    // Function to render quiz
    function renderQuiz(quiz) {
        const takeQuizSection = document.getElementById('take-quiz-section');
        if (!takeQuizSection) return;
        
        // Clear previous content
        takeQuizSection.innerHTML = '';
        
        // Create quiz header
        const quizHeader = document.createElement('div');
        quizHeader.className = 'quiz-header';
        quizHeader.innerHTML = `
            <h1>${quiz.title}</h1>
            <p class="subtitle">${quiz.course} - ${quiz.duration} minutes</p>
            <div class="quiz-timer">
                <i class="fas fa-clock"></i>
                <span id="timer">00:00</span>
            </div>
            <div class="quiz-instructions">
                <h3>Instructions</h3>
                <p>${quiz.instructions}</p>
            </div>
        `;
        takeQuizSection.appendChild(quizHeader);
        
        // Create quiz form
        const quizForm = document.createElement('form');
        quizForm.id = 'quiz-form';
        quizForm.className = 'quiz-form';
        
        // Add questions
        quiz.questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'quiz-question';
            questionElement.dataset.questionId = question.id;
            
            const questionHeader = document.createElement('div');
            questionHeader.className = 'question-header';
            questionHeader.innerHTML = `<h3>Question ${index + 1}</h3>`;
            questionElement.appendChild(questionHeader);
            
            const questionText = document.createElement('p');
            questionText.className = 'question-text';
            questionText.textContent = question.text;
            questionElement.appendChild(questionText);
            
            const answerContainer = document.createElement('div');
            answerContainer.className = 'answer-container';
            
            if (question.type === 'multiple-choice') {
                question.options.forEach((option, optIndex) => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'option';
                    optionElement.innerHTML = `
                        <input type="radio" id="q${question.id}_opt${optIndex}" name="q${question.id}" value="${optIndex}">
                        <label for="q${question.id}_opt${optIndex}">${option}</label>
                    `;
                    answerContainer.appendChild(optionElement);
                });
            } else if (question.type === 'text-answer') {
                const textArea = document.createElement('textarea');
                textArea.name = `q${question.id}`;
                textArea.placeholder = `Type your answer here (${question.expectedLength})`;
                textArea.rows = 5;
                answerContainer.appendChild(textArea);
            }
            
            questionElement.appendChild(answerContainer);
            quizForm.appendChild(questionElement);
        });
        
        // Add submit button
        const submitContainer = document.createElement('div');
        submitContainer.className = 'form-actions';
        submitContainer.innerHTML = `
            <button type="button" class="btn secondary" id="save-quiz">Save Progress</button>
            <button type="submit" class="btn primary" id="submit-quiz">Submit Quiz</button>
        `;
        quizForm.appendChild(submitContainer);
        
        takeQuizSection.appendChild(quizForm);
        
        // Start timer
        startQuizTimer(quiz.duration * 60); // Convert minutes to seconds
        
        // Add event listeners
        document.getElementById('submit-quiz').addEventListener('click', function(e) {
            e.preventDefault();
            submitQuiz();
        });
        
        document.getElementById('save-quiz').addEventListener('click', function() {
            showNotification('Quiz progress saved!', 'success');
        });
    }
    
    // Quiz timer functionality
    let timerInterval;
    function startQuizTimer(durationInSeconds) {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        let timeLeft = durationInSeconds;
        updateTimerDisplay(timeLeft);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            
            if (timeLeft <= 300) { // 5 minutes warning
                timerElement.classList.add('warning');
            }
            
            if (timeLeft <= 60) { // 1 minute warning
                timerElement.classList.add('danger');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitQuiz(true);
            }
        }, 1000);
    }
    
    function updateTimerDisplay(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = formattedTime;
    }
    
    // Submit quiz function
    function submitQuiz(isAutoSubmit = false) {
        clearInterval(timerInterval);
        
        if (isAutoSubmit) {
            showNotification('Time is up! Your quiz has been automatically submitted.', 'warning');
        } else {
            showNotification('Quiz submitted successfully!', 'success');
        }
        
        // In a real implementation, we would collect all answers and send to server
        const quizForm = document.getElementById('quiz-form');
        quizForm.innerHTML = `
            <div class="quiz-submitted">
                <i class="fas fa-check-circle"></i>
                <h2>Quiz Submitted</h2>
                <p>Your quiz has been submitted successfully. You will be notified when the results are available.</p>
                <button class="btn primary" id="return-to-dashboard">Return to Dashboard</button>
            </div>
        `;
        
        document.getElementById('return-to-dashboard').addEventListener('click', function() {
            // Reset active quiz
            studentData.activeQuiz = null;
            
            // Return to dashboard
            navLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            document.querySelector('a[href="#dashboard"]').parentElement.classList.add('active');
            
            dashboardSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('dashboard-section').classList.add('active');
        });
    }
});
