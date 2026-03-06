import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const DateRangePicker = ({ dateRange, setDateRange, onSearch }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date for display (DD/MM/YYYY)
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const formatDateRangeDisplay = () => {
    if (dateRange.start && dateRange.end) {
      return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
    }
    return "";
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      // Store at noon to avoid timezone issues
      days.push(new Date(year, month, i, 12, 0, 0, 0));
    }
    return days;
  };

  const handleDateClick = (date) => {
    if (!date) return;

    // Get today
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Get tomorrow (to block future dates)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Get 90 days ago from today
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);
    ninetyDaysAgo.setHours(0, 0, 0, 0);

    // Create clicked date at start of day
    const clickedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );

    // Check if date is valid (not future, not older than 90 days)
    if (clickedDate >= tomorrow || clickedDate < ninetyDaysAgo) return;

    if (selectedDates.length === 0) {
      // First date selection - store at noon for display
      const dateAtNoon = new Date(
        clickedDate.getFullYear(),
        clickedDate.getMonth(),
        clickedDate.getDate(),
        12,
        0,
        0,
        0,
      );
      setSelectedDates([dateAtNoon]);
    } else if (selectedDates.length === 1) {
      // Second date selection - complete the range
      const [firstDate] = selectedDates;

      // Get dates at midnight for comparison
      const firstDateMidnight = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate(),
        0,
        0,
        0,
        0,
      );

      const clickedDateMidnight = new Date(
        clickedDate.getFullYear(),
        clickedDate.getMonth(),
        clickedDate.getDate(),
        0,
        0,
        0,
        0,
      );

      // Determine start and end - start is ALWAYS 00:00:00
      let start, end;

      if (firstDateMidnight.getTime() === clickedDateMidnight.getTime()) {
        // Same date selected - single day range
        start = new Date(firstDateMidnight);
        start.setHours(0, 0, 0, 0); // 12:00 AM

        end = new Date(clickedDateMidnight);
        end.setHours(23, 59, 59, 999); // 11:59 PM
      } else {
        // Different dates - multi-day range
        start =
          firstDateMidnight < clickedDateMidnight
            ? firstDateMidnight
            : clickedDateMidnight;
        start.setHours(0, 0, 0, 0); // Start of earlier date (12:00 AM)

        end =
          firstDateMidnight > clickedDateMidnight
            ? firstDateMidnight
            : clickedDateMidnight;
        end.setHours(23, 59, 59, 999); // End of later date (11:59 PM)
      }

      // Check if range is within 90 days
      const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
      if (daysDiff > 90) {
        // If range too large, start new selection
        const dateAtNoon = new Date(
          clickedDate.getFullYear(),
          clickedDate.getMonth(),
          clickedDate.getDate(),
          12,
          0,
          0,
          0,
        );
        setSelectedDates([dateAtNoon]);
        return;
      }

      // Set the range and close calendar
      setDateRange({ start, end });
      setSelectedDates([]);
      setShowCalendar(false);
    } else {
      // Reset selection
      const dateAtNoon = new Date(
        clickedDate.getFullYear(),
        clickedDate.getMonth(),
        clickedDate.getDate(),
        12,
        0,
        0,
        0,
      );
      setSelectedDates([dateAtNoon]);
    }
  };

  const isDateDisabled = (date) => {
    if (!date) return true;

    // Get today
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Get tomorrow (to block future dates)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Get 90 days ago from today
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);
    ninetyDaysAgo.setHours(0, 0, 0, 0);

    const checkDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );

    // Disable future dates and dates older than 90 days
    // Today is allowed
    return checkDate >= tomorrow || checkDate < ninetyDaysAgo;
  };

  const isDateInRange = (date) => {
    if (!date || !dateRange.start || !dateRange.end) return false;

    const checkDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
      0,
    );

    const startDate = new Date(
      dateRange.start.getFullYear(),
      dateRange.start.getMonth(),
      dateRange.start.getDate(),
      12,
      0,
      0,
      0,
    );

    const endDate = new Date(
      dateRange.end.getFullYear(),
      dateRange.end.getMonth(),
      dateRange.end.getDate(),
      12,
      0,
      0,
      0,
    );

    return checkDate >= startDate && checkDate <= endDate;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    return selectedDates.some((d) => {
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
  };

  return (
    <div className="relative mb-3" ref={calendarRef}>
      <div className="flex border-gray-200 rounded-full gap-3 border border-theme bg-theme-card shadow-theme-card">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex-1 text-sm px-4 py-3  rounded-full text-left text-gray-400 hover:bg-gray-200 transition-colors"
        >
          {formatDateRangeDisplay() || "DD / MM / YYYY - DD / MM / YYYY"}
        </button>
        <button
          onClick={onSearch}
          className="px-4 py-3  rounded-full hover:bg-gray-200 transition-colors"
        >
          <FiSearch size={20} color="#99a1af" />
        </button>
      </div>

      {showCalendar && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-theme-card border border-theme rounded-xl shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                  ),
                )
              }
              className="p-2 hover:bg-theme-card-2 rounded-lg text-theme-primary"
            >
              ←
            </button>
            <h3 className="font-semibold text-theme-primary">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                  ),
                )
              }
              className="p-2 hover:bg-theme-card-2 rounded-lg text-theme-primary"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-theme-secondary py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={!date || isDateDisabled(date)}
                className={`p-2 text-sm rounded-lg transition-all text-theme-primary
                  ${!date ? "invisible" : ""}
                  ${
                    isDateDisabled(date)
                      ? "text-theme-muted cursor-not-allowed"
                      : ""
                  }
                  ${
                    isDateInRange(date) && !isDateDisabled(date)
                      ? "bg-blue-100 text-blue-900"
                      : ""
                  }
                  ${
                    isDateSelected(date) && !isDateDisabled(date)
                      ? "bg-blue-500 text-white font-bold"
                      : ""
                  }
                  ${
                    date &&
                    !isDateInRange(date) &&
                    !isDateSelected(date) &&
                    !isDateDisabled(date)
                      ? "hover:bg-theme-card-2"
                      : ""
                  }`}
              >
                {date ? date.getDate() : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
