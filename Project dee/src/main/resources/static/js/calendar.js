// static/js/calendar.js
// Calendar functionality for the application
document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthDisplay = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const dayDetails = document.getElementById('day-details');
    const selectedDateDisplay = document.getElementById('selected-date');
    
    // Fetch user data (in a real app, this would come from the backend)
    // For now, we'll simulate with sample data
    const userData = {
        periods: [
            { startDate: new Date(2025, 3, 5), endDate: new Date(2025, 3, 10) },
            { startDate: new Date(2025, 2, 8), endDate: new Date(2025, 2, 13) }
        ],
        nextPeriod: new Date(2025, 4, 2),
        ovulation: new Date(2025, 3, 19),
        fertileWindow: [
            new Date(2025, 3, 14),
            new Date(2025, 3, 15),
            new Date(2025, 3, 16),
            new Date(2025, 3, 17),
            new Date(2025, 3, 18),
            new Date(2025, 3, 19)
        ],
        symptoms: [
            { date: new Date(2025, 3, 5), type: 'CRAMPS', intensity: 3 },
            { date: new Date(2025, 3, 6), type: 'HEADACHE', intensity: 2 },
            { date: new Date(2025, 3, 7), type: 'MOOD_SWINGS', intensity: 4 }
        ]
    };
    
    // Initialize calendar
    renderCalendar(currentDate);
    
    // Event listeners for calendar navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
    
    // Function to render the calendar
    function renderCalendar(date) {
        // Clear previous calendar
        calendarDays.innerHTML = '';
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthDisplay.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        // Get first day of month
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        
        // Get last day of month
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDay.getDay();
        
        // Get total days in month
        const totalDays = lastDay.getDate();
        
        // Get total days in previous month
        const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        
        // Calculate total cells needed (previous month days + current month days + next month days)
        const totalCells = Math.ceil((firstDayOfWeek + totalDays) / 7) * 7;
        
        // Get today's date
        const today = new Date();
        
        // Add days to calendar
        for (let i = 0; i < totalCells; i++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            
            // Calculate day number
            let dayNumber;
            let dayDate;
            
            if (i < firstDayOfWeek) {
                // Previous month days
                dayNumber = prevMonthLastDay - (firstDayOfWeek - i - 1);
                dayDate = new Date(date.getFullYear(), date.getMonth() - 1, dayNumber);
                dayCell.classList.add('other-month');
            } else if (i >= firstDayOfWeek + totalDays) {
                // Next month days
                dayNumber = i - (firstDayOfWeek + totalDays) + 1;
                dayDate = new Date(date.getFullYear(), date.getMonth() + 1, dayNumber);
                dayCell.classList.add('other-month');
            } else {
                // Current month days
                dayNumber = i - firstDayOfWeek + 1;
                dayDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
            }
            
            // Add day number
            const dayNumberElement = document.createElement('div');
            dayNumberElement.classList.add('day-number');
            dayNumberElement.textContent = dayNumber;
            dayCell.appendChild(dayNumberElement);
            
            // Check if today
            if (dayDate.getDate() === today.getDate() && 
                dayDate.getMonth() === today.getMonth() && 
                dayDate.getFullYear() === today.getFullYear()) {
                const todayIndicator = document.createElement('div');
                todayIndicator.classList.add('today-indicator');
                dayCell.appendChild(todayIndicator);
            }
            
            // Check if period day
            if (isPeriodDay(dayDate)) {
                const periodMarker = document.createElement('div');
                periodMarker.classList.add('calendar-marker', 'period');
                dayCell.appendChild(periodMarker);
            }
            
            // Check if ovulation day
            if (isOvulationDay(dayDate)) {
                const ovulationMarker = document.createElement('div');
                ovulationMarker.classList.add('calendar-marker', 'ovulation');
                ovulationMarker.style.left = '1.5rem';
                dayCell.appendChild(ovulationMarker);
            }
            
            // Check if fertile day
            if (isFertileDay(dayDate)) {
                const fertileMarker = document.createElement('div');
                fertileMarker.classList.add('calendar-marker', 'fertile');
                fertileMarker.style.left = '2.5rem';
                dayCell.appendChild(fertileMarker);
            }
            
            // Add click event for day details
            dayCell.addEventListener('click', function() {
                showDayDetails(dayDate);
            });
            
            calendarDays.appendChild(dayCell);
        }
    }
    
    // Function to check if a date is a period day
    function isPeriodDay(date) {
        return userData.periods.some(period => {
            const checkDate = new Date(date);
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            
            return checkDate >= startDate && checkDate <= endDate;
        });
    }
    
    // Function to check if a date is an ovulation day
    function isOvulationDay(date) {
        const ovulationDate = new Date(userData.ovulation);
        return date.getDate() === ovulationDate.getDate() && 
               date.getMonth() === ovulationDate.getMonth() && 
               date.getFullYear() === ovulationDate.getFullYear();
    }
    
    // Function to check if a date is a fertile day
    function isFertileDay(date) {
        return userData.fertileWindow.some(fertileDate => {
            const checkFertileDate = new Date(fertileDate);
            return date.getDate() === checkFertileDate.getDate() && 
                   date.getMonth() === checkFertileDate.getMonth() && 
                   date.getFullYear() === checkFertileDate.getFullYear();
        });
    }
    
    // Function to show day details
    function showDayDetails(date) {
        // Format date for display
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateDisplay.textContent = date.toLocaleDateString('en-US', options);
        
        // Set visibility for status indicators
        document.getElementById('period-status').classList.toggle('hidden', !isPeriodDay(date));
        document.getElementById('ovulation-status').classList.toggle('hidden', !isOvulationDay(date));
        document.getElementById('fertile-status').classList.toggle('hidden', !isFertileDay(date));
        
        // Show day details section
        dayDetails.classList.remove('hidden');
        
        // Populate symptoms for this day
        const symptomList = document.getElementById('symptom-list');
        symptomList.innerHTML = '';
        
        const symptoms = getUserSymptoms(date);
        
        if (symptoms.length > 0) {
            symptoms.forEach(symptom => {
                const symptomItem = document.createElement('div');
                symptomItem.classList.add('symptom-item');
                
                const symptomName = document.createElement('div');
                symptomName.classList.add('symptom-name');
                symptomName.textContent = formatSymptomType(symptom.type);
                
                const symptomIntensity = document.createElement('div');
                symptomIntensity.classList.add('symptom-intensity');
                symptomIntensity.textContent = `Intensity: ${symptom.intensity}/5`;
                
                symptomItem.appendChild(symptomName);
                symptomItem.appendChild(symptomIntensity);
                symptomList.appendChild(symptomItem);
            });
        } else {
            const noSymptoms = document.createElement('p');
            noSymptoms.classList.add('no-symptoms');
            noSymptoms.textContent = 'No symptoms recorded for this day';
            symptomList.appendChild(noSymptoms);
        }
        
        // Configure add symptom button URL with date
        const addSymptomBtn = document.getElementById('add-symptom-btn');
        addSymptomBtn.href = `/symptoms/add?date=${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    
    // Function to get user symptoms for a specific date
    function getUserSymptoms(date) {
        return userData.symptoms.filter(symptom => {
            const symptomDate = new Date(symptom.date);
            return date.getDate() === symptomDate.getDate() && 
                   date.getMonth() === symptomDate.getMonth() && 
                   date.getFullYear() === symptomDate.getFullYear();
        });
    }
    
    // Function to format symptom type
    function formatSymptomType(type) {
        return type.replace(/_/g, ' ').replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
});