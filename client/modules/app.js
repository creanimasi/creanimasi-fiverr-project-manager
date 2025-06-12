// Main application state
window.state = {
    weeklyData: Array(5).fill().map(() => []),
    dailyTargets: {},
    timelineProjectData: [],
    statusColors: {}
};

// Import modules
import DailyModule from './daily/daily.js';
import TimelineProjectModule from './timeline-project/timeline-project.js';

// Make modules globally accessible
window.DailyModule = DailyModule;
window.TimelineProjectModule = TimelineProjectModule;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    DailyModule.init();
    TimelineProjectModule.init();

    // Load initial data
    DailyModule.loadTarget();
    DailyModule.loadDailyTargets().then(() => {
        DailyModule.updateWeeklySummary();
    });
});

export { DailyModule, TimelineProjectModule };
