class Timetable {
    constructor() {
        this.data = null;
        this.currentProgram = null;
        this.currentYear = null;
        this.currentSemester = null;
        this.init();
    }

    async init() {
        this.bindEvents();
    }

    async loadData(program) {
        try {
            const response = await fetch(`data/${program.toLowerCase()}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            this.data = await response.json();
            console.log(`Loaded data for ${program}:`, this.data);
            this.updateTimetable();
        } catch (error) {
            console.error('Error loading timetable data:', error);
        }
    }

    bindEvents() {
        document.getElementById('programSection').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.currentProgram = e.target.textContent;
                this.loadData(this.currentProgram);
                this.showYears();
            }
        });

        document.getElementById('yearSection').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.currentYear = e.target.textContent;
                this.showSemesters();
            }
        });

        document.getElementById('semesterSection').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.currentSemester = e.target.textContent;
                this.showTimetable();
            }
        });

        document.getElementById('batchButtons').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.highlightBatch(e.target.id.replace('batch', ''));
            }
        });
    }

    showYears() {
        const yearSection = document.getElementById('yearSection');
        yearSection.classList.remove('hidden');
        document.getElementById('semesterSection').classList.add('hidden');
        document.getElementById('timetableSection').classList.add('hidden');
        document.getElementById('batchButtons').classList.add('hidden');

        const yearButtons = document.getElementById('yearButtons');
        yearButtons.innerHTML = '';

        const years = this.getYearsForProgram(this.currentProgram);
        years.forEach(year => {
            const button = document.createElement('button');
            button.textContent = year;
            yearButtons.appendChild(button);
        });
    }

    getYearsForProgram(program) {
        if (program === 'PhD') {
            return ['1st Year', '2nd Year', '3rd Year'];
        } else if (program === 'MTech') {
            return ['1st Year', '2nd Year'];
        } else if (program === 'BTech') {
            return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        }
        return [];
    }

    showSemesters() {
        document.getElementById('semesterSection').classList.remove('hidden');
        document.getElementById('timetableSection').classList.add('hidden');
        document.getElementById('batchButtons').classList.add('hidden');
    }

    showTimetable() {
        document.getElementById('batchButtons').classList.remove('hidden');
        document.getElementById('timetableSection').classList.remove('hidden');

        const timetable = document.getElementById('timetable');
        timetable.innerHTML = '';

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const hours = [
            '8:00 - 9:00 AM',
            '9:00 - 10:00 AM',
            '10:00 - 11:00 AM',
            '11:00 - 12:00 PM',
            '12:00 - 1:00 PM',
            '1:00 - 2:00 PM',
            '2:00 - 3:00 PM',
            '3:00 - 4:00 PM',
            '4:00 - 5:00 PM',
            '5:00 - 6:00 PM'
        ];

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Time</th>' + days.map(day => `<th>${day}</th>`).join('');
        timetable.appendChild(headerRow);

        hours.forEach(hour => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${hour}</td>` + days.map(day => {
                let content = this.data.classes[hour] || '';
                return `<td class="lab">${content}</td>`;
            }).join('');
            timetable.appendChild(row);
        });
    }

    highlightBatch(batch) {
        const timetable = document.getElementById('timetable');
        const rows = timetable.getElementsByTagName('tr');
        const batchLabs = this.data.labs[batch] || {};
        const color = this.data.batchColors[batch] || '#ffffff';

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            for (let j = 1; j < cells.length; j++) {
                cells[j].style.backgroundColor = '';
            }
        }

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            for (let j = 1; j < cells.length; j++) {
                const day = rows[0].cells[j].textContent;
                if (batchLabs[day] === cells[j].textContent) {
                    cells[j].style.backgroundColor = color;
                }
            }
        }
    }

    updateTimetable() {
        
    }
}

// Initialize the Timetable class
document.addEventListener('DOMContentLoaded', () => {
    new Timetable();
});
