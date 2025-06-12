// Daily Module moved from main.js for modular structure

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

export default DailyModule;
