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
    
    // Configurações do Telegram (Substitua pelos seus dados)
    const telegramBotToken = "8607846534:AAHxMCKNINP9xC-2qH34l0uCOrKMYW3oz4k"; 
    const telegramChatId = "SEU_CHAT_ID_AQUI";
    
    // Mostra feedback visual no botão enquanto envia
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "ENVIANDO DADOS...";
    submitBtn.disabled = true;

    if (telegramBotToken !== "SEU_TOKEN_AQUI" && telegramChatId !== "SEU_CHAT_ID_AQUI") {
        
        // Formata a mensagem que vai chegar no seu Telegram
        const message = `🚨 *NOVA APLICAÇÃO NAIA* 🚨\n\n` +
                        `👤 *Operador:* ${name}\n` +
                        `📱 *WhatsApp:* ${whatsapp}\n` +
                        `📊 *Experiência:* ${experience}\n` +
                        `💬 *Motivo:* ${motivation}`;

        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        })
        .then(response => {
            console.log("[NAIA] Clearance Request enviado para o Telegram com sucesso!");
            nextStep(5);
        })
        .catch(error => {
            console.error("Erro ao enviar para o Telegram:", error);
            // Mesmo com erro, avança pro sucesso pra não travar o usuário
            nextStep(5); 
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    } else {
        // Fallback local se não tiver configurado o bot ainda
        console.log("[NAIA] (Mockup) Clearance Request Submitted: ", formData);
        localStorage.setItem('naia_clearance_request', JSON.stringify(formData));
        nextStep(5);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});
