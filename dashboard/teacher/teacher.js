// Teacher Dashboard JavaScript

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
    
    // Question type change handler
    const questionTypeSelects = document.querySelectorAll('.question-type');
    questionTypeSelects.forEach(select => {
        select.addEventListener('change', function() {
            const questionItem = this.closest('.question-item');
            const mcqOptions = questionItem.querySelector('.mcq-options');
            
            if (this.value === 'mcq') {
                mcqOptions.style.display = 'block';
            } else {
                mcqOptions.style.display = 'none';
            }
        });
    });
    
    // Add question button
    const addQuestionBtn = document.querySelector('.btn-add-question');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', function() {
            const questionList = document.getElementById('question-list');
            const questionCount = questionList.children.length + 1;
            
            const newQuestion = document.createElement('div');
            newQuestion.className = 'question-item';
            newQuestion.innerHTML = `
                <div class="question-header">
                    <h4>Question ${questionCount}</h4>
                    <div class="question-actions">
                        <button class="btn-icon"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Question Text</label>
                    <textarea placeholder="Enter your question"></textarea>
                </div>
                <div class="form-group">
                    <label>Question Type</label>
                    <select class="question-type">
                        <option value="mcq">Multiple Choice</option>
                        <option value="text">Text Answer</option>
                        <option value="truefalse">True/False</option>
                    </select>
                </div>
                <div class="mcq-options">
                    <div class="form-group">
                        <label>Options</label>
                        <div class="option-item">
                            <input type="radio" name="correct-${questionCount}" id="option-${questionCount}-1">
                            <input type="text" placeholder="Option 1">
                            <button class="btn-icon"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="option-item">
                            <input type="radio" name="correct-${questionCount}" id="option-${questionCount}-2">
                            <input type="text" placeholder="Option 2">
                            <button class="btn-icon"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="option-item">
                            <input type="radio" name="correct-${questionCount}" id="option-${questionCount}-3">
                            <input type="text" placeholder="Option 3">
                            <button class="btn-icon"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="option-item">
                            <input type="radio" name="correct-${questionCount}" id="option-${questionCount}-4">
                            <input type="text" placeholder="Option 4">
                            <button class="btn-icon"><i class="fas fa-times"></i></button>
                        </div>
                        <button class="btn-add-option"><i class="fas fa-plus"></i> Add Option</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Points</label>
                    <input type="number" min="1" placeholder="10">
                </div>
            `;
            
            questionList.appendChild(newQuestion);
            
            // Add event listener to the new question's type select
            const newQuestionTypeSelect = newQuestion.querySelector('.question-type');
            newQuestionTypeSelect.addEventListener('change', function() {
                const mcqOptions = this.closest('.question-item').querySelector('.mcq-options');
                
                if (this.value === 'mcq') {
                    mcqOptions.style.display = 'block';
                } else {
                    mcqOptions.style.display = 'none';
                }
            });
            
            // Add event listener to the new question's add option button
            const newAddOptionBtn = newQuestion.querySelector('.btn-add-option');
            newAddOptionBtn.addEventListener('click', addOption);
            
            // Add event listener to the new question's delete button
            const deleteBtn = newQuestion.querySelector('.question-actions .btn-icon');
            deleteBtn.addEventListener('click', function() {
                newQuestion.remove();
                updateQuestionNumbers();
            });
            
            // Add event listeners to option delete buttons
            const optionDeleteBtns = newQuestion.querySelectorAll('.option-item .btn-icon');
            optionDeleteBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const optionItem = this.closest('.option-item');
                    optionItem.remove();
                    updateOptionNumbers(newQuestion);
                });
            });
        });
    }
    
    // Add option function
    function addOption() {
        const questionItem = this.closest('.question-item');
        const optionsContainer = questionItem.querySelector('.mcq-options .form-group');
        const optionCount = optionsContainer.querySelectorAll('.option-item').length + 1;
        const questionNumber = Array.from(questionItem.parentNode.children).indexOf(questionItem) + 1;
        
        const newOption = document.createElement('div');
        newOption.className = 'option-item';
        newOption.innerHTML = `
            <input type="radio" name="correct-${questionNumber}" id="option-${questionNumber}-${optionCount}">
            <input type="text" placeholder="Option ${optionCount}">
            <button class="btn-icon"><i class="fas fa-times"></i></button>
        `;
        
        optionsContainer.insertBefore(newOption, this);
        
        // Add event listener to delete button
        const deleteBtn = newOption.querySelector('.btn-icon');
        deleteBtn.addEventListener('click', function() {
            newOption.remove();
            updateOptionNumbers(questionItem);
        });
    }
    
    // Add event listeners to all add option buttons
    const addOptionBtns = document.querySelectorAll('.btn-add-option');
    addOptionBtns.forEach(btn => {
        btn.addEventListener('click', addOption);
    });
    
    // Add event listeners to all option delete buttons
    const optionDeleteBtns = document.querySelectorAll('.option-item .btn-icon');
    optionDeleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const optionItem = this.closest('.option-item');
            optionItem.remove();
            updateOptionNumbers(this.closest('.question-item'));
        });
    });
    
    // Add event listeners to all question delete buttons
    const questionDeleteBtns = document.querySelectorAll('.question-actions .btn-icon');
    questionDeleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const questionItem = this.closest('.question-item');
            questionItem.remove();
            updateQuestionNumbers();
        });
    });
    
    // Update question numbers
    function updateQuestionNumbers() {
        const questions = document.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            const questionNumber = index + 1;
            question.querySelector('.question-header h4').textContent = `Question ${questionNumber}`;
            
            // Update radio button names
            const radioButtons = question.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.setAttribute('name', `correct-${questionNumber}`);
            });
        });
    }
    
    // Update option numbers within a question
    function updateOptionNumbers(questionItem) {
        const options = questionItem.querySelectorAll('.option-item');
        options.forEach((option, index) => {
            const optionNumber = index + 1;
            const questionNumber = Array.from(questionItem.parentNode.children).indexOf(questionItem) + 1;
            
            option.querySelector('input[type="radio"]').setAttribute('id', `option-${questionNumber}-${optionNumber}`);
            option.querySelector('input[type="text"]').setAttribute('placeholder', `Option ${optionNumber}`);
        });
    }
    
    // Quiz form submission
    const quizForm = document.querySelector('.quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const quizTitle = document.getElementById('quiz-title').value;
            const quizDuration = document.getElementById('quiz-duration').value;
            const quizDate = document.getElementById('quiz-date').value;
            const quizTime = document.getElementById('quiz-time').value;
            
            if (!quizTitle || !quizDuration || !quizDate || !quizTime) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Simulate form submission
            alert('Quiz created successfully!');
            
            // Reset form
            quizForm.reset();
        });
    }
});
