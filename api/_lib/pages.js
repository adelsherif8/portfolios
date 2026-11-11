// HTML for the admin pages. Kept as plain files next to this module so they are easy to edit.
const fs = require("fs");
const path = require("path");

const LOGIN = fs.readFileSync(path.join(__dirname, "login.html"), "utf8");
const DASH = fs.readFileSync(path.join(__dirname, "dashboard.html"), "utf8");

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function loginPage(error) {
  return LOGIN.replace("{{ERROR}}", error ? `<p class="err"><i class="fa-solid fa-circle-exclamation"></i> ${esc(error)}</p>` : "");
}

function dashboardPage() {
  return DASH;
}

module.exports = { loginPage, dashboardPage };
