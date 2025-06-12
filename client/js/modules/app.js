// Import modules
import { DailyModule } from './daily.js';
import { TimelineProjectModule } from './timelineProject.js';

// Main app functionality
export const App = {
    // Initialize the application
    init() {
        this.setupEventListeners();
        this.initializeModules();
        this.switchTab('daily'); // Start with daily tab
    },

    // Setup event listeners
    setupEventListeners() {
        // Add click event listeners to all tab buttons
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            });
        });
    },

    // Initialize all modules
    initializeModules() {
        DailyModule.init();
        TimelineProjectModule.init();
    },

    // Switch between tabs
    switchTab(tabName) {
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
        }

        // Update content based on selected tab
        switch(tabName) {
            case 'daily':
                DailyModule.updateWeeklySummary();
                break;
            case 'timelineProject':
                TimelineProjectModule.renderTimelineProjectTable();
                break;
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
