document.documentElement.classList.remove("no-js")

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Top bar border once the page scrolls
const topbar = document.querySelector(".topbar")
const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 8)
window.addEventListener("scroll", onScroll, { passive: true })
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

// Reveal on scroll, staggered within each batch
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((e) => e.isIntersecting)
      .forEach((e, i) => {
        e.target.style.transitionDelay = reduceMotion ? "0ms" : `${Math.min(i, 5) * 80}ms`
        e.target.classList.add("in")
        revealObserver.unobserve(e.target)
      })
  },
  { threshold: 0.01, rootMargin: "0px 0px -60px 0px" },
)
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el))

// Flow diagram lights up step by step; the timeline strip slides in the same way
const stepObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((e) => e.isIntersecting)
      .forEach((e) => {
        const items = e.target.querySelectorAll(".flow-step, .strip li")
        items.forEach((item, i) => (item.style.transitionDelay = reduceMotion ? "0ms" : `${200 + i * 160}ms`))
        e.target.classList.add("on", "in")
        stepObserver.unobserve(e.target)
      })
  },
  { threshold: 0.4 },
)
document.querySelectorAll("[data-flow], .strip").forEach((el) => stepObserver.observe(el))

// Count-up for the highlight numbers
const countObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((e) => e.isIntersecting)
      .forEach((e) => {
        const el = e.target
        const end = Number(el.dataset.count)
        countObserver.unobserve(el)
        if (reduceMotion) return
        const start = performance.now()
        const dur = 1200
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1)
          el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
  },
  { threshold: 0.6 },
)
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el))

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

// Contact form, sent to Formspree without leaving the page
const form = document.getElementById("contact-form")
const status = document.getElementById("form-status")
form.addEventListener("submit", (e) => {
  e.preventDefault()
  status.textContent = "Sending…"
  const button = form.querySelector("button[type=submit]")
  button.disabled = true
  // Accept: application/json makes Formspree answer with JSON instead of redirecting
  // to its thank-you page, which the browser would block as a cross-origin redirect
  fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
    .then(async (response) => {
      if (response.ok) {
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

// Light / dark toggle; the choice is remembered, otherwise the system setting wins
const root = document.documentElement
const themeBtn = document.getElementById("theme-btn")
const systemDark = window.matchMedia("(prefers-color-scheme: dark)")
const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light")
const syncThemeLabel = () => {
  const next = currentTheme() === "dark" ? "light" : "dark"
  themeBtn.setAttribute("aria-label", `Switch to ${next} mode`)
}
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark"
  root.classList.add("theme-anim")
  root.dataset.theme = next
  try {
    localStorage.setItem("theme", next)
  } catch {}
  syncThemeLabel()
  setTimeout(() => root.classList.remove("theme-anim"), 400)
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

// Split the headline into words so they can rise in sequence
const headline = document.querySelector(".display")
if (headline && !reduceMotion) {
  let i = 0
  const wrapWords = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) return frag.append(part)
          const span = document.createElement("span")
          span.className = "w"
          span.style.animationDelay = `${120 + i++ * 45}ms`
          span.textContent = part
          frag.append(span)
        })
        child.replaceWith(frag)
      } else {
        wrapWords(child)
      }
    })
  }
  wrapWords(headline)
  headline.classList.remove("reveal")
}

// Project screenshots
const PROJECTS = {
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

function closeProjectModal() {
  modal.close()
}

modal.addEventListener("close", () => (document.body.style.overflow = ""))
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeProjectModal()
})
document.getElementById("modal-close").addEventListener("click", closeProjectModal)
document.querySelectorAll("[data-modal]").forEach((btn) =>
  btn.addEventListener("click", () => openProjectModal(btn.dataset.modal)),
)
