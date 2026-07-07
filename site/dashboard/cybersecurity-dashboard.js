const tips = [
  {
    title: 'Use a password manager',
    description: 'Store unique passwords securely and avoid reusing credentials across accounts.',
    category: 'passwords',
    priority: 'High',
  },
  {
    title: 'Enable multi-factor authentication',
    description: 'Add a second authentication factor to protect accounts even if passwords are compromised.',
    category: 'passwords',
    priority: 'High',
  },
  {
    title: 'Verify phishing emails',
    description: 'Check sender addresses, links, and requests for sensitive data before responding or clicking.',
    category: 'phishing',
    priority: 'High',
  },
  {
    title: 'Keep software up to date',
    description: 'Install security updates promptly on devices, apps, and operating systems.',
    category: 'practice',
    priority: 'Medium',
  },
  {
    title: 'Use a VPN on public Wi-Fi',
    description: 'Encrypt your internet traffic when connecting from coffee shops, airports, or other public networks.',
    category: 'network',
    priority: 'Medium',
  },
  {
    title: 'Lock devices when idle',
    description: 'Prevent unauthorized access by using screen locks and secure sleep settings.',
    category: 'devices',
    priority: 'Medium',
  },
  {
    title: 'Check app permissions',
    description: 'Review which apps have access to camera, microphone, location and other sensitive data.',
    category: 'devices',
    priority: 'Low',
  },
  {
    title: 'Back up your important files',
    description: 'Keep regular backups in a secure location to recover data after ransomware or failures.',
    category: 'practice',
    priority: 'High',
  },
  {
    title: 'Separate work and personal accounts',
    description: 'Use dedicated accounts for business access and personal browsing to reduce cross-contamination risk.',
    category: 'practice',
    priority: 'Low',
  },
  {
    title: 'Use strong network passwords',
    description: 'Set a unique, complex password for routers and IoT devices to prevent network intrusion.',
    category: 'network',
    priority: 'High',
  },
];

const tipsGrid = document.getElementById('tipsGrid');
const tipCount = document.getElementById('tipCount');
const categoryCount = document.getElementById('categoryCount');
const searchInput = document.getElementById('searchInput');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const themeToggle = document.getElementById('themeToggle');

const categories = [...new Set(tips.map((tip) => tip.category))];
categoryCount.textContent = categories.length;
tipCount.textContent = tips.length;

function createTipCard(tip) {
  const card = document.createElement('article');
  card.className = 'tip-card';
  card.dataset.category = tip.category;
  card.innerHTML = `
    <h2>${tip.title}</h2>
    <p>${tip.description}</p>
    <div class="tip-meta">
      <span class="tip-tag">${tip.category.replace(/\b\w/g, (match) => match.toUpperCase())}</span>
      <span class="tip-priority">${tip.priority}</span>
    </div>
  `;
  return card;
}

function renderTips(filter = 'all', query = '') {
  tipsGrid.innerHTML = '';
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = tips.filter((tip) => {
    const matchesFilter = filter === 'all' || tip.category === filter;
    const matchesSearch = normalizedQuery === '' || `${tip.title} ${tip.description}`.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    tipsGrid.innerHTML = '<div class="tip-card"><h2>No results found</h2><p>Try a different search term or category filter.</p></div>';
    return;
  }

  filtered.forEach((tip) => tipsGrid.appendChild(createTipCard(tip)));
}

function setActiveFilter(button) {
  filterButtons.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveFilter(button);
    renderTips(button.dataset.category, searchInput.value);
  });
});

searchInput.addEventListener('input', () => {
  const activeButton = document.querySelector('.filter-btn.active');
  renderTips(activeButton.dataset.category, searchInput.value);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
});

renderTips();
