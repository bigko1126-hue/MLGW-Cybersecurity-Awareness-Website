// Grab UI Elements
const analyzeBtn = document.getElementById('analyze-btn');
const tipBox = document.getElementById('tip-box');
const tipText = document.getElementById('tip-text');
const phishElements = document.querySelectorAll('.phish-element');

// Step 1: When user clicks "Scan", highlight the vulnerabilities
analyzeBtn.addEventListener('click', () => {
    phishElements.forEach(element => {
        element.classList.add('highlight');
    });
    
    // Reveal the sidebar breakdown instructions
    tipBox.classList.remove('hidden');
    tipText.innerText = "🚨 Phishing vectors found! Click any highlighted red element inside the email layout to read its specific warning.";
});

// Step 2: Make each highlighted item clickable to reveal its lesson
phishElements.forEach(element => {
    element.addEventListener('click', () => {
        // Only trigger if the scanner has been run first
        if (element.classList.contains('highlight')) {
            // Pull the custom text stored in the HTML "data-tip" attribute
            const warningMessage = element.getAttribute('data-tip');
            
            // Update the sidebar text with the specific tip
            tipText.innerText = warningMessage;
        }
    });
});
