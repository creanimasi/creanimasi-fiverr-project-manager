// Main application state
const state = {
    weeklyData: Array(5).fill().map(() => []),
    dailyTargets: {},
    timelineProjectData: [],
    statusColors: {}
};

// Daily Module
const DailyModule = {
    init() {
        this.loadTarget();
        this.loadDailyTargets();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('targetInput')?.addEventListener('change', (e) => this.updateTarget(e.target.value));
    },

    async loadTarget() {
        try {
            const response = await fetch('/api/target');
            if (!response.ok) throw new Error('Failed to load target');
            const data = await response.json();
            if (document.getElementById('targetInput')) {
                document.getElementById('targetInput').value = parseFloat(data.target || 0).toFixed(2);
                this.updateDailyTarget(data.target);
            }
        } catch (error) {
            console.error('Error loading target:', error);
        }
    },

    async updateTarget(value) {
        try {
            const target = parseFloat(value) || 0;
            const response = await fetch('/api/target', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target }),
            });
            if (!response.ok) throw new Error('Failed to update target');
            this.updateDailyTarget(target);
        } catch (error) {
            console.error('Error updating target:', error);
        }
    },

    updateDailyTarget(monthlyTarget) {
        const dailyTarget = (parseFloat(monthlyTarget) || 0) / 25;
        let totalDailyTargets = 0;
        
        for (let week = 1; week <= 5; week++) {
            ['minggu', 'senin', 'selasa', 'rabu', 'kamis', "jum'at", 'sabtu'].forEach(day => {
                totalDailyTargets += parseFloat(this.getDayTarget(day, week)) || 0;
            });
        }

        const dailyAchievement = totalDailyTargets * 0.8;

        if (document.getElementById('dailyTarget')) {
            document.getElementById('dailyTarget').textContent = dailyTarget.toFixed(2);
        }
        if (document.getElementById('dailyAchievement')) {
            document.getElementById('dailyAchievement').textContent = dailyAchievement.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    },

    getDayTarget(day, weekNum) {
        return ((state.dailyTargets[day] && state.dailyTargets[day][`week${weekNum}`]) || 0).toFixed(2);
    },

    async loadDailyTargets() {
        try {
            const response = await fetch('/api/dailytargets');
            if (!response.ok) throw new Error('Failed to load daily targets');
            state.dailyTargets = await response.json();
            this.updateWeeklySummary();
        } catch (error) {
            console.error('Error loading daily targets:', error);
        }
    },

    updateWeeklySummary() {
        const container = document.getElementById('weeklySummaryCards');
        if (!container) return;

        container.innerHTML = '';
        const colors = ['bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100'];
        const textColors = ['text-red-800', 'text-green-800', 'text-blue-800', 'text-yellow-800', 'text-purple-800'];
        
        for (let weekNum = 1; weekNum <= 5; weekNum++) {
            let weeklySum = 0;
            ['minggu', 'senin', 'selasa', 'rabu', 'kamis', "jum'at", 'sabtu'].forEach(day => {
                weeklySum += parseFloat(this.getDayTarget(day, weekNum)) || 0;
            });
            
            const card = document.createElement('div');
            card.className = `${colors[weekNum - 1]} p-4 rounded shadow-md`;
            card.innerHTML = `
                <h2 class="text-lg font-bold mb-2 ${textColors[weekNum - 1]}">Minggu ${weekNum}</h2>
                <p class="text-2xl font-semibold ${textColors[weekNum - 1]}">$${weeklySum.toFixed(2)}</p>
            `;
            container.appendChild(card);
        }
    }
};

// Timeline Project Module
const TimelineProjectModule = {
    init() {
        this.loadTimelineProjectData();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('addTimelineProjectRowBtn')?.addEventListener('click', () => this.addTimelineProjectRow());
    },

    async loadTimelineProjectData() {
        try {
            const response = await fetch('/api/tabledata');
            if (!response.ok) throw new Error('Failed to load timeline project data');
            const data = await response.json();
            state.timelineProjectData = data[1] || [];
            this.renderTimelineProjectTable();
        } catch (error) {
            console.error('Error loading timeline project data:', error);
        }
    },

    renderTimelineProjectTable() {
        const tbody = document.getElementById('timelineProjectTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        state.timelineProjectData.forEach((entry, index) => {
            const tr = document.createElement('tr');
            tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            // ... (rest of the table row rendering code)
            tbody.appendChild(tr);
        });
    }
};

// Tab switching functionality
function switchTab(tabName) {
    // Hide all content sections
    const contents = {
        daily: document.getElementById('dailyContent'),
        timelineProject: document.getElementById('timelineProjectContent')
    };
    Object.values(contents).forEach(content => {
        if (content) content.classList.add('hidden');
    });

    // Remove active class from all tabs
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('bg-blue-500', 'text-white', 'rounded-l');
        tab.classList.add('bg-gray-300', 'text-gray-700');
    });

    // Show selected content and activate tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = contents[tabName];

    if (selectedTab && selectedContent) {
        selectedContent.classList.remove('hidden');
        selectedTab.classList.remove('bg-gray-300', 'text-gray-700');
        selectedTab.classList.add('bg-blue-500', 'text-white', 'rounded-l');

        // Update content based on selected tab
        if (tabName === 'daily') {
            DailyModule.updateWeeklySummary();
        } else if (tabName === 'timelineProject') {
            TimelineProjectModule.renderTimelineProjectTable();
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Setup tab switching
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(e.target.dataset.tab);
        });
    });

    // Initialize modules
    DailyModule.init();
    TimelineProjectModule.init();

    // Start with daily tab
    switchTab('daily');
});
