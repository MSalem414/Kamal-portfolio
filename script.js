(function () {
  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }



  var themeToggle = document.getElementById("themeToggle");
  var themeColor = document.getElementById("themeColor");
  var root = document.body;
  var storageKey = "kamal-portfolio-theme";

  function getPreferredTheme() {
    try {
      var savedTheme = localStorage.getItem(storageKey);
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    } catch (error) {}

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    return "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    root.classList.toggle("light-mode", theme === "light");

    if (themeColor) {
      themeColor.setAttribute("content", theme === "light" ? "#eef5ff" : "#0b1120");
    }

    if (themeToggle) {
      var nextTheme = theme === "light" ? "dark" : "light";
      themeToggle.setAttribute("aria-label", "Switch to " + nextTheme + " mode");
      themeToggle.setAttribute("aria-pressed", String(theme === "light"));
      var label = themeToggle.querySelector(".theme-toggle-text");
      if (label) {
        label.textContent = theme === "light" ? "Dark" : "Light";
      }
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var currentTheme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var newTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {}
    });
  }

  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    Array.prototype.forEach.call(navLinks.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var filters = document.querySelectorAll(".filter-btn");
  var projects = document.querySelectorAll(".project-card");
  Array.prototype.forEach.call(filters, function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter") || "all";

      Array.prototype.forEach.call(filters, function (item) {
        item.classList.toggle("active", item === button);
      });

      Array.prototype.forEach.call(projects, function (card) {
        var tags = card.getAttribute("data-tags") || "";
        var shouldShow = filter === "all" || tags.indexOf(filter) !== -1;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var formData = new FormData(form);
      var name = String(formData.get("name") || "").trim();
      var email = String(formData.get("email") || "").trim();
      var message = String(formData.get("message") || "").trim();
      var subject = encodeURIComponent("Portfolio Contact - " + (name || "New message"));
      var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message);
      window.location.href = "mailto:Kamalelsayed118@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    Array.prototype.forEach.call(revealItems, function (item) {
      observer.observe(item);
    });
  } else {
    Array.prototype.forEach.call(revealItems, function (item) {
      item.classList.add("is-visible");
    });
  }

  var glow = document.getElementById("cursorGlow");
  var floatingIcons = document.querySelectorAll(".float-action");
  var magneticItems = document.querySelectorAll(".magnetic");

  function setNumber(element, name, value) {
    element.style.setProperty(name, String(Number(value).toFixed(2)));
  }

  function updateFloatingIcon(icon, mouseX, mouseY) {
    var rect = icon.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var dx = mouseX - centerX;
    var dy = mouseY - centerY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var range = 210;

    if (distance < range) {
      var strength = 1 - distance / range;
      icon.classList.add("is-near");
      setNumber(icon, "--mag-x", dx * 0.13 * strength);
      setNumber(icon, "--mag-y", dy * 0.13 * strength);
      setNumber(icon, "--tilt-x", dx * 0.08 * strength);
      setNumber(icon, "--tilt-y", dy * 0.08 * strength);
      setNumber(icon, "--mag-scale", 1 + strength * 0.17);
    } else {
      icon.classList.remove("is-near");
      icon.style.setProperty("--mag-x", "0");
      icon.style.setProperty("--mag-y", "0");
      icon.style.setProperty("--tilt-x", "0");
      icon.style.setProperty("--tilt-y", "0");
      icon.style.setProperty("--mag-scale", "1");
    }
  }

  function updateButtonLight(button, mouseX, mouseY) {
    var rect = button.getBoundingClientRect();
    setNumber(button, "--mx", mouseX - rect.left - rect.width / 2);
    setNumber(button, "--my", mouseY - rect.top - rect.height / 2);
  }

  document.addEventListener("mousemove", function (event) {
    if (glow) {
      glow.style.transform = "translate3d(" + event.clientX + "px, " + event.clientY + "px, 0)";
    }

    Array.prototype.forEach.call(floatingIcons, function (icon) {
      updateFloatingIcon(icon, event.clientX, event.clientY);
    });
  });

  Array.prototype.forEach.call(magneticItems, function (button) {
    button.addEventListener("mousemove", function (event) {
      updateButtonLight(button, event.clientX, event.clientY);
    });
  });
})();
