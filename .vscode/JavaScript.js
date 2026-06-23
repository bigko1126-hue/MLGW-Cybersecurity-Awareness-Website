const emails = [
    {
        sender: "security@yourbank.com",
        subject: "Verify your account immediately",
        body: "Dear customer, we detected suspicious activity on your account. Click the link below to verify your credentials and avoid suspension.",
        hint: "The sender address is generic, and the request for credentials is suspicious.",
        correct: "phishing"
    },
    {
        sender: "team@company.local",
        subject: "Quarterly update meeting",
        body: "Hello, please review the attached agenda and join the team meeting on Friday at 11:00 AM.",
        hint: "This looks like an internal meeting notice without urgent credential requests.",
        correct: "safe"
    },
    {
        sender: "it-support@service.com",
        subject: "Password reset required",
        body: "Your password will expire today. Use the link below to reset it now.",
        hint: "Legitimate password resets never arrive from unfamiliar addresses with urgent demands.",
        correct: "phishing"
    }
];

let currentIndex = 0;
const senderEl = document.getElementById('email-sender');
const subjectEl = document.getElementById('email-subject');
const bodyEl = document.getElementById('email-body');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('btn-next');

function loadEmail(index) {
    const email = emails[index];
    senderEl.textContent = email.sender;
    subjectEl.textContent = email.subject;
    bodyEl.textContent = email.body;
    feedbackEl.textContent = 'Choose the best response for this email.';
    feedbackEl.className = 'feedback';
    nextBtn.disabled = true;
}

function updateFeedback(message, state) {
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${state}`;
    nextBtn.disabled = false;
}

function handleChoice(choice) {
    const email = emails[currentIndex];
    if (choice === email.correct) {
        updateFeedback('Correct! ' + email.hint, 'correct');
    } else {
        updateFeedback('Incorrect. ' + email.hint, 'wrong');
    }
}

function showHint() {
    const email = emails[currentIndex];
    updateFeedback('Hint: ' + email.hint, 'hint');
}

function nextEmail() {
    currentIndex = (currentIndex + 1) % emails.length;
    loadEmail(currentIndex);
}

document.getElementById('btn-safe').addEventListener('click', () => handleChoice('safe'));
document.getElementById('btn-phishing').addEventListener('click', () => handleChoice('phishing'));
document.getElementById('btn-info').addEventListener('click', showHint);
document.getElementById('btn-next').addEventListener('click', nextEmail);

loadEmail(currentIndex);
