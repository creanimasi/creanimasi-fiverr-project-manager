const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));
console.log('Serving static files from:', path.join(__dirname, '../client'));

// Data file paths
const DATA_FILE = path.join(__dirname, 'data.json');
const STATUS_COLORS_FILE = path.join(__dirname, 'statusColors.json');
const TARGET_FILE = path.join(__dirname, 'target.json');
const DAILY_TARGETS_FILE = path.join(__dirname, 'dailyTargets.json');

// Helper function to read data
async function readData(table = null) {
    let filePath = DATA_FILE;
    if (table === 'timelineProject') {
        filePath = path.join(__dirname, 'timelineProjectData.json');
    }
    try {
        const data = await fs.readFile(filePath, 'utf-8');
	    console.log("Data read from " + filePath + ": " + data);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        // If file doesn't exist, return default data structure
        if (table === 'timelineProject') {
            return [];
        }
        return Array(5).fill().map(() => []);
    }
}

// Helper function to write data
async function writeData(data, table = null) {
    let filePath = DATA_FILE;
    if (table === 'timelineProject') {
        filePath = path.join(__dirname, 'timelineProjectData.json');
    }
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing data:", error);
        throw error;
    }
}

// Helper function to read status colors
async function readStatusColors() {
    try {
        const data = await fs.readFile(STATUS_COLORS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading status colors:', error);
        // Return default colors if file doesn't exist
        return {
            "Discussing": "#3b82f6",
            "Negotiating": "#22d3ee",
            "Offer sent": "#eade4e",
            "Place Order": "#4ade80",
            "not expected": "#d1d5db",
            "Tebar Jala": "#6b21a8",
            "Ikan Lepas": "#dc2626",
            "tip": "#fbbf24"
        };
    }
}

// Helper function to write status colors
async function writeStatusColors(colors) {
    try {
        await fs.writeFile(STATUS_COLORS_FILE, JSON.stringify(colors, null, 2));
    } catch (error) {
        console.error("Error writing status colors:", error);
        throw error;
    }
}

// Helper function to read daily targets
async function readDailyTargets() {
    try {
        const data = await fs.readFile(DAILY_TARGETS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading daily targets:', error);
        // Return default daily targets if file doesn't exist
        const defaultValue = 20;
        return {
            minggu: { week1: defaultValue, week2: defaultValue, week3: defaultValue, week4: defaultValue, week5: defaultValue },
            senin: { week1: defaultValue, week2: defaultValue, week3: defaultValue, week4: defaultValue, week5: defaultValue },
            selasa: { week1: defaultValue, week2: defaultValue, week3: defaultValue, week4: defaultValue, week5: defaultValue },
            rabu: { week1: defaultValue, week2: defaultValue, week3: defaultValue, week4: defaultValue, week5: defaultValue },
            kamis: { week1: defaultValue, week2: defaultValue, week3: defaultValue, week4: defaultValue, week5: defaultValue },
            "jum'at": { week1: defaultValue, week2: defaultValue, week3: defaultValue, week4: defaultValue, week5: defaultValue },
            sabtu: { week1: defaultValue, week2: defaultValue, week3: defaultValue, week4: defaultValue, week5: defaultValue }
        };
    }
}

// Helper function to write daily targets
async function writeDailyTargets(targets) {
    try {
        await fs.writeFile(DAILY_TARGETS_FILE, JSON.stringify(targets, null, 2));
    } catch (error) {
        console.error("Error writing daily targets:", error);
        throw error;
    }
}

// Helper function to read target value
async function readTarget() {
    try {
        const data = await fs.readFile(TARGET_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading target:', error);
        // Return default target if file doesn't exist
        return { target: 1000 };
    }
}

// Helper function to write target value
async function writeTarget(target) {
    try {
        await fs.writeFile(TARGET_FILE, JSON.stringify(target, null, 2));
    } catch (error) {
        console.error("Error writing target:", error);
        throw error;
    }
}

// GET: Retrieve daily targets
app.get('/api/dailytargets', async (req, res) => {
    try {
        console.log('GET /api/dailytargets - Retrieving daily targets');
        const targets = await readDailyTargets();
        res.json(targets);
    } catch (error) {
        console.error('GET /api/dailytargets - Error:', error);
        res.status(500).json({ message: "Failed to load daily targets" });
    }
});

// PUT: Update daily target
app.put('/api/dailytargets/:day', async (req, res) => {
    try {
        console.log('PUT /api/dailytargets - Updating daily target:', req.params.day, req.body);
        const { day } = req.params;
        const { target, week } = req.body;
        
        if (target === undefined || !week) {
            return res.status(400).json({ message: "Invalid target value or week" });
        }

        const targets = await readDailyTargets();
        if (!targets[day.toLowerCase()]) {
            targets[day.toLowerCase()] = {};
        }
        targets[day.toLowerCase()][week] = parseFloat(target);
        await writeDailyTargets(targets);
        res.json({ message: "Daily target updated", targets });
    } catch (error) {
        console.error('PUT /api/dailytargets - Error:', error);
        res.status(500).json({ message: "Failed to update daily target" });
    }
});

// GET: Retrieve target value
app.get('/api/target', async (req, res) => {
    try {
        console.log('GET /api/target - Retrieving target');
        const target = await readTarget();
        res.json(target);
    } catch (error) {
        console.error('GET /api/target - Error:', error);
        res.status(500).json({ message: "Failed to load target" });
    }
});

// PUT: Update target value
app.put('/api/target', async (req, res) => {
    try {
        console.log('PUT /api/target - Updating target:', req.body);
        const { target } = req.body;
        if (target === undefined) {
            return res.status(400).json({ message: "Invalid target value" });
        }
        await writeTarget({ target });
        res.json({ message: "Target updated", target });
    } catch (error) {
        console.error('PUT /api/target - Error:', error);
        res.status(500).json({ message: "Failed to update target" });
    }
});

// GET: Retrieve all table data
app.get('/api/tabledata', async (req, res) => {
    try {
        const { table } = req.query;
        console.log('GET /api/tabledata - Retrieving data for table:', table);
        const data = await readData(table);
        res.json(data);
    } catch (error) {
        console.error('GET /api/tabledata - Error:', error);
        res.status(500).json({ message: "Failed to load data" });
    }
});

// GET: Retrieve status colors
app.get('/api/statuscolors', async (req, res) => {
    try {
        console.log('GET /api/statuscolors - Retrieving status colors');
        const colors = await readStatusColors();
        res.json(colors);
    } catch (error) {
        console.error('GET /api/statuscolors - Error:', error);
        res.status(500).json({ message: "Failed to load status colors" });
    }
});

// PUT: Update status colors
app.put('/api/statuscolors', async (req, res) => {
    try {
        console.log('PUT /api/statuscolors - Updating status colors:', req.body);
        const colors = req.body;
        if (!colors || typeof colors !== 'object') {
            return res.status(400).json({ message: "Invalid status colors data" });
        }
        await writeStatusColors(colors);
        res.json({ message: "Status colors updated", colors });
    } catch (error) {
        console.error('PUT /api/statuscolors - Error:', error);
        res.status(500).json({ message: "Failed to update status colors" });
    }
});

// POST: Add a new row
app.post('/api/tabledata', async (req, res) => {
    try {
        console.log('POST /api/tabledata - Adding new row:', req.body);
        const { week, entry } = req.body;
        if (week === undefined || !entry) {
            console.error('POST /api/tabledata - Invalid request data');
            return res.status(400).json({ message: "Invalid request data" });
        }
        const data = await readData();
        data[week] = data[week] || [];
        data[week].push(entry);
        await writeData(data);
        res.json({ message: "Row added", data });
    } catch (error) {
        console.error('POST /api/tabledata - Error:', error);
        res.status(500).json({ message: "Failed to add row" });
    }
});

// PUT: Update a row
app.put('/api/tabledata', async (req, res) => {
    try {
        const { table } = req.query;
        console.log(`PUT /api/tabledata - Updating data for table: ${table}`, req.body);

        const data = req.body;
        await writeData(data, table);
        res.json({ message: "Data updated", data });
    } catch (error) {
        console.error('PUT /api/tabledata - Error:', error);
        res.status(500).json({ message: "Failed to update data" });
    }
});

// DELETE: Delete a row
app.delete('/api/tabledata', async (req, res) => {
    try {
        console.log('DELETE /api/tabledata - Deleting row:', req.query);
        const week = Number(req.query.week);
        const row = Number(req.query.row);
        if (isNaN(week) || isNaN(row)) {
            console.error('DELETE /api/tabledata - Invalid week or row index');
            return res.status(400).json({ message: "Invalid week or row index" });
        }
        const data = await readData();
        if (!data[week] || !data[week][row]) {
            console.error('DELETE /api/tabledata - Row not found');
            return res.status(404).json({ message: "Row not found" });
        }
        data[week].splice(row, 1);
        await writeData(data);
        res.json({ message: "Row deleted", data });
    } catch (error) {
        console.error('DELETE /api/tabledata - Error:', error);
        res.status(500).json({ message: "Failed to delete row" });
    }
});

// Serve timeline-project.html
app.get('/timeline-project', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/timeline-project.html'));
});

// Catch-all route to serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Create empty data.json if it doesn't exist
fs.access(DATA_FILE)
    .catch(() => {
        console.log('Creating initial data.json file');
        return writeData(Array(5).fill().map(() => []));
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
            console.log('API endpoints available at:');
            console.log('  GET    /api/tabledata');
            console.log('  POST   /api/tabledata');
            console.log('  PUT    /api/tabledata');
            console.log('  DELETE /api/tabledata');
        });
    })
    .catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
