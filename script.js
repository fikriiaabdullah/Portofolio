document.documentElement.classList.remove("no-js")

const root = document.documentElement
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Scroll-driven bits (top bar border, reading progress, timeline line) share one rAF per frame
const topbar = document.querySelector(".topbar")
const progress = document.querySelector(".progress")
const timeline = document.querySelector(".timeline")
const tlItems = timeline ? [...timeline.children] : []
let ticking = false

function onScroll() {
  const y = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  topbar.classList.toggle("scrolled", y > 8)
  progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0)

  if (timeline) {
    const rect = timeline.getBoundingClientRect()
    const mark = window.innerHeight * 0.6
    const filled = Math.min(Math.max((mark - rect.top) / rect.height, 0), 1)
    timeline.style.setProperty("--tl", filled.toFixed(4))
    tlItems.forEach((li) => li.classList.toggle("lit", li.getBoundingClientRect().top + 12 < mark))
  }
  ticking = false
}
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(onScroll)
    }
  },
  { passive: true },
)
window.addEventListener("resize", onScroll)
onScroll()

// Mobile menu
const menuBtn = document.getElementById("menu-btn")
const nav = document.getElementById("nav")
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open")
  menuBtn.setAttribute("aria-expanded", String(open))
})
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open")
    menuBtn.setAttribute("aria-expanded", "false")
  }),
)

// Reveal on scroll; elements entering together are staggered
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((e) => e.isIntersecting)
      .forEach((e, i) => {
        e.target.style.transitionDelay = reduceMotion ? "0ms" : `${Math.min(i, 6) * 90}ms`
        e.target.classList.add("in")
        revealObserver.unobserve(e.target)
      })
  },
  { threshold: 0.01, rootMargin: "0px 0px -60px 0px" },
)
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el))

// Clear the stagger delay once revealed so hover transitions stay snappy
document.addEventListener("transitionend", (e) => {
  if (e.target.classList?.contains("reveal") && e.propertyName === "transform") e.target.style.transitionDelay = ""
})

// Highlight the nav link of the section in view
const links = [...nav.querySelectorAll("a")]
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`))
    })
  },
  { rootMargin: "-45% 0px -50% 0px" },
)
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s))

// Soft spotlight that follows the pointer on the WIKA cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect()
    card.style.setProperty("--mx", `${e.clientX - r.left}px`)
    card.style.setProperty("--my", `${e.clientY - r.top}px`)
  })
})

// Kendali Proyek showcase: tabs switch screens, and it auto-advances while in view
const showcase = document.querySelector(".showcase")
if (showcase) {
  const tabs = [...showcase.querySelectorAll("[data-shot]")]
  const shots = [...showcase.querySelectorAll(".shot")]
  const DWELL = 5000
  showcase.style.setProperty("--dwell", `${DWELL}ms`)
  let current = 0
  let timer = null

  const show = (i) => {
    current = i
    tabs.forEach((t, k) => t.setAttribute("aria-selected", String(k === i)))
    shots.forEach((s, k) => s.classList.toggle("is-on", k === i))
    // Restart the timer bar animation on the newly selected tab
    showcase.classList.remove("playing")
    void showcase.offsetWidth
    if (timer) showcase.classList.add("playing")
  }
  const play = () => {
    if (reduceMotion || timer) return
    timer = setInterval(() => show((current + 1) % shots.length), DWELL)
    showcase.classList.add("playing")
  }
  const stop = () => {
    clearInterval(timer)
    timer = null
    showcase.classList.remove("playing")
  }

  tabs.forEach((t, i) =>
    t.addEventListener("click", () => {
      stop()
      show(i)
    }),
  )
  new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.4 }).observe(showcase)
}

// Light / dark toggle; the choice is remembered, otherwise the system setting wins
const themeBtn = document.getElementById("theme-btn")
const systemDark = window.matchMedia("(prefers-color-scheme: dark)")
const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light")
const syncThemeLabel = () =>
  themeBtn.setAttribute("aria-label", `Switch to ${currentTheme() === "dark" ? "light" : "dark"} mode`)

themeBtn.addEventListener("click", (e) => {
  const next = currentTheme() === "dark" ? "light" : "dark"
  const apply = () => {
    root.dataset.theme = next
    syncThemeLabel()
  }
  try {
    localStorage.setItem("theme", next)
  } catch {}
  if (!document.startViewTransition || reduceMotion) return apply()
  // Grow the new theme out of the button
  root.style.setProperty("--vx", `${e.clientX}px`)
  root.style.setProperty("--vy", `${e.clientY}px`)
  document.startViewTransition(apply)
})
systemDark.addEventListener("change", () => {
  let saved = null
  try {
    saved = localStorage.getItem("theme")
  } catch {}
  if (!saved) {
    delete root.dataset.theme
    syncThemeLabel()
  }
})
syncThemeLabel()

// Contact form, sent to Formspree without leaving the page
const form = document.getElementById("contact-form")
const status = document.getElementById("form-status")
form.addEventListener("submit", (e) => {
  e.preventDefault()
  const button = form.querySelector("button[type=submit]")
  button.disabled = true
  status.className = "form-status"
  status.textContent = "Sending…"
  // Accept: application/json makes Formspree answer with JSON instead of redirecting
  // to its thank-you page, which the browser would block as a cross-origin redirect
  fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
    .then(async (response) => {
      if (response.ok) {
        status.classList.add("ok")
        status.textContent = "Thanks, your message is in. I'll get back to you soon."
        form.reset()
        return
      }
      const data = await response.json().catch(() => ({}))
      const reason = (data.errors || []).map((err) => err.message).join(" ")
      status.textContent = `Couldn't send${reason ? `: ${reason}` : ""}. Please email me directly.`
    })
    .catch((error) => {
      console.error("Error submitting form:", error)
      status.textContent = "Couldn't reach the mail service. Please email me directly."
    })
    .finally(() => (button.disabled = false))
})

// Project screenshots
const PROJECTS = {
  kendali: {
    title: "Kendali Proyek WIKA",
    shots: [
      ["kendali-dashboard.webp", "Dashboard", "Every project in one table: which documents have come in per category and how each schedule is doing."],
      ["kendali-schedule.webp", "Schedule health", "Schedules are checked automatically against WIKA's targets, without renting Oracle tools for it."],
      ["kendali-lps.webp", "Last Planner System", "Weekly plan completion, readiness, and site constraints, read from the Last Planner reports and followed online."],
      ["kendali-progress.webp", "Weekly progress", "Actual progress plotted against the planned S-curve, with gaps in the reports shown instead of filled in."],
    ],
  },
  ziyadbook: {
    title: "Ziyadbook E-commerce",
    shots: [
      ["ecommerce-home.webp", "Homepage", "Responsive landing page with featured products, categories, and promotional banners, built with Tailwind CSS."],
      ["ecommerce-products.webp", "Product catalog", "Product listing with filtering, search, and pagination, backed by Laravel's Eloquent ORM."],
      ["ecommerce-cart.webp", "Shopping cart", "Cart with live updates, quantity adjustments, and shipping cost calculation through the Raja Ongkir API."],
      ["ecommerce-checkout.webp", "Checkout", "Checkout flow with multiple payment options, address validation, and Meta Pixel conversion tracking."],
      ["ecommerce-admin.webp", "Admin dashboard", "Admin panel for products, orders, customers, and analytics, using Laravel's authentication and authorization."],
    ],
  },
}

const modal = document.getElementById("project-modal")
const modalTitle = document.getElementById("modal-title")
const modalBody = document.getElementById("modal-body")

function openProjectModal(projectId) {
  const project = PROJECTS[projectId]
  if (!project) return
  modalTitle.textContent = project.title
  modalBody.innerHTML = project.shots
    .map(
      ([file, name, desc]) => `
        <figure>
          <img src="assets/${file}" alt="${name}" loading="lazy">
          <figcaption><b>${name}.</b> ${desc}</figcaption>
        </figure>`,
    )
    .join("")
  modal.showModal()
  document.body.style.overflow = "hidden"
}

modal.addEventListener("close", () => (document.body.style.overflow = ""))
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close()
})
document.getElementById("modal-close").addEventListener("click", () => modal.close())
document.querySelectorAll("[data-modal]").forEach((btn) =>
  btn.addEventListener("click", () => openProjectModal(btn.dataset.modal)),
)
