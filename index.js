let startDate = null;
let endDate = null;

const exactDateButton = document.getElementById('exactDate');
const flexibleDateButton = document.getElementById('flexibleDate');

exactDateButton.addEventListener('click', () => {
  exactDateButton.classList.add('active-button');
  exactDateButton.classList.remove('nonactive-button');

  flexibleDateButton.classList.add('nonactive-button');
  flexibleDateButton.classList.remove('active-button');
});

flexibleDateButton.addEventListener('click', () => {
  flexibleDateButton.classList.add('active-button');
  flexibleDateButton.classList.remove('nonactive-button');

  exactDateButton.classList.add('nonactive-button');
  exactDateButton.classList.remove('active-button');
});

document.addEventListener('DOMContentLoaded', function () {
  // Get the month 1 and month 2 div to populate them later
  const dateSelectors = [
    document.getElementById('date-selector-1'),
    document.getElementById('date-selector-2'),
  ];

  // Get current date, current year and month to start showing the dates 
  // from the current month only 
  const today = new Date();
  const initialYear = today.getFullYear();
  const initialMonth = today.getMonth();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let currentYear = initialYear;
  let currentMonth = initialMonth;

  function clearDays() {
    dateSelectors.forEach((selector) => {
      selector.innerHTML = '';
    });
  }

  // Render empty divs at the beginning of the month
  // in respect to the month previous of it 
  function renderEmptyDays(count, selector) {
    for (let i = 0; i < count; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty';
      selector.appendChild(emptyDiv);
    }
  }

  // Function to render days of the month
  function renderDays(daysInMonth, selector, firstDay) {
    for (let i = 1; i <= daysInMonth; i++) {
      const dayButton = document.createElement('button');
      dayButton.type = 'button';
      dayButton.tabIndex = -1;
      dayButton.classList.add('date');
      dayButton.textContent = i;
      dayButton.dataset.date = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1
        }-${i}`;

      // disable all the dates of the current month if they 
      // are below the current date
      let temp = new Date(dayButton.dataset.date);
      dayButton.disabled = temp < today ? true : false;

      selector.appendChild(dayButton);
    }
  }

  function populateDatePicker(month, year, selector) {
    // Get the first day of the given month and year
    const firstDay = new Date(year, month, 1);
    // Calculate the day of the week the first day falls on (0=Sun, 1=Mon, ..., 6=Sat)
    const startDay = (firstDay.getDay() + 6) % 7; // Adjust to make 0=Mon, ..., 6=Sun

    // Calculate the number of days in the given month
    const nextMonth = new Date(year, month + 1, 1);
    const lastDayOfCurrentMonth = new Date(nextMonth - 1);
    const daysInMonth = lastDayOfCurrentMonth.getDate();

    document.getElementById('month-1').innerText = `${months[(month + 11) % 12]
      } ${year}`;

    let temp = document.getElementById('month-1').innerText.includes('December');
    document.getElementById('month-2').innerText = `${months[(month + 12) % 12]
      } ${temp ? year + 1 : year}`;

    renderEmptyDays(startDay, selector);
    renderDays(daysInMonth, selector, firstDay);
  }

  function updateDatePickers() {
    clearDays();
    populateDatePicker(currentMonth, currentYear, dateSelectors[0]);
    populateDatePicker(currentMonth + 1, currentYear, dateSelectors[1]);

    // Disable prev-month button if it's the earliest allowed month
    if (currentYear === initialYear && currentMonth === initialMonth) {
      document
        .getElementById('prev-month')
        .setAttribute('disabled', 'disabled');
      document.getElementById('prev-month-svg').style.color = '#babac0';
    } else {
      document.getElementById('prev-month').removeAttribute('disabled');
      document.getElementById('prev-month-svg').style.color = '#3c3c3c';
    }
  }

  document.getElementById('prev-month').addEventListener('click', () => {
    // Check if the current month is greater than the initial month and year
    if (
      currentYear > initialYear ||
      (currentYear === initialYear && currentMonth > initialMonth)
    ) {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateDatePickers();
    }
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateDatePickers();
  });

  // Initial population
  updateDatePickers();
});

/*
 * Hover state selection 
*/
const dateSelectors = document.getElementsByClassName('date');

function handleDateClick(event) {
  const selectedDate = new Date(event.target.dataset.date);

  if (!startDate) {
    startDate = selectedDate.toDateString();
    document.getElementById('startDate').value = selectedDate.toDateString();

    event.target.classList.add('selection-start');
    document.getElementById('leavingOn').value = selectedDate.toDateString();
    document.getElementById('selection-status').checked = true;
  } else if (!endDate && selectedDate > new Date(startDate)) {
    endDate = selectedDate;
    document.getElementById('endDate').value = selectedDate
      .toISOString()
      .split('T')[0];

    finalizeSelection(dateSelectors);
    document.getElementById('returningOn').value = selectedDate.toDateString();
    document.getElementById('selection-status').checked = false;
  } else {
    clearSelection();
    startDate = selectedDate.toDateString();
    document.getElementById('startDate').value = selectedDate.toDateString();

    event.target.classList.add('selection-start');
    document.getElementById('leavingOn').value = selectedDate.toDateString();
  }
}

function handleDateHover(event) {
  if (startDate && !endDate) {
    const hoveredDate = new Date(event.target.dataset.date);

    for (let i = 0; i < dateSelectors.length; i++) {
      const date = new Date(dateSelectors[i].dataset.date);

      if (date.toDateString() == startDate) {
        dateSelectors[i].classList.add('selection-start');
      }
      else if (date > new Date(startDate) && date <= hoveredDate) {
        dateSelectors[i].classList.add('selection-hover');
      } else {
        dateSelectors[i].classList.remove('selection-hover');
      }
    }
  }
}

function finalizeSelection(dateSelectors) {
  for (let i = 0; i < dateSelectors.length; i++) {
    const date = new Date(dateSelectors[i].dataset.date);

    if (date >= startDate && date <= endDate) {
      dateSelectors[i].classList.add('selection-hover');
    }

    if (date.toDateString() == endDate.toDateString()) {
      dateSelectors[i].classList.add('selection-end');
    }
  }
}

function clearSelection() {
  startDate = null;
  endDate = null;

  for (let i = 0; i < dateSelectors.length; i++) {
    dateSelectors[i].classList.remove('selection-start');
    dateSelectors[i].classList.remove('selection-hover');
    dateSelectors[i].classList.remove('selection-end');
  }
}

function clearHoverSelection() {
  dateSelectors.forEach((selector) => {
    Array.from(selector.children).forEach((child) => {
      if (new Date(child.dataset.date) > startDate) {
        child.style.backgroundColor = '';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < dateSelectors.length; i++) {
    dateSelectors[i].addEventListener('click', handleDateClick);
    dateSelectors[i].addEventListener('mouseover', handleDateHover);
  }
});

document.getElementById('next-month').addEventListener('click', () => {
  setTimeout(() => {
    for (let i = 0; i < dateSelectors.length; i++) {
      dateSelectors[i].addEventListener('click', handleDateClick);
      dateSelectors[i].addEventListener('mouseover', handleDateHover);
    }
  }, 5);
})

const leavingOn = document.getElementById('leavingOn');
const returningOn = document.getElementById('returningOn');
const dateWrapper = document.getElementsByClassName('date-wrapper')[0];

leavingOn.addEventListener('focusin', (e) => {
  dateWrapper.style.display = 'block';
});

returningOn.addEventListener('focusin', (e) => {
  dateWrapper.style.display = 'block';
});

document.body.addEventListener('click', (e) => {
  if (!leavingOn.contains(e.target) && !dateWrapper.contains(e.target)) {
    dateWrapper.style.display = 'none';
  }
});

// Prevent the click on the date picker from closing the wrapper
dateWrapper.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Prevent the click on the input from closing the wrapper
leavingOn.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Prevent the click on the input from closing the wrapper
returningOn.addEventListener('click', (e) => {
  e.stopPropagation();
});