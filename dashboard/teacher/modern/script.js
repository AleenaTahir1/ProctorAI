// Modern Teacher Dashboard JavaScript
// Developed by R Lab Work (Aleena Tahir & Saqlain Abbas)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard data
    const dashboardData = {
        quizzes: [
            { id: 1, title: 'Data Structures Quiz', course: 'CS-301', questions: 25, duration: '45 min', status: 'active', date: 'Jul 14, 2025', submissions: 15 },
            { id: 2, title: 'Computer Networks Mid-term', course: 'CS-405', questions: 30, duration: '60 min', status: 'scheduled', date: 'Jul 15, 2025', submissions: 0 },
            { id: 3, title: 'Software Engineering Quiz', course: 'CS-402', questions: 20, duration: '40 min', status: 'draft', date: 'Jul 18, 2025', submissions: 0 },
            { id: 4, title: 'Database Systems Final', course: 'CS-303', questions: 40, duration: '90 min', status: 'completed', date: 'Jul 10, 2025', submissions: 32 },
            { id: 5, title: 'Artificial Intelligence Quiz', course: 'CS-501', questions: 15, duration: '30 min', status: 'active', date: 'Jul 13, 2025', submissions: 8 },
        ],
        submissions: [
            { id: 1, student: 'Ali Ahmed', studentId: 'CS-2023-042', quiz: 'Data Structures Quiz', score: '85%', time: 'Jul 14, 2025 - 11:45 AM', duration: '42 min', status: 'graded' },
            { id: 2, student: 'Sara Khan', studentId: 'CS-2023-056', quiz: 'Data Structures Quiz', score: '92%', time: 'Jul 14, 2025 - 10:30 AM', duration: '38 min', status: 'graded' },
            { id: 3, student: 'Hamza Ali', studentId: 'CS-2023-078', quiz: 'Data Structures Quiz', score: '78%', time: 'Jul 14, 2025 - 11:15 AM', duration: '45 min', status: 'graded' },
            { id: 4, student: 'Ayesha Malik', studentId: 'CS-2023-103', quiz: 'Data Structures Quiz', score: '-', time: 'Jul 14, 2025 - 11:55 AM', duration: '-', status: 'pending' },
        ],
        courses: [
            { id: 'cs301', name: 'CS-301: Data Structures' },
            { id: 'cs405', name: 'CS-405: Computer Networks' },
            { id: 'cs402', name: 'CS-402: Software Engineering' },
            { id: 'cs303', name: 'CS-303: Database Systems' },
            { id: 'cs501', name: 'CS-501: Artificial Intelligence' },
        ],
        analytics: {
            quizPerformance: {
                averageScore: '82%',
                completionRate: '94%',
                timeDistribution: [15, 22, 8, 5], // minutes: 0-15, 15-30, 30-45, 45+
                scoreDistribution: [5, 12, 18, 15] // score ranges: 0-25%, 25-50%, 50-75%, 75-100%
            },
            studentEngagement: {
                activeStudents: 42,
                submissionsThisWeek: 28,
                averageAttemptsPerQuiz: 1.3,
                deviceDistribution: [65, 25, 10] // desktop, mobile, tablet percentages
            },
            questionAnalysis: {
                mostMissed: 'Q12 (64%)',
                easiest: 'Q5 (98% correct)',
                averageTimePerQuestion: '45 seconds',
                questionDifficulty: [3, 8, 15, 4] // easy, medium, hard, very hard
            },
            proctoringAlerts: {
                total: 7,
                flaggedStudents: 3,
                categories: {
                    multiplePersons: 2,
                    tabSwitching: 3,
                    audioDetection: 1,
                    noFaceVisible: 1
                }
            }
        }
    };

    // Sidebar collapse functionality
    const collapseSidebarBtn = document.getElementById('collapse-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    collapseSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // Save preference to localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
    
    // Restore sidebar state from localStorage
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
    
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.querySelector('.page-title h1');
    
    // Restore last active section from localStorage
    const lastActiveSection = localStorage.getItem('activeSection') || 'dashboard';
    
    // Initialize notifications container
    createNotificationsContainer();
    
    // Handle user dropdown
    initializeUserDropdown();
    
    // Handle notifications button
    initializeNotificationsButton();
    
    // Handle search bar
    initializeSearchBar();
    
    // Create sections that don't exist yet
    createMissingDashboardSections();
    
    // Initialize quizzes section
    initializeQuizzesSection();
    
    // Initialize create quiz section
    initializeCreateQuizSection();
    
    // Add navigation event listeners
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Get section to show
            const sectionId = this.getAttribute('data-section');
            
            // Save active section to localStorage
            localStorage.setItem('activeSection', sectionId);
            
            // Show the correct section
            showSection(sectionId);
        });
    });
    
    // Show the last active section or dashboard by default
    const activeNavItem = document.querySelector(`.nav-item[data-section="${lastActiveSection}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
        showSection(lastActiveSection);
    } else {
        // Fallback to dashboard
        const dashboardNavItem = document.querySelector('.nav-item[data-section="dashboard"]');
        if (dashboardNavItem) dashboardNavItem.classList.add('active');
        showSection('dashboard');
    }
    
    function showSection(sectionId) {
        // Update page title
        pageTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the requested section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
    
    function createMissingDashboardSections() {
        // Create submissions section if it doesn't exist
        if (!document.getElementById('submissions-section')) {
            createSubmissionsSection();
        }
        
        // Create analytics section if it doesn't exist
        if (!document.getElementById('analytics-section')) {
            createAnalyticsSection();
        }
        
        // Create settings section if it doesn't exist
        if (!document.getElementById('settings-section')) {
            createSettingsSection();
        }
    }
    
        // Initialize quizzes section
    function initializeQuizzesSection() {
        const quizzesSection = document.getElementById('quizzes-section');
        if (!quizzesSection) return;
        
        // Populate quizzes table
        const quizzesTable = quizzesSection.querySelector('.data-table tbody');
        if (quizzesTable) {
            quizzesTable.innerHTML = dashboardData.quizzes.map(quiz => `
                <tr>
                    <td>${quiz.title}</td>
                    <td>${quiz.course}</td>
                    <td>${quiz.questions} questions</td>
                    <td>${quiz.duration}</td>
                    <td><span class="status ${quiz.status}">${quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}</span></td>
                    <td>${quiz.submissions}</td>
                    <td class="actions">
                        <button class="btn-icon view-quiz" data-id="${quiz.id}" title="View Quiz">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon edit-quiz" data-id="${quiz.id}" title="Edit Quiz">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon analytics-quiz" data-id="${quiz.id}" title="Analytics">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn-icon download-quiz" data-id="${quiz.id}" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-icon delete-quiz" data-id="${quiz.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Add event listeners for quiz actions
        quizzesSection.querySelectorAll('.view-quiz').forEach(btn => {
            btn.addEventListener('click', function() {
                const quizId = this.getAttribute('data-id');
                const quiz = dashboardData.quizzes.find(q => q.id == quizId);
                showNotification(`Viewing quiz: ${quiz.title}`, 'info');
            });
        });
        
        quizzesSection.querySelectorAll('.edit-quiz').forEach(btn => {
            btn.addEventListener('click', function() {
                const quizId = this.getAttribute('data-id');
                const quiz = dashboardData.quizzes.find(q => q.id == quizId);
                showNotification(`Editing quiz: ${quiz.title}`, 'info');
                
                // Switch to create quiz section and populate form
                navItems.forEach(navItem => navItem.classList.remove('active'));
                document.querySelector('.nav-item[data-section="create"]').classList.add('active');
                showSection('create');
            });
        });
        
        quizzesSection.querySelectorAll('.analytics-quiz').forEach(btn => {
            btn.addEventListener('click', function() {
                const quizId = this.getAttribute('data-id');
                const quiz = dashboardData.quizzes.find(q => q.id == quizId);
                showNotification(`Viewing analytics for: ${quiz.title}`, 'info');
                
                // Switch to analytics section
                navItems.forEach(navItem => navItem.classList.remove('active'));
                document.querySelector('.nav-item[data-section="analytics"]').classList.add('active');
                showSection('analytics');
            });
        });
        
        quizzesSection.querySelectorAll('.download-quiz').forEach(btn => {
            btn.addEventListener('click', function() {
                const quizId = this.getAttribute('data-id');
                const quiz = dashboardData.quizzes.find(q => q.id == quizId);
                showNotification(`Downloading quiz: ${quiz.title}`, 'success');
            });
        });
        
        quizzesSection.querySelectorAll('.delete-quiz').forEach(btn => {
            btn.addEventListener('click', function() {
                const quizId = this.getAttribute('data-id');
                const quiz = dashboardData.quizzes.find(q => q.id == quizId);
                
                if (confirm(`Are you sure you want to delete the quiz: ${quiz.title}?`)) {
                    // Remove from array (in a real app, this would be an API call)
                    const index = dashboardData.quizzes.findIndex(q => q.id == quizId);
                    if (index !== -1) {
                        dashboardData.quizzes.splice(index, 1);
                        
                        // Remove from DOM
                        this.closest('tr').remove();
                        
                        showNotification(`Quiz deleted: ${quiz.title}`, 'success');
                    }
                }
            });
        });
        
        // Handle create quiz button
        const createQuizBtn = quizzesSection.querySelector('#create-quiz-btn');
        if (createQuizBtn) {
            createQuizBtn.addEventListener('click', function() {
                // Switch to create quiz section
                navItems.forEach(navItem => navItem.classList.remove('active'));
                document.querySelector('.nav-item[data-section="create"]').classList.add('active');
                showSection('create');
            });
        }
        
        // Handle filter and search
        const filterSelect = quizzesSection.querySelector('.filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', function() {
                showNotification(`Filtered quizzes by: ${this.options[this.selectedIndex].text}`, 'info');
            });
        }
        
        const searchInput = quizzesSection.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.trim();
                if (searchTerm.length > 2) {
                    showNotification(`Searching for quiz: ${searchTerm}`, 'info');
                }
            });
        }
        
        // Handle pagination
        const paginationBtns = quizzesSection.querySelectorAll('.pagination .btn');
        if (paginationBtns.length) {
            paginationBtns.forEach(button => {
                button.addEventListener('click', function() {
                    quizzesSection.querySelectorAll('.pagination .btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    if (!this.querySelector('i')) {
                        this.classList.add('active');
                    }
                    
                    const page = this.textContent || (this.querySelector('i').className.includes('left') ? 'Previous' : 'Next');
                    showNotification(`Navigated to page: ${page}`, 'info');
                });
            });
        }
    }
    
    // Initialize create quiz section
    function initializeCreateQuizSection() {
        // Create the section if it doesn't exist
        if (!document.getElementById('create-section')) {
            createQuizFormSection();
        }
        
        const createSection = document.getElementById('create-section');
        if (!createSection) return;
        
        // Handle form submission
        const quizForm = createSection.querySelector('#quiz-form');
        if (quizForm) {
            quizForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const title = this.querySelector('#quiz-title').value;
                const course = this.querySelector('#quiz-course').value;
                const duration = this.querySelector('#quiz-duration').value;
                
                // In a real app, this would be an API call
                const newQuiz = {
                    id: dashboardData.quizzes.length + 1,
                    title: title,
                    course: course,
                    questions: document.querySelectorAll('.question-item').length,
                    duration: `${duration} min`,
                    status: 'draft',
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    submissions: 0
                };
                
                // Add to array
                dashboardData.quizzes.push(newQuiz);
                
                showNotification(`Quiz created: ${title}`, 'success');
                
                // Reset form
                this.reset();
                
                // Switch back to quizzes section
                navItems.forEach(navItem => navItem.classList.remove('active'));
                document.querySelector('.nav-item[data-section="quizzes"]').classList.add('active');
                showSection('quizzes');
                
                // Refresh quizzes table
                initializeQuizzesSection();
            });
        }
        
        // Handle add question button
        const addQuestionBtn = createSection.querySelector('#add-question-btn');
        if (addQuestionBtn) {
            addQuestionBtn.addEventListener('click', function() {
                addNewQuestion();
            });
        }
        
        // Handle cancel button
        const cancelBtn = createSection.querySelector('#cancel-quiz-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                    // Switch back to quizzes section
                    navItems.forEach(navItem => navItem.classList.remove('active'));
                    document.querySelector('.nav-item[data-section="quizzes"]').classList.add('active');
                    showSection('quizzes');
                    
                    // Reset form
                    document.getElementById('quiz-form').reset();
                    
                    // Remove all questions except the first one
                    const questions = document.querySelectorAll('.question-item');
                    for (let i = 1; i < questions.length; i++) {
                        questions[i].remove();
                    }
                    
                    // Reset first question
                    const firstQuestion = document.querySelector('.question-item');
                    if (firstQuestion) {
                        firstQuestion.querySelector('textarea').value = '';
                        firstQuestion.querySelector('select').value = 'multiple';
                        
                        // Reset options
                        const options = firstQuestion.querySelectorAll('.option-item');
                        for (let i = 0; i < options.length; i++) {
                            if (i < 2) {
                                options[i].querySelector('input[type="text"]').value = '';
                                options[i].querySelector('input[type="radio"]').checked = i === 0;
                            } else {
                                options[i].remove();
                            }
                        }
                    }
                }
            });
        }
        
        // Add first question if none exists
        if (createSection.querySelectorAll('.question-item').length === 0) {
            addNewQuestion();
        }
        
        // Function to add a new question
        function addNewQuestion() {
            const questionsContainer = createSection.querySelector('.questions-container');
            const questionCount = questionsContainer.querySelectorAll('.question-item').length + 1;
            
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.innerHTML = `
                <div class="question-header">
                    <h3>Question ${questionCount}</h3>
                    <button type="button" class="btn-icon remove-question">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="form-group">
                    <textarea placeholder="Enter your question here..."></textarea>
                </div>
                <div class="form-group">
                    <label>Question Type</label>
                    <select class="question-type">
                        <option value="multiple">Multiple Choice</option>
                        <option value="single">Single Choice</option>
                        <option value="text">Text Answer</option>
                    </select>
                </div>
                <div class="options-container">
                    <div class="option-item">
                        <input type="radio" name="correct-${questionCount}" checked>
                        <input type="text" placeholder="Option 1">
                        <button type="button" class="btn-icon remove-option">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="option-item">
                        <input type="radio" name="correct-${questionCount}">
                        <input type="text" placeholder="Option 2">
                        <button type="button" class="btn-icon remove-option">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="btn outline small add-option-btn">
                    <i class="fas fa-plus"></i> Add Option
                </button>
            `;
            
            questionsContainer.appendChild(questionItem);
            
            // Add event listener for remove question button
            questionItem.querySelector('.remove-question').addEventListener('click', function() {
                if (questionsContainer.querySelectorAll('.question-item').length > 1) {
                    questionItem.remove();
                    
                    // Renumber questions
                    questionsContainer.querySelectorAll('.question-item').forEach((item, index) => {
                        item.querySelector('h3').textContent = `Question ${index + 1}`;
                        
                        // Update radio button names
                        const radioButtons = item.querySelectorAll('input[type="radio"]');
                        radioButtons.forEach(radio => {
                            radio.name = `correct-${index + 1}`;
                        });
                    });
                } else {
                    showNotification('Cannot remove the only question', 'error');
                }
            });
            
            // Add event listener for question type change
            questionItem.querySelector('.question-type').addEventListener('change', function() {
                const optionsContainer = questionItem.querySelector('.options-container');
                const addOptionBtn = questionItem.querySelector('.add-option-btn');
                
                if (this.value === 'text') {
                    optionsContainer.style.display = 'none';
                    addOptionBtn.style.display = 'none';
                } else {
                    optionsContainer.style.display = 'block';
                    addOptionBtn.style.display = 'inline-block';
                    
                    // Change input type based on question type
                    const inputType = this.value === 'multiple' ? 'checkbox' : 'radio';
                    optionsContainer.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
                        const newInput = document.createElement('input');
                        newInput.type = inputType;
                        newInput.name = input.name;
                        newInput.checked = input.checked;
                        input.parentNode.replaceChild(newInput, input);
                    });
                }
            });
            
            // Add event listener for add option button
            questionItem.querySelector('.add-option-btn').addEventListener('click', function() {
                const optionsContainer = questionItem.querySelector('.options-container');
                const optionCount = optionsContainer.querySelectorAll('.option-item').length + 1;
                
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item';
                
                const questionType = questionItem.querySelector('.question-type').value;
                const inputType = questionType === 'multiple' ? 'checkbox' : 'radio';
                
                optionItem.innerHTML = `
                    <input type="${inputType}" name="correct-${questionCount}">
                    <input type="text" placeholder="Option ${optionCount}">
                    <button type="button" class="btn-icon remove-option">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                optionsContainer.appendChild(optionItem);
                
                // Add event listener for remove option button
                optionItem.querySelector('.remove-option').addEventListener('click', function() {
                    if (optionsContainer.querySelectorAll('.option-item').length > 2) {
                        optionItem.remove();
                        
                        // Renumber options
                        optionsContainer.querySelectorAll('.option-item').forEach((item, index) => {
                            item.querySelector('input[type="text"]').placeholder = `Option ${index + 1}`;
                        });
                    } else {
                        showNotification('Each question must have at least 2 options', 'error');
                    }
                });
            });
            
            // Add event listeners for existing remove option buttons
            questionItem.querySelectorAll('.remove-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    const optionsContainer = questionItem.querySelector('.options-container');
                    if (optionsContainer.querySelectorAll('.option-item').length > 2) {
                        this.closest('.option-item').remove();
                        
                        // Renumber options
                        optionsContainer.querySelectorAll('.option-item').forEach((item, index) => {
                            item.querySelector('input[type="text"]').placeholder = `Option ${index + 1}`;
                        });
                    } else {
                        showNotification('Each question must have at least 2 options', 'error');
                    }
                });
            });
        }
    }
    
    // Create quiz form section
    function createQuizFormSection() {
        const section = document.createElement('section');
        section.id = 'create-section';
        section.className = 'content-section';
        section.style.display = 'none';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>Create Quiz</h2>
            </div>
            
            <form id="quiz-form" class="quiz-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="quiz-title">Quiz Title</label>
                        <input type="text" id="quiz-title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="quiz-course">Course</label>
                        <select id="quiz-course" required>
                            <option value="">Select Course</option>
                            ${dashboardData.courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="quiz-duration">Duration (minutes)</label>
                        <input type="number" id="quiz-duration" min="5" value="45" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="quiz-attempts">Allowed Attempts</label>
                        <input type="number" id="quiz-attempts" min="1" value="1" required>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Proctoring Settings</h3>
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="require-camera" checked>
                            <label for="require-camera">Require Camera</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="require-mic" checked>
                            <label for="require-mic">Require Microphone</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="require-screen" checked>
                            <label for="require-screen">Require Screen Sharing</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="lock-browser" checked>
                            <label for="lock-browser">Lock Browser</label>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <div class="section-header-inline">
                        <h3>Questions</h3>
                        <button type="button" class="btn outline" id="add-question-btn">
                            <i class="fas fa-plus"></i> Add Question
                        </button>
                    </div>
                    
                    <div class="questions-container">
                        <!-- Questions will be added dynamically -->
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn outline" id="cancel-quiz-btn">Cancel</button>
                    <button type="submit" class="btn primary">Save Quiz</button>
                </div>
            </form>
        `;
        
        document.querySelector('.content-container').appendChild(section);
    }
    
    // Initialize notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        const notificationsContainer = document.querySelector('.notifications-container') || createNotificationsContainer();
        notificationsContainer.appendChild(notification);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Create notifications container if it doesn't exist
    function createNotificationsContainer() {
        const notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
        return notificationsContainer;
    }
    
    // Initialize user dropdown functionality
    function initializeUserDropdown() {
        const userBtn = document.querySelector('.user-btn');
        if (!userBtn) return;
        
        const userDropdown = document.createElement('div');
        userDropdown.className = 'user-dropdown';
        userDropdown.innerHTML = `
            <ul>
                <li><a href="#"><i class="fas fa-user"></i> Profile</a></li>
                <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="../../index.html"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        `;
        userBtn.parentNode.appendChild(userDropdown);
        
        userBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    // Initialize notifications button functionality
    function initializeNotificationsButton() {
        const notificationsBtn = document.querySelector('.notifications .icon-btn');
        if (!notificationsBtn) return;
        
        notificationsBtn.addEventListener('click', function() {
            showNotification('New submission: Ali Ahmed - Data Structures Quiz', 'info');
            setTimeout(() => {
                showNotification('Quiz completed: Database Systems Final', 'success');
            }, 1000);
        });
    }
    
    // Initialize search bar functionality
    function initializeSearchBar() {
        const searchBar = document.querySelector('.search-bar input');
        if (!searchBar) return;
        
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                showNotification(`Searching for: ${this.value}`, 'info');
                this.value = '';
            }
        });
    }
    
    // Initialize quizzes section
    initializeQuizzesSection();
    
    // Initialize create quiz section
    initializeCreateQuizSection();
    
    // Create submissions section
    function createSubmissionsSection() {
        const section = document.createElement('section');
        section.id = 'submissions-section';
        section.className = 'content-section';
        section.style.display = 'none';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>Submissions</h2>
            </div>
            
            <div class="filter-bar">
                <div class="filter-group">
                    <select class="filter-select" id="quiz-filter">
                        <option value="all">All Quizzes</option>
                        ${dashboardData.quizzes.map(quiz => `<option value="${quiz.id}">${quiz.title}</option>`).join('')}
                    </select>
                </div>
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search students...">
                </div>
            </div>
            
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student ID</th>
                            <th>Quiz</th>
                            <th>Score</th>
                            <th>Submission Time</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dashboardData.submissions.map(sub => `
                            <tr>
                                <td>${sub.student}</td>
                                <td>${sub.studentId}</td>
                                <td>${sub.quiz}</td>
                                <td>${sub.score}</td>
                                <td>${sub.time}</td>
                                <td>${sub.duration}</td>
                                <td><span class="status ${sub.status}">${sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span></td>
                                <td class="actions">
                                    <button class="btn-icon view-submission" data-id="${sub.id}"><i class="fas fa-eye"></i></button>
                                    ${sub.status === 'graded' ? `<button class="btn-icon edit-submission" data-id="${sub.id}"><i class="fas fa-edit"></i></button>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="pagination">
                <button class="btn"><i class="fas fa-chevron-left"></i></button>
                <button class="btn active">1</button>
                <button class="btn">2</button>
                <button class="btn">3</button>
                <button class="btn"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        
        document.querySelector('.content-container').appendChild(section);
        
        // Add event listeners for submissions section
        section.querySelectorAll('.view-submission').forEach(btn => {
            btn.addEventListener('click', function() {
                const submissionId = this.getAttribute('data-id');
                const submission = dashboardData.submissions.find(s => s.id == submissionId);
                showNotification(`Viewing submission: ${submission.student} - ${submission.quiz}`, 'info');
            });
        });
        
        section.querySelectorAll('.edit-submission').forEach(btn => {
            btn.addEventListener('click', function() {
                const submissionId = this.getAttribute('data-id');
                const submission = dashboardData.submissions.find(s => s.id == submissionId);
                showNotification(`Editing submission: ${submission.student} - ${submission.quiz}`, 'info');
            });
        });
        
        section.querySelector('#quiz-filter').addEventListener('change', function() {
            showNotification(`Filtered submissions by quiz: ${this.options[this.selectedIndex].text}`, 'info');
        });
        
        section.querySelector('.search-box input').addEventListener('input', function() {
            const searchTerm = this.value.trim();
            if (searchTerm.length > 2) {
                showNotification(`Searching for student: ${searchTerm}`, 'info');
            }
        });
        
        section.querySelectorAll('.pagination .btn').forEach(button => {
            button.addEventListener('click', function() {
                section.querySelectorAll('.pagination .btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                if (!this.querySelector('i')) {
                    this.classList.add('active');
                }
                
                const page = this.textContent || (this.querySelector('i').className.includes('left') ? 'Previous' : 'Next');
                showNotification(`Navigated to page: ${page}`, 'info');
            });
        });
    }
    
    // Create analytics section
    function createAnalyticsSection() {
        const section = document.createElement('section');
        section.id = 'analytics-section';
        section.className = 'content-section';
        section.style.display = 'none';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>Analytics</h2>
                <div class="date-filter">
                    <span>Last 30 Days</span>
                    <i class="fas fa-calendar"></i>
                </div>
            </div>
            
            <div class="analytics-grid">
                <div class="card analytics-card">
                    <div class="card-header">
                        <h3>Quiz Performance</h3>
                        <select class="mini-select">
                            <option value="all">All Quizzes</option>
                            ${dashboardData.quizzes.map(quiz => `<option value="${quiz.id}">${quiz.title}</option>`).join('')}
                        </select>
                    </div>
                    <div class="chart-container">
                        <div class="chart-placeholder">
                            <p>Quiz performance chart will be displayed here</p>
                        </div>
                    </div>
                </div>
                
                <div class="card analytics-card">
                    <div class="card-header">
                        <h3>Student Engagement</h3>
                    </div>
                    <div class="chart-container">
                        <div class="chart-placeholder">
                            <p>Student engagement chart will be displayed here</p>
                        </div>
                    </div>
                </div>
                
                <div class="card analytics-card">
                    <div class="card-header">
                        <h3>Question Analysis</h3>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Correct %</th>
                                    <th>Avg. Time</th>
                                    <th>Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>What is the time complexity of quicksort?</td>
                                    <td>78%</td>
                                    <td>45s</td>
                                    <td><span class="difficulty medium">Medium</span></td>
                                </tr>
                                <tr>
                                    <td>Explain the concept of binary search trees.</td>
                                    <td>65%</td>
                                    <td>90s</td>
                                    <td><span class="difficulty hard">Hard</span></td>
                                </tr>
                                <tr>
                                    <td>What is an array in data structures?</td>
                                    <td>95%</td>
                                    <td>20s</td>
                                    <td><span class="difficulty easy">Easy</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="card analytics-card">
                    <div class="card-header">
                        <h3>Proctoring Alerts</h3>
                    </div>
                    <div class="alerts-list">
                        <div class="alert-item">
                            <div class="alert-icon warning">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="alert-details">
                                <h4>Multiple Faces Detected</h4>
                                <p>Ali Ahmed - Data Structures Quiz</p>
                                <span class="alert-time">Jul 14, 2025 - 11:20 AM</span>
                            </div>
                            <button class="btn outline small review-alert">Review</button>
                        </div>
                        <div class="alert-item">
                            <div class="alert-icon danger">
                                <i class="fas fa-ban"></i>
                            </div>
                            <div class="alert-details">
                                <h4>Screen Sharing Interrupted</h4>
                                <p>Sara Khan - Data Structures Quiz</p>
                                <span class="alert-time">Jul 14, 2025 - 10:15 AM</span>
                            </div>
                            <button class="btn outline small review-alert">Review</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.content-container').appendChild(section);
        
        // Add event listeners for analytics section
        section.querySelectorAll('.mini-select').forEach(select => {
            select.addEventListener('change', function() {
                showNotification(`Changed analytics view to: ${this.options[this.selectedIndex].text}`, 'info');
            });
        });
        
        section.querySelectorAll('.review-alert').forEach(btn => {
            btn.addEventListener('click', function() {
                const alertText = this.closest('.alert-item').querySelector('h4').textContent;
                showNotification(`Reviewing alert: ${alertText}`, 'info');
            });
        });
        
        section.querySelector('.date-filter').addEventListener('click', function() {
            showNotification('Date filter options will be displayed here', 'info');
        });
    }
    
    // Create settings section
    function createSettingsSection() {
        const section = document.createElement('section');
        section.id = 'settings-section';
        section.className = 'content-section';
        section.style.display = 'none';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>Settings</h2>
            </div>
            
            <div class="settings-grid">
                <div class="card settings-card">
                    <div class="card-header">
                        <h3>Profile</h3>
                    </div>
                    <div class="card-content">
                        <div class="profile-info">
                            <div class="profile-avatar">
                                <img src="../../img/user-placeholder.png" alt="Teacher">
                                <button class="btn outline small">Change Photo</button>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="full-name">Full Name</label>
                                    <input type="text" id="full-name" value="Dr. Sarah Khan">
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" value="dr.sarah@nutech.edu.pk" disabled>
                                </div>
                                <div class="form-group">
                                    <label for="department">Department</label>
                                    <input type="text" id="department" value="Computer Science">
                                </div>
                                <div class="form-group">
                                    <label for="position">Position</label>
                                    <input type="text" id="position" value="Associate Professor">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn primary save-profile">Save Changes</button>
                    </div>
                </div>
                
                <div class="card settings-card">
                    <div class="card-header">
                        <h3>Default Quiz Settings</h3>
                    </div>
                    <div class="card-content">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="default-duration">Default Duration (minutes)</label>
                                <input type="number" id="default-duration" value="45">
                            </div>
                            <div class="form-group">
                                <label for="default-attempts">Default Attempts</label>
                                <input type="number" id="default-attempts" value="1">
                            </div>
                            <div class="form-group">
                                <label for="default-pass-score">Default Pass Score (%)</label>
                                <input type="number" id="default-pass-score" value="60">
                            </div>
                        </div>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="default-camera" checked>
                                <label for="default-camera">Require Camera</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="default-mic" checked>
                                <label for="default-mic">Require Microphone</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="default-screen" checked>
                                <label for="default-screen">Require Screen Sharing</label>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn primary save-defaults">Save Defaults</button>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.content-container').appendChild(section);
        
        // Add event listeners for settings section
        section.querySelector('.save-profile').addEventListener('click', function() {
            showNotification('Profile updated successfully!', 'success');
        });
        
        section.querySelector('.save-defaults').addEventListener('click', function() {
            showNotification('Default quiz settings updated!', 'success');
        });
        
        section.querySelector('.profile-avatar .btn').addEventListener('click', function() {
            showNotification('Photo upload functionality will be implemented soon', 'info');
        });
    }
    
    // Initialize notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.querySelector('.notifications-container').appendChild(notification);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Create notifications container if it doesn't exist
    if (!document.querySelector('.notifications-container')) {
        const notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
    
    // Handle user dropdown
    const userBtn = document.querySelector('.user-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    // Handle notifications button
    const notificationsBtn = document.querySelector('.notifications .icon-btn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            showNotification('New submission: Ali Ahmed - Data Structures Quiz', 'info');
            setTimeout(() => {
                showNotification('Quiz completed: Database Systems Final', 'success');
            }, 1000);
        });
    }
    
    // Handle search bar
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                showNotification(`Searching for: ${this.value}`, 'info');
                this.value = '';
            }
        });
    }
    
    // Handle quiz creation button
    const createQuizBtn = document.getElementById('create-quiz-btn');
    if (createQuizBtn) {
        createQuizBtn.addEventListener('click', function() {
            // Hide quizzes section and show create quiz form
            document.getElementById('quizzes-section').style.display = 'none';
            
            // Create and show the quiz form section if it doesn't exist
            let quizFormSection = document.getElementById('create-quiz-section');
            if (!quizFormSection) {
                quizFormSection = document.createElement('div');
                quizFormSection.id = 'create-quiz-section';
                quizFormSection.className = 'content-section';
                
                quizFormSection.innerHTML = `
                    <div class="section-header">
                        <h2>Create New Quiz</h2>
                        <button class="btn outline" id="back-to-quizzes-btn">
                            <i class="fas fa-arrow-left"></i> Back to Quizzes
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="card-content">
                            <form id="quiz-form">
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="quiz-title">Quiz Title</label>
                                        <input type="text" id="quiz-title" placeholder="Enter quiz title" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="quiz-course">Course</label>
                                        <select id="quiz-course" required>
                                            <option value="">Select Course</option>
                                            <option value="cs101">CS101 - Intro to Programming</option>
                                            <option value="cs201">CS201 - Data Structures</option>
                                            <option value="math202">MATH202 - Linear Algebra</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="quiz-date">Date</label>
                                        <input type="date" id="quiz-date" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="quiz-time">Time</label>
                                        <input type="time" id="quiz-time" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="quiz-duration">Duration (minutes)</label>
                                        <input type="number" id="quiz-duration" min="5" max="180" value="60" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="quiz-status">Status</label>
                                        <select id="quiz-status" required>
                                            <option value="draft">Draft</option>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="active">Active</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-section">
                                    <h3>Quiz Settings</h3>
                                    <div class="checkbox-group">
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="randomize-questions">
                                            <label for="randomize-questions">Randomize Questions</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="show-results">
                                            <label for="show-results">Show Results After Submission</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="time-limit">
                                            <label for="time-limit">Enforce Time Limit</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="prevent-cheating" checked>
                                            <label for="prevent-cheating">Enable Proctoring</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-section">
                                    <div class="section-header">
                                        <h3>Questions</h3>
                                        <button type="button" class="btn secondary" id="add-question-btn">
                                            <i class="fas fa-plus"></i> Add Question
                                        </button>
                                    </div>
                                    
                                    <div id="questions-container">
                                        <!-- Question items will be added here -->
                                        <div class="question-item">
                                            <div class="question-header">
                                                <h4>Question 1</h4>
                                                <div>
                                                    <button type="button" class="btn-icon"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label>Question Text</label>
                                                <textarea placeholder="Enter your question here"></textarea>
                                            </div>
                                            <div class="form-group">
                                                <label>Question Type</label>
                                                <select class="question-type">
                                                    <option value="multiple-choice">Multiple Choice</option>
                                                    <option value="true-false">True/False</option>
                                                    <option value="short-answer">Short Answer</option>
                                                </select>
                                            </div>
                                            <div class="options-container">
                                                <label>Options</label>
                                                <div class="option-item">
                                                    <input type="radio" name="correct-1" checked>
                                                    <input type="text" placeholder="Option 1">
                                                </div>
                                                <div class="option-item">
                                                    <input type="radio" name="correct-1">
                                                    <input type="text" placeholder="Option 2">
                                                </div>
                                                <div class="option-item">
                                                    <input type="radio" name="correct-1">
                                                    <input type="text" placeholder="Option 3">
                                                </div>
                                                <div class="option-item">
                                                    <input type="radio" name="correct-1">
                                                    <input type="text" placeholder="Option 4">
                                                </div>
                                            </div>
                                            <button type="button" class="btn-text add-option-btn">
                                                <i class="fas fa-plus"></i> Add Option
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" class="btn outline">Save as Draft</button>
                                    <button type="submit" class="btn primary">Create Quiz</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
                
                document.querySelector('.content-container').appendChild(quizFormSection);
                
                // Add event listener for back button
                document.getElementById('back-to-quizzes-btn').addEventListener('click', function() {
                    document.getElementById('create-quiz-section').style.display = 'none';
                    document.getElementById('quizzes-section').style.display = 'block';
                });
                
                // Add event listener for add question button
                document.getElementById('add-question-btn').addEventListener('click', function() {
                    const questionsContainer = document.getElementById('questions-container');
                    const questionCount = questionsContainer.querySelectorAll('.question-item').length + 1;
                    
                    const newQuestion = document.createElement('div');
                    newQuestion.className = 'question-item';
                    newQuestion.innerHTML = `
                        <div class="question-header">
                            <h4>Question ${questionCount}</h4>
                            <div>
                                <button type="button" class="btn-icon"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Question Text</label>
                            <textarea placeholder="Enter your question here"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Question Type</label>
                            <select class="question-type">
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="true-false">True/False</option>
                                <option value="short-answer">Short Answer</option>
                            </select>
                        </div>
                        <div class="options-container">
                            <label>Options</label>
                            <div class="option-item">
                                <input type="radio" name="correct-${questionCount}" checked>
                                <input type="text" placeholder="Option 1">
                            </div>
                            <div class="option-item">
                                <input type="radio" name="correct-${questionCount}">
                                <input type="text" placeholder="Option 2">
                            </div>
                            <div class="option-item">
                                <input type="radio" name="correct-${questionCount}">
                                <input type="text" placeholder="Option 3">
                            </div>
                            <div class="option-item">
                                <input type="radio" name="correct-${questionCount}">
                                <input type="text" placeholder="Option 4">
                            </div>
                        </div>
                        <button type="button" class="btn-text add-option-btn">
                            <i class="fas fa-plus"></i> Add Option
                        </button>
                    `;
                    
                    questionsContainer.appendChild(newQuestion);
                    
                    // Add event listener for the new add option button
                    const newAddOptionBtn = newQuestion.querySelector('.add-option-btn');
                    newAddOptionBtn.addEventListener('click', function() {
                        const optionsContainer = this.previousElementSibling;
                        const optionCount = optionsContainer.querySelectorAll('.option-item').length + 1;
                        
                        const newOption = document.createElement('div');
                        newOption.className = 'option-item';
                        newOption.innerHTML = `
                            <input type="radio" name="correct-${questionCount}">
                            <input type="text" placeholder="Option ${optionCount}">
                        `;
                        
                        optionsContainer.appendChild(newOption);
                    });
                    
                    // Add event listener for the delete question button
                    const deleteBtn = newQuestion.querySelector('.btn-icon');
                    deleteBtn.addEventListener('click', function() {
                        newQuestion.remove();
                        // Renumber questions
                        const questions = questionsContainer.querySelectorAll('.question-item');
                        questions.forEach((q, index) => {
                            q.querySelector('h4').textContent = `Question ${index + 1}`;
                        });
                    });
                });
                
                // Add event listener for the first add option button
                const firstAddOptionBtn = document.querySelector('.add-option-btn');
                firstAddOptionBtn.addEventListener('click', function() {
                    const optionsContainer = this.previousElementSibling;
                    const optionCount = optionsContainer.querySelectorAll('.option-item').length + 1;
                    
                    const newOption = document.createElement('div');
                    newOption.className = 'option-item';
                    newOption.innerHTML = `
                        <input type="radio" name="correct-1">
                        <input type="text" placeholder="Option ${optionCount}">
                    `;
                    
                    optionsContainer.appendChild(newOption);
                });
                
                // Add event listener for the first delete question button
                const firstDeleteBtn = document.querySelector('.question-item .btn-icon');
                firstDeleteBtn.addEventListener('click', function() {
                    }
                }
            });
        });
    });
    
    // Handle filter selects
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', function() {
            const filterType = this.options[0].textContent.includes('Quizzes') ? 'status' : 'course';
            const value = this.value;
            
            showNotification(`Filtered quizzes by ${filterType}: ${value}`, 'info');
        });
    });
    
    // Handle search box
    document.querySelector('.search-box input').addEventListener('input', function() {
        const searchTerm = this.value.trim();
        if (searchTerm.length > 2) {
            showNotification(`Searching for: ${searchTerm}`, 'info');
        }
    });
});
