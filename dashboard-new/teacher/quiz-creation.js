/**
 * ProctorAI Quiz Creation Module
 * Developed by R Lab Work (Aleena Tahir & Saqlain Abbas)
 * 
 * This module handles the quiz creation functionality including:
 * - Adding/removing questions
 * - Supporting multiple question types (MCQ, text-based)
 * - Managing options for MCQ questions
 * - Form validation and submission
 */

// Initialize the quiz creation functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz creation module loaded');
    initializeQuizCreation();
});

// Initialize quiz creation
function initializeQuizCreation() {
    // Setup add question button
    const addQuestionBtn = document.getElementById('add-question');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', function() {
            addNewQuestion();
        });
    }
    
    // Setup quiz form submission
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveQuiz();
        });
    }
    
    // Setup save as draft button
    const saveDraftBtn = document.getElementById('save-draft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            saveQuizAsDraft();
        });
    }
    
    // Add initial question if container is empty
    const questionsContainer = document.getElementById('questions-container');
    if (questionsContainer && questionsContainer.children.length === 0) {
        addNewQuestion();
    }
}

// Add a new question to the quiz
function addNewQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionCount = questionsContainer.children.length + 1;
    
    // Create question card
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.dataset.questionId = `question-${Date.now()}`;
    
    // Create question content
    questionCard.innerHTML = `
        <div class="question-header">
            <div class="question-number">
                <span class="badge">${questionCount}</span>
                Question ${questionCount}
            </div>
            <div class="question-actions">
                <button type="button" class="btn-icon" onclick="moveQuestion(this, 'up')" title="Move Up">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button type="button" class="btn-icon" onclick="moveQuestion(this, 'down')" title="Move Down">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button type="button" class="btn-icon delete" onclick="removeQuestion(this)" title="Remove Question">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        
        <div class="question-type-selector">
            <button type="button" class="question-type-btn active" data-type="mcq" onclick="switchQuestionType(this, 'mcq')">Multiple Choice</button>
            <button type="button" class="question-type-btn" data-type="text" onclick="switchQuestionType(this, 'text')">Text Answer</button>
        </div>
        
        <div class="question-content">
            <label for="question-text-${questionCount}">Question Text</label>
            <textarea id="question-text-${questionCount}" placeholder="Enter your question here" required></textarea>
            
            <div class="question-type-content mcq-type active">
                <label>Options</label>
                <div class="options-container">
                    <div class="option-item">
                        <input type="radio" name="correct-${questionCount}" checked>
                        <input type="text" placeholder="Option 1" required>
                        <button type="button" class="remove-option" onclick="removeOption(this)" title="Remove Option">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="option-item">
                        <input type="radio" name="correct-${questionCount}">
                        <input type="text" placeholder="Option 2" required>
                        <button type="button" class="remove-option" onclick="removeOption(this)" title="Remove Option">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="add-option-btn" onclick="addOption(this)">
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
    
    // Add to container
    questionsContainer.appendChild(questionCard);
    
    // Initialize the question type content visibility
    const mcqContent = questionCard.querySelector('.mcq-type');
    const textContent = questionCard.querySelector('.text-type');
    mcqContent.classList.add('active');
    textContent.classList.remove('active');
    
    // Scroll to the new question
    questionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Switch between question types (MCQ or Text)
function switchQuestionType(button, type) {
    const questionCard = button.closest('.question-card');
    
    // Update button active state
    const typeButtons = questionCard.querySelectorAll('.question-type-btn');
    typeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
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
}

// Add a new option to an MCQ question
function addOption(button) {
    const optionsContainer = button.previousElementSibling;
    const optionItems = optionsContainer.querySelectorAll('.option-item');
    const optionCount = optionItems.length + 1;
    const questionCard = button.closest('.question-card');
    const questionId = questionCard.dataset.questionId.replace('question-', '');
    
    // Create new option
    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    optionItem.innerHTML = `
        <input type="radio" name="correct-${questionId}">
        <input type="text" placeholder="Option ${optionCount}" required>
        <button type="button" class="remove-option" onclick="removeOption(this)" title="Remove Option">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    optionsContainer.appendChild(optionItem);
    
    // Focus on the new input
    const input = optionItem.querySelector('input[type="text"]');
    input.focus();
}

// Remove an option from an MCQ question
function removeOption(button) {
    const optionItem = button.closest('.option-item');
    const optionsContainer = optionItem.parentElement;
    
    // Don't remove if it's the last option
    if (optionsContainer.children.length <= 2) {
        showNotification('A question must have at least 2 options', 'warning');
        return;
    }
    
    // Remove the option
    optionItem.remove();
    
    // Update option placeholders
    const options = optionsContainer.querySelectorAll('.option-item');
    options.forEach((option, index) => {
        const input = option.querySelector('input[type="text"]');
        if (input.value === '') {
            input.placeholder = `Option ${index + 1}`;
        }
    });
}

// Remove a question from the quiz
function removeQuestion(button) {
    const questionCard = button.closest('.question-card');
    const questionsContainer = questionCard.parentElement;
    
    // Don't remove if it's the last question
    if (questionsContainer.children.length <= 1) {
        showNotification('A quiz must have at least one question', 'warning');
        return;
    }
    
    // Remove the question
    questionCard.remove();
    
    // Update question numbers
    updateQuestionNumbers();
}

// Move a question up or down
function moveQuestion(button, direction) {
    const questionCard = button.closest('.question-card');
    const questionsContainer = questionCard.parentElement;
    
    if (direction === 'up') {
        const prevQuestion = questionCard.previousElementSibling;
        if (prevQuestion) {
            questionsContainer.insertBefore(questionCard, prevQuestion);
        }
    } else if (direction === 'down') {
        const nextQuestion = questionCard.nextElementSibling;
        if (nextQuestion) {
            questionsContainer.insertBefore(nextQuestion, questionCard);
        }
    }
    
    // Update question numbers
    updateQuestionNumbers();
    
    // Scroll to the moved question
    questionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Update question numbers after reordering or removal
function updateQuestionNumbers() {
    const questionCards = document.querySelectorAll('.question-card');
    questionCards.forEach((card, index) => {
        const questionNumber = card.querySelector('.question-number');
        const badge = questionNumber.querySelector('.badge');
        const questionCount = index + 1;
        
        badge.textContent = questionCount;
        questionNumber.childNodes[1].nodeValue = ` Question ${questionCount}`;
    });
}

// Save quiz as draft
function saveQuizAsDraft() {
    // Validate required fields
    const title = document.getElementById('quiz-title').value;
    if (!title) {
        showNotification('Please enter a quiz title', 'warning');
        document.getElementById('quiz-title').focus();
        return;
    }
    
    // Show success notification
    showNotification('Quiz saved as draft', 'success');
}

// Save and publish quiz
function saveQuiz() {
    // Get form data
    const title = document.getElementById('quiz-title').value;
    const course = document.getElementById('course-select').value;
    const duration = document.getElementById('quiz-duration').value;
    const date = document.getElementById('quiz-date').value;
    const time = document.getElementById('quiz-time').value;
    
    // Validate form
    if (!title || !course || !duration || !date || !time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate questions
    const questions = document.querySelectorAll('.question-card');
    for (let i = 0; i < questions.length; i++) {
        const questionText = questions[i].querySelector('textarea').value;
        if (!questionText) {
            showNotification(`Please enter text for Question ${i + 1}`, 'warning');
            questions[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Check if it's an MCQ and validate options
        const isMCQ = questions[i].querySelector('.mcq-type').classList.contains('active');
        if (isMCQ) {
            const options = questions[i].querySelectorAll('.option-item input[type="text"]');
            for (let j = 0; j < options.length; j++) {
                if (!options[j].value) {
                    showNotification(`Please enter text for all options in Question ${i + 1}`, 'warning');
                    options[j].focus();
                    return;
                }
            }
            
            // Check if an option is selected as correct
            const correctOption = questions[i].querySelector('.option-item input[type="radio"]:checked');
            if (!correctOption) {
                showNotification(`Please select a correct option for Question ${i + 1}`, 'warning');
                questions[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }
    }
    
    // Show success notification
    showNotification('Quiz created successfully', 'success');
    
    // Reset form or redirect
    // window.location.href = '#quizzes-section';
}

// Add this to the existing showNotification function or create it if it doesn't exist
function showNotification(message, type = 'info') {
    // Check if the function exists in the parent scope
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
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
        let notificationsContainer = document.querySelector('.notifications-container');
        if (!notificationsContainer) {
            notificationsContainer = document.createElement('div');
            notificationsContainer.className = 'notifications-container';
            document.body.appendChild(notificationsContainer);
        }
        notificationsContainer.appendChild(notification);
        
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
