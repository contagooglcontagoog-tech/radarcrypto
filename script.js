let currentStep = 0;
const totalSteps = 4; // Intro, Fase 1, Fase 2, Fase 3, Form (5 is success)

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    let percentage = (currentStep / totalSteps) * 100;
    if (currentStep === 5) percentage = 100; 

    progressFill.style.width = `${percentage}%`;
    progressText.innerText = `CLEARANCE: ${Math.round(percentage)}%`;
}

function nextStep(step) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkAnswer(stepNumber, isCorrect, btnElement) {
    const optionsContainer = btnElement.parentElement;
    const allButtons = optionsContainer.querySelectorAll('.quiz-btn');
    
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.5';
    });

    if (isCorrect) {
        btnElement.classList.add('correct');
        btnElement.style.opacity = '1';
        
        const nextBtn = document.getElementById(`btn-next-${stepNumber}`);
        nextBtn.style.display = 'block';
    } else {
        btnElement.classList.add('wrong');
        btnElement.style.opacity = '1';
        
        setTimeout(() => {
            allButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.cursor = 'pointer';
                btn.style.opacity = '1';
                btn.classList.remove('wrong');
            });
        }, 1500);
    }
}

document.getElementById('qualificationForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const experience = document.getElementById('experience').value;
    const motivation = document.getElementById('motivation').value;

    const formData = {
        name, whatsapp, experience, motivation,
        date: new Date().toISOString()
    };
    
    console.log("[NAIA] Clearance Request Submitted: ", formData);
    localStorage.setItem('naia_clearance_request', JSON.stringify(formData));

    nextStep(5);
});
