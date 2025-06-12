// Main application state
window.state = {
    weeklyData: Array(5).fill().map(() => []),
    dailyTargets: {},
    timelineProjectData: [],
    statusColors: {}
};

// Import modules
import DailyModule from '../modules/daily/daily.js';
import TimelineProjectModule from '../modules/timeline-project/timeline-project.js';

// Make TimelineProjectModule globally accessible
window.TimelineProjectModule = TimelineProjectModule;

// Tab switching functionality
function switchTab(tabName) {
    // Hide all content sections
    document.querySelectorAll('[data-content]').forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active class from all tabs
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('bg-blue-500', 'text-white');
        tab.classList.add('bg-gray-300', 'text-gray-700');
    });

    // Show selected content and activate tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.querySelector(`[data-content="${tabName}"]`);

    if (selectedTab && selectedContent) {
        selectedContent.classList.remove('hidden');
        selectedTab.classList.remove('bg-gray-300', 'text-gray-700');
        selectedTab.classList.add('bg-blue-500', 'text-white');

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
