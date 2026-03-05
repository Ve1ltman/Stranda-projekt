// ================== THEME ==================
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = theme === "light" ? "☀️" : "🌙";
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    setTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

initTheme();

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// ================== MOBILE MENU ==================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    if (navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    }
  });
});

// ================== FOOTER YEAR ==================
document.getElementById("year").textContent = new Date().getFullYear();

// ================== VIDEO FILTER ==================
const chips = document.querySelectorAll(".chip");
const videoCards = document.querySelectorAll(".videoCard");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    videoCards.forEach((card) => {
      const type = card.dataset.type;
      const show = (filter === "alle") || (type === filter);
      card.style.display = show ? "block" : "none";
    });
  });
});

// ================== CONTACT (DEMO) ==================
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  formMsg.textContent = "Takk! Meldingen er sendt (demo i skoleprosjekt).";
  form.reset();
});

// ================== GALLERY LIGHTBOX ==================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".galleryItem img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.getAttribute("src");
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});

// ================== WEATHER (HALDEN) ==================
async function loadWeather() {
  const statusEl = document.getElementById("weatherStatus");
  const lineEl = document.getElementById("weatherLine");
  if (!statusEl || !lineEl) return;

  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=59.12&longitude=11.39" +
      "&current=temperature_2m,wind_speed_10m,weather_code" +
      "&timezone=auto";

    const res = await fetch(url);
    if (!res.ok) throw new Error("weather fetch failed");

    const data = await res.json();
    const cur = data.current;

    const temp = Math.round(cur.temperature_2m);
    const wind = Math.round(cur.wind_speed_10m);
    const code = cur.weather_code;

    const desc = weatherCodeToText(code);

    statusEl.textContent = desc;
    lineEl.textContent = `Nå: ${temp}°C • Vind: ${wind} m/s`;
  } catch (e) {
    statusEl.textContent = "Ikke tilgjengelig";
    lineEl.textContent = "Kunne ikke hente vær akkurat nå.";
  }
}

function weatherCodeToText(code) {
  if (code === 0) return "Klart";
  if (code === 1 || code === 2) return "Delvis skyet";
  if (code === 3) return "Skyet";
  if (code === 45 || code === 48) return "Tåke";
  if (code >= 51 && code <= 57) return "Yr";
  if (code >= 61 && code <= 67) return "Regn";
  if (code >= 71 && code <= 77) return "Snø";
  if (code >= 80 && code <= 82) return "Regnbyger";
  if (code >= 95) return "Torden";
  return "Vær";
}

loadWeather();
