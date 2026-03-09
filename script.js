const STORAGE_PORTFOLIO_KEY = "zaifi_portfolio_items";
const STORAGE_ADMIN_BOOKINGS_KEY = "zaifi_admin_bookings";
const STORAGE_ADMIN_DATE_STATUS_KEY = "zaifi_admin_date_status";
const STORAGE_ADMIN_SERVICES_KEY = "zaifi_admin_services";
const portfolioGallery = document.getElementById("portfolioGallery");
const servicesGrid = document.getElementById("servicesGrid");

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const selectedDatesList = document.getElementById("selectedDatesList");
const selectedDateInput = document.getElementById("selectedDate");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("section[id]");

let viewDate = new Date();
viewDate.setDate(1);
let selectedDates = [];

function readJson(key, fallbackValue) {
try {
const data = localStorage.getItem(key);
return data ? JSON.parse(data) : fallbackValue;
} catch (error) {
return fallbackValue;
}
}

function writeJson(key, value) {
localStorage.setItem(key, JSON.stringify(value));
}

function getAdminBookings() {
return readJson(STORAGE_ADMIN_BOOKINGS_KEY, []);
}

function getManualDateStatuses() {
return readJson(STORAGE_ADMIN_DATE_STATUS_KEY, {});
}

function getAdminServices() {
const fallback = [
{ name: "Wedding Photography", description: "Cinematic wedding coverage with creative storytelling." },
{ name: "Corporate Shoots", description: "Professional shoots for corporate teams and brands." },
{ name: "Real Estate Video", description: "Property showcase videos and photos for listings." },
{ name: "Reels / Social Media Content", description: "Short-form content optimized for social media." },
{ name: "Model Shoots", description: "Studio and outdoor model portfolio sessions." }
];
const services = readJson(STORAGE_ADMIN_SERVICES_KEY, []);
if (!services.length) {
return fallback;
}

return services
.map((service) => {
if (typeof service === "string") {
return { name: service, description: "" };
}
return {
name: service && service.name ? service.name : "",
description: service && service.description ? service.description : ""
};
})
.filter((service) => service.name);
}

function getDateStatus(dateKey) {
const bookings = getAdminBookings();
const hasBooking = bookings.some((item) => {
if (item.status !== "Approved" && item.status !== "Completed") {
return false;
}
if (item.eventDate === dateKey) {
return true;
}
if (Array.isArray(item.requestedDates) && item.requestedDates.includes(dateKey)) {
return true;
}
return false;
});
if (hasBooking) {
return "booked";
}

const manualStatuses = getManualDateStatuses();
const manualStatus = manualStatuses[dateKey];
if (manualStatus === "blocked") {
return "blocked";
}
if (manualStatus === "booked") {
return "booked";
}
return "available";
}

function renderPortfolio() {
if (!portfolioGallery) {
return;
}

const defaultItems = [
{ image: "Images/styles-1.jpg", category: "Studio", subcategory: "Fashion" },
{ image: "Images/895._MG_5493-copy.jpg", category: "Wedding", subcategory: "Couple" },
{ image: "https://picsum.photos/400/300?3", category: "Corporate", subcategory: "Office" },
{ image: "https://picsum.photos/400/300?4", category: "Events", subcategory: "Highlights" },
{ image: "https://picsum.photos/400/300?5", category: "Real Estate", subcategory: "Interior" },
{ image: "https://picsum.photos/400/300?6", category: "Reels", subcategory: "Social Media" }
];

const storedItems = readJson(STORAGE_PORTFOLIO_KEY, []);
const items = storedItems.length ? storedItems : defaultItems;
portfolioGallery.innerHTML = "";

for (let i = 0; i < items.length; i += 1) {
const card = document.createElement("div");
card.className = "portfolio-card";

const mediaType = items[i].mediaType || (items[i].mediaUrl && items[i].mediaUrl.toLowerCase().includes("video") ? "video" : "image");
const mediaUrl = items[i].mediaUrl || items[i].image;
let mediaElement;

if (mediaType === "video" && mediaUrl) {
const video = document.createElement("video");
video.src = mediaUrl;
video.controls = true;
video.className = "portfolio-media";
mediaElement = video;
} else {
const image = document.createElement("img");
image.src = mediaUrl;
image.alt = items[i].title || `${items[i].category || "Portfolio"} media`;
image.className = "portfolio-media";
mediaElement = image;
}

if (items[i].externalLink) {
const link = document.createElement("a");
link.href = items[i].externalLink;
link.target = "_blank";
link.rel = "noopener noreferrer";
link.appendChild(mediaElement);
card.appendChild(link);
} else {
card.appendChild(mediaElement);
}

const meta = document.createElement("div");
meta.className = "portfolio-meta";

if (items[i].title) {
const titleTag = document.createElement("span");
titleTag.textContent = items[i].title;
meta.appendChild(titleTag);
}

if (Array.isArray(items[i].services) && items[i].services.length) {
for (let j = 0; j < items[i].services.length; j += 1) {
const serviceTag = document.createElement("span");
serviceTag.textContent = items[i].services[j];
meta.appendChild(serviceTag);
}
} else {
const categoryTag = document.createElement("span");
categoryTag.textContent = items[i].category || "General";
meta.appendChild(categoryTag);
}

if (items[i].subcategory) {
const subcategoryTag = document.createElement("span");
subcategoryTag.textContent = items[i].subcategory;
meta.appendChild(subcategoryTag);
}

card.appendChild(meta);
portfolioGallery.appendChild(card);
}
}

function renderServices() {
if (!servicesGrid) {
return;
}

const services = getAdminServices();
servicesGrid.innerHTML = "";

for (let i = 0; i < services.length; i += 1) {
const card = document.createElement("div");
card.className = "card";

const title = document.createElement("h3");
title.textContent = services[i].name;

const desc = document.createElement("p");
desc.textContent = services[i].description || `Professional ${services[i].name.toLowerCase()} by Zaifi Studio.`;

card.appendChild(title);
card.appendChild(desc);
servicesGrid.appendChild(card);
}
}

function renderServiceSelect() {
const eventSelect = document.getElementById("event");
if (!eventSelect) {
return;
}

const services = getAdminServices();
eventSelect.innerHTML = "";

const placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Select Service";
placeholder.disabled = true;
placeholder.selected = true;
eventSelect.appendChild(placeholder);

for (let i = 0; i < services.length; i += 1) {
const option = document.createElement("option");
option.value = services[i].name;
option.textContent = services[i].name;
eventSelect.appendChild(option);
}
}

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

function renderSelectedDates() {
if (!selectedDatesList) {
return;
}
if (!selectedDates.length) {
selectedDatesList.textContent = "Selected dates: None";
selectedDateInput.value = "";
return;
}
const sorted = selectedDates.slice().sort();
selectedDatesList.textContent = `Selected dates: ${sorted.join(", ")}`;
selectedDateInput.value = sorted.join(",");
}

function renderCalendar() {
calendarGrid.innerHTML = "";
const year = viewDate.getFullYear();
const month = viewDate.getMonth();
monthLabel.textContent = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });
selectedDates = selectedDates.filter((dateKey) => getDateStatus(dateKey) === "available");
renderSelectedDates();

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
const status = getDateStatus(dateKey);
const isDisabled = status === "booked" || status === "blocked";
const dateBtn = document.createElement("button");
dateBtn.type = "button";
dateBtn.textContent = day;
dateBtn.className = `day ${status}`;

if (isDisabled) {
dateBtn.disabled = true;
} else {
if (selectedDates.includes(dateKey)) {
dateBtn.classList.add("selected");
}

dateBtn.addEventListener("click", function () {
if (selectedDates.includes(dateKey)) {
selectedDates = selectedDates.filter((date) => date !== dateKey);
} else {
selectedDates.push(dateKey);
}
renderSelectedDates();
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
const location = document.getElementById("location").value.trim();
const eventName = document.getElementById("event").value.trim();
const selected = selectedDates.slice();

if (!selected.length) {
alert("Please select at least one available date from the calendar.");
return;
}

for (let i = 0; i < selected.length; i += 1) {
const dateStatus = getDateStatus(selected[i]);
if (dateStatus !== "available") {
alert("One or more selected dates are no longer available. Please select again.");
selectedDates = selected.filter((dateKey) => getDateStatus(dateKey) === "available");
renderSelectedDates();
renderCalendar();
return;
}
}

const bookings = getAdminBookings();
bookings.push({
id: `web_${Date.now()}`,
clientName: name,
phone: mobile,
email: "",
eventDate: selected[0],
location,
serviceType: eventName,
status: "Pending",
requestedDates: selected,
notes: "Submitted from website form"
});
writeJson(STORAGE_ADMIN_BOOKINGS_KEY, bookings);

const details = `New Booking Request - Zaifi Studio
Name: ${name}
Mobile: ${mobile}
Location: ${location}
Event: ${eventName}
Dates: ${selected.join(", ")}`;

const whatsappUrl = `https://wa.me/+923440520548?text=${encodeURIComponent(details)}`;
window.open(whatsappUrl, "_blank");

selectedDates = [];
renderSelectedDates();
renderCalendar();
});

window.addEventListener("storage", function () {
renderCalendar();
renderServices();
renderServiceSelect();
});

renderCalendar();
setActiveNav("home");
renderPortfolio();
renderServices();
renderServiceSelect();
