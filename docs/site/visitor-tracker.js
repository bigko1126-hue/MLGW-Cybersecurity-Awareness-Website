(function () {
  const storageKey = 'mlgw-visitor-log';
  const deviceKey = 'mlgw-device-id';
  const channelName = 'mlgw-visitor-channel';
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(channelName) : null;

  function getDeviceId() {
    let deviceId = localStorage.getItem(deviceKey);
    if (!deviceId) {
      deviceId = 'device-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(deviceKey, deviceId);
    }
    return deviceId;
  }

  function getDeviceLabel() {
    const userAgent = navigator.userAgent || 'Unknown browser';
    if (/android/i.test(userAgent)) return 'Android device';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iPhone/iPad';
    if (/windows/i.test(userAgent)) return 'Windows device';
    if (/macintosh|mac os/i.test(userAgent)) return 'Mac device';
    if (/linux/i.test(userAgent)) return 'Linux device';
    return 'Other device';
  }

  function getStoredVisits() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      return [];
    }
  }

  function saveVisits(visits) {
    localStorage.setItem(storageKey, JSON.stringify(visits.slice(0, 25)));
  }

  function recordVisit() {
    const visit = {
      id: getDeviceId(),
      device: getDeviceLabel(),
      page: window.location.pathname.replace(/\/+$/, '') || '/',
      pageTitle: document.title || 'MLGW site',
      timestamp: new Date().toISOString()
    };

    const visits = getStoredVisits();
    const updatedVisits = [visit].concat(visits.filter((item) => item.timestamp !== visit.timestamp || item.page !== visit.page)).slice(0, 25);
    saveVisits(updatedVisits);

    if (channel) {
      channel.postMessage({ type: 'visit', visit });
    }

    window.dispatchEvent(new Event('mlgw-visit-updated'));
  }

  function renderDashboard() {
    const countEl = document.getElementById('visitorsCount');
    const summaryEl = document.getElementById('visitorSummary');
    const listEl = document.getElementById('visitorList');

    if (!countEl || !summaryEl || !listEl) return;

    const visits = getStoredVisits();
    countEl.textContent = `${visits.length} visit${visits.length === 1 ? '' : 's'}`;
    summaryEl.textContent = `Live activity for this browser/device (${getDeviceLabel()}).`;

    if (visits.length === 0) {
      listEl.innerHTML = '<li class="module-list-item">No visits recorded yet.</li>';
      return;
    }

    listEl.innerHTML = visits
      .map((visit) => {
        const date = new Date(visit.timestamp).toLocaleString();
        return `<li class="module-list-item"><strong>${visit.pageTitle}</strong><span>${date}</span><small>${visit.page}</small></li>`;
      })
      .join('');
  }

  window.addEventListener('DOMContentLoaded', () => {
    recordVisit();
    renderDashboard();
  });

  window.addEventListener('mlgw-visit-updated', renderDashboard);

  if (channel) {
    channel.onmessage = () => renderDashboard();
  }
})();
