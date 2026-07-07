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
    if (!senderEl || !subjectEl || !bodyEl || !feedbackEl || !nextBtn) {
        return;
    }

    senderEl.textContent = email.sender;
    subjectEl.textContent = email.subject;
    bodyEl.textContent = email.body;
    feedbackEl.textContent = 'Choose the best response for this email.';
    feedbackEl.className = 'feedback';
    nextBtn.disabled = true;
}

function updateFeedback(message, state) {
    if (!feedbackEl || !nextBtn) {
        return;
    }

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

if (document.getElementById('btn-safe')) {
    document.getElementById('btn-safe').addEventListener('click', () => handleChoice('safe'));
}
if (document.getElementById('btn-phishing')) {
    document.getElementById('btn-phishing').addEventListener('click', () => handleChoice('phishing'));
}
if (document.getElementById('btn-info')) {
    document.getElementById('btn-info').addEventListener('click', showHint);
}
if (document.getElementById('btn-next')) {
    document.getElementById('btn-next').addEventListener('click', nextEmail);
}

const passwordInput = document.getElementById('password');
const strengthMeter = document.getElementById('strength-meter');
const strengthText = document.getElementById('strength-text');
const strengthFeedback = document.getElementById('strength-feedback');
const checkerSection = document.querySelector('.password-checker');
const checkerLink = document.getElementById('open-checker');

const commonWeakPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  '111111', 'iloveyou', 'admin', 'welcome', 'letmein',
  'monkey', 'login', 'abc123456', 'starwars', '123123',
  'dragon', 'passw0rd', 'master', 'hello', 'freedom',
  'whatever', 'qazwsx', 'trustno1', '654321', 'superman',
  '1q2w3e4r', '1234', '12345', '1234567', '12345678',
  '1234567890', 'password1', 'password123', 'admin123',
  'welcome1', 'letmein123', 'monkey123', 'login123',
  'abc123456789', 'starwars123', '123123123', 'dragon123',
  'passw0rd123', 'master123', 'hello123', 'freedom123',
  'whatever123', 'qazwsx123', 'trustno1123', '654321123',
  'superman123', '1q2w3e4r123', '1234abc', '12345abc',
  '123456abc', '1234567abc', '12345678abc', '1234567890abc',
  'passwordabc', 'password123abc', 'adminabc', 'welcomeabc',
  'letmeinabc', 'monkeyabc', 'loginabc', 'abc1234567890',
  'starwarsabc', '123123abc', 'dragonabc', 'passw0rdabc',
  'masterabc', 'helloabc', 'freedomabc', 'whateverabc',
  'qazwsxabc', 'trustno1abc', '654321abc', 'supermanabc',
  '1q2w3e4rabc', '1234password', '12345password', '123456password',
  '1234567password', '12345678password', '1234567890password',
  'passwordpassword', 'password123password', 'adminpassword',
  'welcomepassword', 'letmeinpassword', 'monkeypassword',
  'loginpassword', 'abc1234567890password', 'starwarspassword',
  '123123password', 'dragonpassword', 'passw0rdpassword',
  'masterpassword', 'hellopassword', 'freedompassword',
  'whateverpassword', 'qazwsxpassword', 'trustno1password',
  '654321password', 'supermanpassword', '1q2w3e4rpassword',
  '1234qwer', '12345qwer', '123456qwer', '1234567qwer',
  '12345678qwer', '1234567890qwer', 'passwordqwer',
  'password123qwer', 'adminqwer', 'welcomeqwer',
  'letmeinqwer', 'monkeyqwer', 'loginqwer', 'abc1234567890qwer',
  'starwarsqwer', '123123qwer', 'dragonqwer', 'passw0rdqwer',
  'masterqwer', 'helloqwer', 'freedomqwer', 'whateverqwer',
  'qazwsxqwer', 'trustno1qwer', '654321qwer', 'supermanqwer',
  '1q2w3e4rqwer', '1234asdf', '12345asdf', '123456asdf',
  '1234567asdf', '12345678asdf', '1234567890asdf', 'passwordasdf',
  'password123asdf', 'adminasdf', 'welcomeasdf', 'letmeinasdf',
  'monkeyasdf', 'loginasdf', 'abc1234567890asdf', 'starwarsasdf',
  '123123asdf', 'dragonasdf', 'passw0rddasdf', 'masterasdf',
  'helloasdf', 'freedomasdf', 'whateverasdf', 'qazwsxasdf',
  'trustno1asdf', '654321asdf', 'supermanasdf', '1q2w3e4rasdf', 'Password123!', 'Password!123'
];

function evaluatePassword(password) {
  const feedback = [];
  let score = 0;

  if (!password || password.length === 0) {
    return { score, feedback: ['Password is empty'] };
  }

  const length = password.length;
  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const digit = /[0-9]/.test(password);
  const symbol = /[^A-Za-z0-9]/.test(password);
  const repeatSequence = /([A-Za-z])\1{2,}/.test(password);
  const sequential = /(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);
  const commonWord = commonWeakPasswords.some(word => password.toLowerCase().includes(word));

  if (length >= 12) score += 30;
  else if (length >= 8) score += 20;
  else if (length >= 6) score += 10;

  if (lower && upper) score += 20;
  else if (lower || upper) score += 10;

  if (digit) score += 15;
  if (symbol) score += 15;

  if (!repeatSequence) score += 10;
  if (!sequential) score += 10;

  if (commonWord) {
    feedback.push('Avoid common words or easily guessed phrases');
    score -= 20;
  }
  if (repeatSequence) {
    feedback.push('Avoid repeated characters like "aaa"');
    score -= 10;
  }
  if (sequential) {
    feedback.push('Avoid sequential patterns like "123" or "abc"');
    score -= 10;
  }

  if (length < 12) {
    feedback.push('Use at least 12 characters. Longer is better');
  }
  if (!lower) feedback.push('Add lowercase letters');
  if (!upper) feedback.push('Add uppercase letters');
  if (!digit) feedback.push('Add numbers');
  if (!symbol) feedback.push('Add special characters');

  score = Math.min(100, Math.max(0, score));

  if (score >= 80) feedback.unshift('Strong password');
  else if (score >= 60) feedback.unshift('Moderate password');
  else feedback.unshift('Weak password');

  return { score, feedback };
}

function updateStrength() {
  const password = passwordInput.value;
  const result = evaluatePassword(password);
  strengthMeter.value = result.score;

  if (result.score >= 80) {
    strengthText.textContent = 'Strong (' + result.score + '%)';
    strengthMeter.className = 'strength-strong';
  } else if (result.score >= 60) {
    strengthText.textContent = 'Moderate (' + result.score + '%)';
    strengthMeter.className = 'strength-moderate';
  } else {
    strengthText.textContent = 'Weak (' + result.score + '%)';
    strengthMeter.className = 'strength-weak';
  }

  strengthFeedback.innerHTML = '';
  result.feedback.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    strengthFeedback.appendChild(li);
  });
}

if (passwordInput && strengthMeter && strengthText && strengthFeedback) {
  passwordInput.addEventListener('input', updateStrength);
}

if (checkerLink && checkerSection) {
  checkerLink.addEventListener('click', function(event) {
    event.preventDefault();
    checkerSection.classList.toggle('hidden');
    if (!checkerSection.classList.contains('hidden')) {
      checkerSection.scrollIntoView({ behavior: 'smooth' });
      passwordInput.focus();
    }
  });
}

loadEmail(currentIndex);
