// Timeline Project Module
const TimelineProjectModule = {
    init() {
		console.log("TimelineProjectModule initialized");
        document.addEventListener('DOMContentLoaded', () => {
            window.state = window.state || {};
            this.loadTimelineProjectData();
            this.setupEventListeners();
        });
    },

    setupEventListeners() {
        console.log("setupEventListeners called");
        const addButton = document.getElementById('addTimelineProjectRowBtn');
		console.log("addButton", addButton);
		if (addButton) {
			console.log("Event listener added to addButton");
            addButton.addEventListener('click', () => {
                console.log("Add button clicked");
                TimelineProjectModule.addTimelineProjectRow();
            });
        }
    },

    async addTimelineProjectRow() {
		console.log("addTimelineProjectRow called");
        try {
			console.log("Adding new row");
            const newRow = {
                date: '',
                client: '',
                category: '',
                paket: '',
                stage1: '',
                harga1: '',
                status1: 'pending',
                stage2: '',
                harga2: '',
                status2: 'pending',
                stage3: '',
                harga3: '',
                status3: 'pending',
                animalRigging: '',
                hargaAnimalRigging: '',
                statusAnimalRigging: 'pending',
                note: '',
                statusNote: 'pending',
                backupData: 'Belum'
            };
            
            console.log("New row:", newRow);
            window.state.timelineProjectData.push(newRow);
			console.log("Timeline Project Data:", window.state.timelineProjectData);
            await this.saveTimelineProjectData();
            this.renderTimelineProjectTable();
        } catch (error) {
            console.error('Error adding new row:', error);
        }
    },

    async loadTimelineProjectData() {
        try {
            const response = await fetch('/api/tabledata?table=timelineProject');
            if (!response.ok) throw new Error('Failed to load timeline project data');
            const data = await response.json();
			console.log("Timeline Project Data loaded:", data);
            window.state.timelineProjectData = data || [];
            this.renderTimelineProjectTable();
        } catch (error) {
            console.error('Error loading timeline project data:', error);
        }
    },

    async updateEntry(index, field, value) {
        try {
            window.state.timelineProjectData[index][field] = value;
            await this.saveTimelineProjectData('timelineProject');
            this.renderTimelineProjectTable();
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    },

    async deleteRow(index) {
        if (confirm('Are you sure you want to delete this row?')) {
            try {
                window.state.timelineProjectData.splice(index, 1);
                await this.saveTimelineProjectData('timelineProject');
                this.renderTimelineProjectTable();
            } catch (error) {
                console.error('Error deleting row:', error);
            }
        }
    },

    async saveTimelineProjectData(table) {
        try {
            const saveResponse = await fetch(`/api/tabledata?table=${table}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(window.state.timelineProjectData),
            });
            if (!saveResponse.ok) throw new Error('Failed to save timeline project data');
        } catch (error) {
            console.error('Error saving timeline project data:', error);
            throw error;
        }
    },

    renderTimelineProjectTable() {
		console.log("renderTimelineProjectTable called");
        const tbody = document.getElementById('timelineProjectTableBody');
        if (!tbody) {
			console.log("tbody is null");
			return;
		}

		tbody.innerHTML = '';

		console.log("window.state.timelineProjectData", window.state.timelineProjectData);

        if (!window.state.timelineProjectData) {
			window.state.timelineProjectData = [];
		}

        window.state.timelineProjectData.forEach((entry, index) => {
            const tr = document.createElement('tr');
            tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            tr.innerHTML = `
                <td class="py-1 px-2 border border-gray-300">
                    <input type="date" value="${entry.date || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'date', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.client || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'client', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'category', this.value)" class="w-full bg-white">
                        <option value="">Select</option>
                        <option value="Vtuber Design & Rigging" ${entry.category === 'Vtuber Design & Rigging' ? 'selected' : ''}>Vtuber Design & Rigging</option>
                        <option value="Other" ${entry.category === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'paket', this.value)" class="w-full bg-white">
                        <option value="">Select</option>
                        <option value="Full Body" ${entry.paket === 'Full Body' ? 'selected' : ''}>Full Body</option>
                        <option value="Half Body" ${entry.paket === 'Half Body' ? 'selected' : ''}>Half Body</option>
                        <option value="Bust Up" ${entry.paket === 'Bust Up' ? 'selected' : ''}>Bust Up</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.stage1 || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'stage1', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.harga1 || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'harga1', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'status1', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.status1 === 'done' ? 'selected' : ''}>Done</option>
                        <option value="pending" ${entry.status1 === 'pending' ? 'selected' : ''}>Pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.stage2 || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'stage2', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.harga2 || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'harga2', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'status2', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.status2 === 'done' ? 'selected' : ''}>Done</option>
                        <option value="pending" ${entry.status2 === 'pending' ? 'selected' : ''}>Pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.stage3 || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'stage3', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.harga3 || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'harga3', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'status3', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.status3 === 'done' ? 'selected' : ''}>Done</option>
                        <option value="pending" ${entry.status3 === 'pending' ? 'selected' : ''}>Pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.animalRigging || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'animalRigging', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.hargaAnimalRigging || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'hargaAnimalRigging', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'statusAnimalRigging', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.statusAnimalRigging === 'done' ? 'selected' : ''}>Done</option>
                        <option value="pending" ${entry.statusAnimalRigging === 'pending' ? 'selected' : ''}>Pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.note || ''}" onchange="TimelineProjectModule.updateEntry(${index}, 'note', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'statusNote', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.statusNote === 'done' ? 'selected' : ''}>Done</option>
                        <option value="pending" ${entry.statusNote === 'pending' ? 'selected' : ''}>Pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="TimelineProjectModule.updateEntry(${index}, 'backupData', this.value)" class="w-full bg-white">
                        <option value="Belum" ${entry.backupData === 'Belum' ? 'selected' : ''}>Belum</option>
                        <option value="Sudah DI backup" ${entry.backupData === 'Sudah DI backup' ? 'selected' : ''}>Sudah DI backup</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300 text-center">
                    <button onclick="TimelineProjectModule.deleteRow(${index})" class="text-red-600 hover:text-red-800" title="Delete Row">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
			console.log("Row rendered:", tr);
            tbody.appendChild(tr);
        });

        this.setupEventListeners();
    }
};

export default TimelineProjectModule;
