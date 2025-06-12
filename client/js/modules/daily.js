// Daily tab functionality
export const DailyModule = {
    weeklyData: Array(5).fill().map(() => []),
    dailyTargets: {},

    // Initialize daily module
    init() {
        this.loadTarget();
        this.loadDailyTargets();
        this.setupEventListeners();
    },

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('targetInput').addEventListener('change', (e) => this.updateTarget(e.target.value));
    },

    // Load target value
    async loadTarget() {
        try {
            const response = await fetch('/api/target');
            if (!response.ok) throw new Error('Failed to load target');
            const data = await response.json();
            document.getElementById('targetInput').value = parseFloat(data.target || 0).toFixed(2);
            this.updateDailyTarget(data.target);
        } catch (error) {
            console.error('Error loading target:', error);
        }
    },

    // Update target value
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

    // Load daily targets
    async loadDailyTargets() {
        try {
            const response = await fetch('/api/dailytargets');
            if (!response.ok) throw new Error('Failed to load daily targets');
            this.dailyTargets = await response.json();
            this.updateWeeklySummary();
            this.renderDailyTargets();
        } catch (error) {
            console.error('Error loading daily targets:', error);
        }
    },

    // Update daily target display
    updateDailyTarget(monthlyTarget) {
        const dailyTarget = (parseFloat(monthlyTarget) || 0) / 25;
        let totalDailyTargets = 0;
        
        for (let week = 1; week <= 5; week++) {
            ['minggu', 'senin', 'selasa', 'rabu', 'kamis', "jum'at", 'sabtu'].forEach(day => {
                totalDailyTargets += parseFloat(this.getDayTarget(day, week)) || 0;
            });
        }

        const dailyAchievement = totalDailyTargets * 0.8;

        document.getElementById('dailyTarget').textContent = dailyTarget.toFixed(2);
        document.getElementById('dailyAchievement').textContent = dailyAchievement.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    // Get day target for specific week
    getDayTarget(day, weekNum) {
        return ((this.dailyTargets[day] && this.dailyTargets[day][`week${weekNum}`]) || 0).toFixed(2);
    },

    // Update individual day target
    async updateDayTarget(day, weekNum, value) {
        try {
            const target = parseFloat(value) || 0;
            const response = await fetch(`/api/dailytargets/${day}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target, week: `week${weekNum}` }),
            });
            
            if (!response.ok) throw new Error('Failed to update daily target');
            const result = await response.json();
            this.dailyTargets = result.targets;
            
            const element = document.getElementById(`${day}_week${weekNum}`);
            if (element) {
                element.value = this.getDayTarget(day, weekNum);
            }
            this.updateDailyTarget(document.getElementById('targetInput').value);
            this.updateWeeklySummary();
        } catch (error) {
            console.error('Error updating daily target:', error);
        }
    },

    // Render weekly summary cards
    renderWeeklySummary() {
        const container = document.getElementById('weeklySummaryCards');
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
    },

    // Update weekly summary
    updateWeeklySummary() {
        this.renderWeeklySummary();
    },

    // Render daily targets
    renderDailyTargets() {
        // Implementation for rendering daily targets table
        // This would be similar to your existing implementation
    }
};
