// ROOT (Running Out Of Time) - Time Tracker JavaScript

class TimeTracker {
    constructor() {
        this.currentWeekStart = this.getWeekStart(new Date());
        this.activities = [
            'sleep', 'classes', 'research', 'rev', 'social', 
            'sports', 'recruiting', 'other-productive', 'other-unproductive'
        ];
        this.activityColors = {
            'sleep': '#6c757d',
            'classes': '#007bff',
            'research': '#28a745',
            'rev': '#ffc107',
            'social': '#fd7e14',
            'sports': '#20c997',
            'recruiting': '#6f42c1',
            'other-productive': '#17a2b8',
            'other-unproductive': '#dc3545'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateWeekDisplay();
        this.renderCalendar();
        this.renderStats();
    }

    setupEventListeners() {
        // Week navigation
        document.getElementById('prevWeek').addEventListener('click', () => {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            this.updateWeekDisplay();
            this.renderCalendar();
            this.renderStats();
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
            this.updateWeekDisplay();
            this.renderCalendar();
            this.renderStats();
        });
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    }

    updateWeekDisplay() {
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        const startStr = this.currentWeekStart.toLocaleDateString('en-US', options);
        const endStr = weekEnd.toLocaleDateString('en-US', options);
        
        document.getElementById('currentWeek').textContent = 
            `${startStr} - ${endStr}, ${this.currentWeekStart.getFullYear()}`;
    }

    getManualEntries() {
        const manualDataDiv = document.getElementById('manualTimeData');
        const entries = [];
        
        // Get all div elements with data attributes
        const dataElements = manualDataDiv.querySelectorAll('div[data-date][data-time][data-activity]');
        
        dataElements.forEach(element => {
            const entry = {
                date: element.getAttribute('data-date'),
                timeSlot: element.getAttribute('data-time'),
                activity: element.getAttribute('data-activity'),
                timestamp: new Date().toISOString()
            };
            entries.push(entry);
        });
        
        return entries;
    }

    getEntry(date, timeSlot) {
        const entries = this.getManualEntries();
        return entries.find(entry => entry.date === date && entry.timeSlot === timeSlot) || null;
    }

    getWeekEntries() {
        const entries = [];
        const allEntries = this.getManualEntries();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Filter entries for this date
            const dayEntries = allEntries.filter(entry => entry.date === dateStr);
            entries.push(...dayEntries);
        }
        
        return entries;
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // Add header row
        const days = ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        // Add time slots (30-minute intervals)
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // Time column
                const timeHeader = document.createElement('div');
                timeHeader.className = 'calendar-header';
                timeHeader.textContent = this.formatTimeSlot(timeSlot);
                calendarGrid.appendChild(timeHeader);

                // Day columns
                for (let day = 0; day < 7; day++) {
                    const date = new Date(this.currentWeekStart);
                    date.setDate(date.getDate() + day);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const entry = this.getEntry(dateStr, timeSlot);
                    const dayCell = document.createElement('div');
                    dayCell.className = 'calendar-day';
                    
                    if (entry) {
                        const timeSlotDiv = document.createElement('div');
                        timeSlotDiv.className = `time-slot ${entry.activity}`;
                        timeSlotDiv.textContent = this.formatActivity(entry.activity);
                        timeSlotDiv.title = `${this.formatTimeSlot(timeSlot)} - ${this.formatActivity(entry.activity)}`;
                        dayCell.appendChild(timeSlotDiv);
                    }
                    
                    calendarGrid.appendChild(dayCell);
                }
            }
        }
    }

    renderStats() {
        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = '';

        const weekEntries = this.getWeekEntries();
        const activityStats = {};

        // Initialize stats
        this.activities.forEach(activity => {
            activityStats[activity] = 0;
        });

        // Count hours (each entry is 30 minutes = 0.5 hours)
        weekEntries.forEach(entry => {
            activityStats[entry.activity] += 0.5;
        });

        // Calculate total hours
        const totalHours = Object.values(activityStats).reduce((sum, hours) => sum + hours, 0);

        // Create stat cards
        this.activities.forEach(activity => {
            const hours = activityStats[activity];
            const percentage = totalHours > 0 ? ((hours / totalHours) * 100).toFixed(1) : 0;

            const statCard = document.createElement('div');
            statCard.className = 'stat-card';
            statCard.innerHTML = `
                <div class="stat-activity">${this.formatActivity(activity)}</div>
                <div class="stat-hours">${hours.toFixed(1)}h</div>
                <div class="stat-percentage">${percentage}%</div>
            `;
            statsGrid.appendChild(statCard);
        });

        // Add total hours card
        const totalCard = document.createElement('div');
        totalCard.className = 'stat-card';
        totalCard.style.borderLeftColor = '#424242';
        totalCard.innerHTML = `
            <div class="stat-activity">Total Tracked</div>
            <div class="stat-hours">${totalHours.toFixed(1)}h</div>
            <div class="stat-percentage">${((totalHours / 168) * 100).toFixed(1)}% of week</div>
        `;
        statsGrid.appendChild(totalCard);
    }

    formatTimeSlot(timeSlot) {
        const [hour, minute] = timeSlot.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
        return `${displayHour}:${minute} ${ampm}`;
    }

    formatActivity(activity) {
        return activity.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Initialize the time tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TimeTracker();
});