let currentStep = 0;
const totalSteps = 4; // Intro, Fase 1, Fase 2, Fase 3, Formulario (o de sucesso é o 5)

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Calcula progresso, step 0 = 0%, step 4 = 100%
    let percentage = (currentStep / totalSteps) * 100;
    
    if (currentStep === 5) percentage = 100; // Step sucesso

    progressFill.style.width = `${percentage}%`;
    progressText.innerText = `${Math.round(percentage)}% Concluído`;
}

function nextStep(step) {
    // Esconde o step atual
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    
    // Atualiza o currentStep e mostra o novo
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkAnswer(stepNumber, isCorrect, btnElement) {
    // Pega todas as opções daquela pergunta e desabilita
    const optionsContainer = btnElement.parentElement;
    const allButtons = optionsContainer.querySelectorAll('.quiz-btn');
    
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.6';
    });

    // Se estiver correto, destaca em verde e mostra botão avançar
    if (isCorrect) {
        btnElement.classList.add('correct');
        btnElement.style.opacity = '1';
        
        // Mostra o botão para o próximo passo
        const nextBtn = document.getElementById(`btn-next-${stepNumber}`);
        nextBtn.style.display = 'flex';
        
        // Feedback visual
        btnElement.innerHTML += ' <i class="fa-solid fa-check" style="margin-left: 10px;"></i>';
    } else {
        // Se errou, destaca em vermelho
        btnElement.classList.add('wrong');
        btnElement.style.opacity = '1';
        btnElement.innerHTML += ' <i class="fa-solid fa-xmark" style="margin-left: 10px;"></i>';
        
        // Punição: o usuário precisa tentar de novo (recarregar ou tentar outra opção? Vamos deixar ele clicar nas outras reativando-as)
        setTimeout(() => {
            allButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.cursor = 'pointer';
                btn.style.opacity = '1';
                btn.classList.remove('wrong');
                // Remove the icons added
                btn.innerHTML = btn.innerHTML.split(' <i')[0];
            });
        }, 1500);
    }
}

// Form Submission
document.getElementById('qualificationForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita recarregar a página
    
    // Coleta dados
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const experience = document.getElementById('experience').value;
    const motivation = document.getElementById('motivation').value;

    // Em um cenário real, enviaríamos para uma API/Webhook
    const formData = {
        name, whatsapp, experience, motivation,
        date: new Date().toISOString()
    };
    
    console.log("Aplicação enviada: ", formData);

    // Salvar localmente como mockup
    localStorage.setItem('radarcrypto_application', JSON.stringify(formData));

    // Vai para a tela de Sucesso
    nextStep(5);
});
