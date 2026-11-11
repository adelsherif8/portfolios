/* adelatya.com first-party analytics. No cookies, no storage of personal data.
   Sends page views and key clicks to /api/p/. Skips bots and any browser that has
   visited /admin (localStorage "aa_optout" = "1"). Other code can call window.aaTrack(name, label). */
(function () {
  try {
    var d = document, w = window, nav = navigator, loc = location;
    if (!/(^|\.)adelatya\.com$/.test(loc.hostname)) return;
    if (/^\/admin(\/|$)/.test(loc.pathname)) return;
    if (nav.webdriver) return;
    try { if (localStorage.getItem("aa_optout") === "1") return; } catch (e) {}
    var END = "/api/p/";

    function send(type, label) {
      var q = new URLSearchParams(loc.search);
      var body = JSON.stringify({
        t: type, p: loc.pathname, r: d.referrer || "", l: label || "",
        us: q.get("utm_source") || q.get("ref") || "", um: q.get("utm_medium") || "", uc: q.get("utm_campaign") || ""
      });
      try { if (nav.sendBeacon && nav.sendBeacon(END, new Blob([body], { type: "text/plain" }))) return; } catch (e) {}
      try { fetch(END, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } }); } catch (e) {}
    }

    w.aaTrack = function (name, label) { send(String(name).slice(0, 40), label ? String(label).slice(0, 120) : ""); };
    send("pageview");

    d.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a,button") : null;
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var text = (a.getAttribute("data-track") || a.textContent || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 80);
      if (/^mailto:/i.test(href)) return send("email_click", href.slice(7).split("?")[0]);
      if (/^tel:/i.test(href)) return send("phone_click", href.slice(4));
      if (a.tagName === "A" && a.hostname && a.hostname !== loc.hostname) {
        var h = a.hostname.replace(/^www\./, "");
        var dest = h + (a.pathname && a.pathname !== "/" ? a.pathname : "");
        if (/(^|\.)(cal\.com|calendly\.com)$/.test(h)) return send("booking_click", dest);
        if (/onrender\.com$|vercel\.app$|github\.com$|github\.io$|huggingface\.co$|streamlit\.app$|netlify\.app$|railway\.app$|vapi\.ai$/.test(h)) return send("demo_click", dest);
        return send("outbound_click", dest);
      }
      var cls = " " + (a.getAttribute("class") || "") + " ";
      if (a.hasAttribute("data-track") || /\s(btn|go|cta)[\s-]/.test(cls)) return send("cta_click", text);
    }, true);
  } catch (e) {}
})();
