const themeToggle = document.getElementById("themeToggle") as HTMLInputElement;
const root = document.documentElement;

// Load saved theme on page load
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  root.setAttribute("data-bs-theme", "dark");
  themeToggle.checked = true;
} else {
  root.setAttribute("data-bs-theme", "light");
  themeToggle.checked = false;
}

// Toggle theme when switch changes
themeToggle.addEventListener("change", () => {
  const newTheme = themeToggle.checked ? "dark" : "light";

  root.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});