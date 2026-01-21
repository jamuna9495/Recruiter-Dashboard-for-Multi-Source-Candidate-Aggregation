let unifiedData = [];

// Core Merge Logic
function performSync() {
    const emailMap = new Map();
    
    // Process ATS
    internalATS.forEach(c => emailMap.set(c.email, { ...c, sources: ['ATS'] }));
    
    // Merge LinkedIn
    linkedInDB.forEach(c => {
        if(emailMap.has(c.email)) {
            let existing = emailMap.get(c.email);
            if (!existing.sources.includes('LI')) existing.sources.push('LI');
            
            // Conflict Detection
            if(existing.location !== c.location) {
                existing.hasConflict = true;
                existing.conflictDetails = `ATS: ${existing.location} | LI: ${c.location}`;
            }
        } else {
            emailMap.set(c.email, { ...c, sources: ['LI'] });
        }
    });

    unifiedData = Array.from(emailMap.values());
    renderDashboard(unifiedData);
    updateCharts();
}

function renderDashboard(data) {
    const grid = document.getElementById('candidateGrid');
    grid.innerHTML = '';
    
    document.getElementById('totalProfiles').innerText = data.length;
    const conflicts = data.filter(c => c.hasConflict).length;
    document.getElementById('conflictMetric').innerText = conflicts;
    document.getElementById('conflictCount').innerText = conflicts;

    data.forEach(p => {
        const card = document.createElement('div');
        card.className = `candidate-card ${p.hasConflict ? 'conflict-border' : ''}`;
        card.innerHTML = `
            <div class="card-top">
                <h3>${p.name}</h3>
                ${p.hasConflict ? '<span class="alert-tag">Conflict</span>' : ''}
            </div>
            <p class="email-text">${p.email}</p>
            <div class="info-row">
                <span><i class="fas fa-briefcase"></i> ${p.role}</span>
                <span><i class="fas fa-clock"></i> ${p.exp}</span>
            </div>
            <div class="location-box">
                <i class="fas fa-map-marker-alt"></i> ${p.location}
                ${p.hasConflict ? `<p class="conflict-txt">${p.conflictDetails}</p>` : ''}
            </div>
            <div class="tags">
                ${p.sources.map(s => `<span class="tag">${s}</span>`).join('')}
            </div>
            <button class="view-btn">Review Profile</button>
        `;
        grid.appendChild(card);
    });
}

// Search Functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = unifiedData.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term) ||
        c.role.toLowerCase().includes(term)
    );
    renderDashboard(filtered);
});

// Analytics Chart
function updateCharts() {
    const ctx = document.getElementById('sourceChart').getContext('2d');
    
    // Destroy existing chart to prevent overlap on re-sync
    if(window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Internal ATS', 'LinkedIn', 'Unified Total'],
            datasets: [{
                data: [internalATS.length, linkedInDB.length, unifiedData.length],
                backgroundColor: ['#4f46e5', '#0ea5e9', '#10b981']
            }]
        },
        options: { plugins: { title: { display: true, text: 'Candidate Source Distribution' } } }
    });
}

// Event Listener
document.getElementById('syncTrigger').onclick = performSync;
