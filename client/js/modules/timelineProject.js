// Timeline Project tab functionality
export const TimelineProjectModule = {
    timelineProjectData: [],

    // Initialize timeline project module
    init() {
        this.loadTimelineProjectData();
        this.setupEventListeners();
    },

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('addTimelineProjectRowBtn').addEventListener('click', () => this.addTimelineProjectRow());
    },

    // Render timeline project table
    renderTimelineProjectTable() {
        const tbody = document.getElementById('timelineProjectTableBody');
        tbody.innerHTML = '';
        
        this.timelineProjectData.forEach((entry, index) => {
            const tr = document.createElement('tr');
            tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            tr.innerHTML = `
                <td class="py-1 px-2 border border-gray-300">
                    <input type="date" value="${entry.date || ''}" onchange="timelineProject.updateEntry(${index}, 'date', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.client || ''}" onchange="timelineProject.updateEntry(${index}, 'client', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'category', this.value)" class="w-full bg-white">
                        <option value="">Select</option>
                        <option value="Vtuber Design & Rigging" ${entry.category === 'Vtuber Design & Rigging' ? 'selected' : ''}>Vtuber Design & Rigging</option>
                        <option value="Other" ${entry.category === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'paket', this.value)" class="w-full bg-white">
                        <option value="">Select</option>
                        <option value="Full Body" ${entry.paket === 'Full Body' ? 'selected' : ''}>Full Body</option>
                        <option value="Half Body" ${entry.paket === 'Half Body' ? 'selected' : ''}>Half Body</option>
                        <option value="Bust Up" ${entry.paket === 'Bust Up' ? 'selected' : ''}>Bust Up</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.stage1 || ''}" onchange="timelineProject.updateEntry(${index}, 'stage1', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.harga1 || ''}" onchange="timelineProject.updateEntry(${index}, 'harga1', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'status1', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.status1 === 'done' ? 'selected' : ''}>done</option>
                        <option value="pending" ${entry.status1 === 'pending' ? 'selected' : ''}>pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.stage2 || ''}" onchange="timelineProject.updateEntry(${index}, 'stage2', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.harga2 || ''}" onchange="timelineProject.updateEntry(${index}, 'harga2', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'status2', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.status2 === 'done' ? 'selected' : ''}>done</option>
                        <option value="pending" ${entry.status2 === 'pending' ? 'selected' : ''}>pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.stage3 || ''}" onchange="timelineProject.updateEntry(${index}, 'stage3', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.harga3 || ''}" onchange="timelineProject.updateEntry(${index}, 'harga3', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'status3', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.status3 === 'done' ? 'selected' : ''}>done</option>
                        <option value="pending" ${entry.status3 === 'pending' ? 'selected' : ''}>pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.animalRigging || ''}" onchange="timelineProject.updateEntry(${index}, 'animalRigging', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.hargaAnimalRigging || ''}" onchange="timelineProject.updateEntry(${index}, 'hargaAnimalRigging', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'statusAnimalRigging', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.statusAnimalRigging === 'done' ? 'selected' : ''}>done</option>
                        <option value="pending" ${entry.statusAnimalRigging === 'pending' ? 'selected' : ''}>pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <input type="text" value="${entry.note || ''}" onchange="timelineProject.updateEntry(${index}, 'note', this.value)" class="w-full" />
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'statusNote', this.value)" class="w-full bg-white">
                        <option value="done" ${entry.statusNote === 'done' ? 'selected' : ''}>done</option>
                        <option value="pending" ${entry.statusNote === 'pending' ? 'selected' : ''}>pending</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300">
                    <select onchange="timelineProject.updateEntry(${index}, 'backupData', this.value)" class="w-full bg-white">
                        <option value="Belum" ${entry.backupData === 'Belum' ? 'selected' : ''}>Belum</option>
                        <option value="Sudah DI backup" ${entry.backupData === 'Sudah DI backup' ? 'selected' : ''}>Sudah DI backup</option>
                    </select>
                </td>
                <td class="py-1 px-2 border border-gray-300 text-center">
                    <button class="text-red-600 hover:text-red-800" onclick="timelineProject.deleteRow(${index})" title="Delete Row">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    // Update timeline project entry
    async updateEntry(index, field, value) {
        this.timelineProjectData[index][field] = value;
        await this.saveTimelineProjectData();
        this.renderTimelineProjectTable();
    },

    // Add new timeline project row
    async addTimelineProjectRow() {
        this.timelineProjectData.push({
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
        });
        await this.saveTimelineProjectData();
        this.renderTimelineProjectTable();
    },

    // Delete timeline project row
    async deleteRow(index) {
        if (confirm('Are you sure you want to delete this row?')) {
            this.timelineProjectData.splice(index, 1);
            await this.saveTimelineProjectData();
            this.renderTimelineProjectTable();
        }
    },

    // Save timeline project data
    async saveTimelineProjectData() {
        try {
            const response = await fetch('/api/tabledata', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    week: 1,
                    row: 0,
                    entry: this.timelineProjectData
                }),
            });
            if (!response.ok) throw new Error('Failed to save timeline project data');
        } catch (error) {
            console.error('Error saving timeline project data:', error);
        }
    },

    // Load timeline project data
    async loadTimelineProjectData() {
        try {
            const response = await fetch('/api/tabledata');
            if (!response.ok) throw new Error('Failed to load timeline project data');
            const data = await response.json();
            this.timelineProjectData = data[1] || [];
            this.renderTimelineProjectTable();
        } catch (error) {
            console.error('Error loading timeline project data:', error);
        }
    }
};
