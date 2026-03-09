const bookedDates = [
"2026-03-12",
"2026-03-18",
"2026-03-22",
"2026-03-30",
"2026-04-03",
"2026-04-10",
"2026-04-15"
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const selectedDateInput = document.getElementById("selectedDate");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("section[id]");

let viewDate = new Date();
viewDate.setDate(1);
let selectedDate = "";

function setActiveNav(targetId) {
for (let i = 0; i < navLinks.length; i += 1) {
const href = navLinks[i].getAttribute("href");
if (href === `#${targetId}`) {
navLinks[i].classList.add("active");
} else {
navLinks[i].classList.remove("active");
}
}
}

function formatDateKey(year, monthIndex, day) {
const month = String(monthIndex + 1).padStart(2, "0");
const date = String(day).padStart(2, "0");
return `${year}-${month}-${date}`;
}

function renderCalendar() {
calendarGrid.innerHTML = "";
const year = viewDate.getFullYear();
const month = viewDate.getMonth();
monthLabel.textContent = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });

for (let i = 0; i < weekdays.length; i += 1) {
const head = document.createElement("div");
head.className = "weekday";
head.textContent = weekdays[i];
calendarGrid.appendChild(head);
}

const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

for (let i = 0; i < firstDay; i += 1) {
const empty = document.createElement("button");
empty.type = "button";
empty.className = "day empty";
empty.disabled = true;
calendarGrid.appendChild(empty);
}

for (let day = 1; day <= daysInMonth; day += 1) {
const dateKey = formatDateKey(year, month, day);
const isBooked = bookedDates.includes(dateKey);
const dateBtn = document.createElement("button");
dateBtn.type = "button";
dateBtn.textContent = day;
dateBtn.className = `day ${isBooked ? "booked" : "available"}`;

if (isBooked) {
dateBtn.disabled = true;
} else {
if (selectedDate === dateKey) {
dateBtn.classList.add("selected");
}

dateBtn.addEventListener("click", function () {
selectedDate = dateKey;
selectedDateInput.value = dateKey;
renderCalendar();
});
}

calendarGrid.appendChild(dateBtn);
}
}

prevMonthBtn.addEventListener("click", function () {
viewDate.setMonth(viewDate.getMonth() - 1);
renderCalendar();
});

nextMonthBtn.addEventListener("click", function () {
viewDate.setMonth(viewDate.getMonth() + 1);
renderCalendar();
});

for (let i = 0; i < navLinks.length; i += 1) {
navLinks[i].addEventListener("click", function () {
const target = navLinks[i].getAttribute("href");
if (target && target.startsWith("#")) {
setActiveNav(target.slice(1));
}
});
}

const sectionObserver = new IntersectionObserver(
function (entries) {
for (let i = 0; i < entries.length; i += 1) {
if (entries[i].isIntersecting) {
setActiveNav(entries[i].target.id);
}
}
},
{ rootMargin: "-40% 0px -45% 0px", threshold: 0.01 }
);

for (let i = 0; i < sections.length; i += 1) {
sectionObserver.observe(sections[i]);
}

document.getElementById("contactForm").addEventListener("submit", function (e) {
e.preventDefault();

const name = document.getElementById("name").value.trim();
const mobile = document.getElementById("mobile").value.trim();
const eventName = document.getElementById("event").value.trim();
const selected = selectedDateInput.value.trim();

if (!selected) {
alert("Please select an available date from the calendar.");
return;
}

const details = `New Booking Request - Zaifi Studio
Name: ${name}
Mobile: ${mobile}
Event: ${eventName}
Date: ${selected}`;

const whatsappUrl = `https://wa.me/+923440520548?text=${encodeURIComponent(details)}`;
window.open(whatsappUrl, "_blank");
});

renderCalendar();
setActiveNav("home");
