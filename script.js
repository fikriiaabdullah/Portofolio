// Mobile menu toggle
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("mobile-menu").classList.toggle("hidden")
})

// Initialize Typed.js
const typed = new Typed("#typed-text", {
  strings: ["AI Engineer", "Machine Learning Specialist", "Full Stack Developer", "Data Scientist"],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 1500,
  startDelay: 500,
  loop: true,
})

// Initialize particles.js
particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: ["#3b82f6", "#8b5cf6", "#ec4899"],
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#3b82f6",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 1,
        },
      },
      push: {
        particles_nb: 4,
      },
    },
  },
  retina_detect: true,
})

// Custom cursor
const cursor = document.querySelector(".cursor")
const cursorFollower = document.querySelector(".cursor-follower")

document.addEventListener("mousemove", (e) => {
  cursor.style.display = "block"
  cursorFollower.style.display = "block"
  cursor.style.left = e.clientX + "px"
  cursor.style.top = e.clientY + "px"

  setTimeout(() => {
    cursorFollower.style.left = e.clientX + "px"
    cursorFollower.style.top = e.clientY + "px"
  }, 100)
})

document.addEventListener("mouseout", () => {
  cursor.style.display = "none"
  cursorFollower.style.display = "none"
})

// GSAP Animations
document.addEventListener("DOMContentLoaded", () => {
  // Hero section animations
  gsap.to(".text-animation", {
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
  })

  gsap.to("#profile-card", {
    opacity: 1,
    scale: 1,
    rotation: 5,
    duration: 1.2,
    delay: 0.5,
    ease: "elastic.out(1, 0.5)",
  })

  // Profile card 3D effect
  const card = document.querySelector("#profile-card")
  document.addEventListener("mousemove", (e) => {
    if (window.innerWidth > 768) {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25
      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`
    }
  })

  // Reset card on mouse leave
  document.addEventListener("mouseleave", () => {
    card.style.transform = "rotateY(0deg) rotateX(0deg)"
  })

  // About section animations with ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  gsap.to(".about-text", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 0.8,
  })

  gsap.to(".about-stat", {
    scrollTrigger: {
      trigger: ".about-stat",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    stagger: 0.15,
    duration: 0.6,
  })

  // Timeline animations
  gsap.to(".timeline-item", {
    scrollTrigger: {
      trigger: "#experience",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    x: 0,
    stagger: 0.2,
    duration: 0.8,
  })

  // Project card animations
  gsap.to(".project-card", {
    scrollTrigger: {
      trigger: "#projects",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    stagger: 0.15,
    duration: 0.6,
  })

  // Skills animations
  gsap.to(".skill-item", {
    scrollTrigger: {
      trigger: "#skills",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    x: 0,
    stagger: 0.1,
    duration: 0.6,
    onComplete: animateSkillBars,
  })

  gsap.to(".skill-pill", {
    scrollTrigger: {
      trigger: ".skill-pill",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    scale: 1,
    stagger: 0.05,
    duration: 0.4,
  })

  // Function to animate skill progress bars
  function animateSkillBars() {
    document.querySelectorAll(".skill-progress-bar").forEach((bar) => {
      const width = bar.getAttribute("data-width") + "%"
      gsap.to(bar, {
        width: width,
        duration: 1.5,
        ease: "power2.out",
      })
    })
  }

  // Wavy background animation
  const wavyBg = document.querySelector(".wavy-bg")
  if (wavyBg) {
    let posX = 0
    let posY = 0
    let mouseX = 0
    let mouseY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5
      mouseY = e.clientY / window.innerHeight - 0.5
    })

    gsap.ticker.add(() => {
      posX += (mouseX - posX) * 0.05
      posY += (mouseY - posY) * 0.05
      gsap.set(wavyBg, {
        x: posX * 20,
        y: posY * 20,
        rotation: posX * 5,
      })
    })
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      })

      // Close mobile menu if open
      document.getElementById("mobile-menu").classList.add("hidden")
    }
  })
})

// Form submission handling
const contactForm = document.querySelector("#contact form")
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    // Simple validation
    if (!name || !email || !message) {
      alert("Please fill in all fields")
      return
    }

    // Create form data object
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("message", message)

    // Send the data to Formspree
    fetch("https://formspree.io/f/movdvppn", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Thank you for your message! I will get back to you soon.")
          contactForm.reset()
        } else {
          alert("Something went wrong. Please try again later.")
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error)
        alert("Ini ga error kok aslinya, tetap masuk ya hehe")
      })
  })
}

// Project Modal Functions
function openProjectModal(projectId) {
  const modal = document.getElementById("projectModal")
  const modalTitle = document.getElementById("modalTitle")
  const modalContent = document.getElementById("modalContent")

  // Set modal title and content based on project
  if (projectId === "ziyadbook") {
    modalTitle.textContent = "Ziyadbook E-commerce Platform"
    modalContent.innerHTML = `
            <div class="screenshot-item">
                <img src="assets/ecommerce-home.png" alt="Homepage" onerror="this.src='/placeholder.svg?height=400&width=600'">
                <div class="screenshot-description">
                    <strong>Homepage:</strong> Modern and responsive landing page with featured products, categories, and promotional banners. Built with Tailwind CSS for optimal user experience.
                </div>
            </div>
            <div class="screenshot-item">
                <img src="assets/ecommerce-products.png" alt="Product Catalog" onerror="this.src='/placeholder.svg?height=400&width=600'">
                <div class="screenshot-description">
                    <strong>Product Catalog:</strong> Comprehensive product listing with advanced filtering, search functionality, and pagination. Integrated with Laravel's Eloquent ORM for efficient data management.
                </div>
            </div>
            <div class="screenshot-item">
                <img src="assets/ecommerce-cart.png" alt="Shopping Cart" onerror="this.src='/placeholder.svg?height=400&width=600'">
                <div class="screenshot-description">
                    <strong>Shopping Cart:</strong> Interactive shopping cart with real-time updates, quantity adjustments, and shipping cost calculation using Raja Ongkir API.
                </div>
            </div>
            <div class="screenshot-item">
                <img src="assets/ecommerce-checkout.png" alt="Checkout Process" onerror="this.src='/placeholder.svg?height=400&width=600'">
                <div class="screenshot-description">
                    <strong>Checkout Process:</strong> Streamlined checkout flow with multiple payment options, address validation, and Meta Pixel integration for conversion tracking.
                </div>
            </div>
            <div class="screenshot-item">
                <img src="assets/ecommerce-admin.png" alt="Admin Dashboard" onerror="this.src='/placeholder.svg?height=400&width=600'">
                <div class="screenshot-description">
                    <strong>Admin Dashboard:</strong> Comprehensive admin panel for managing products, orders, customers, and analytics. Built with Laravel's authentication and authorization system.
                </div>
            </div>
        `
  }

  // Show modal with animation
  modal.classList.remove("hidden")
  setTimeout(() => {
    modal.classList.add("show")
  }, 10)

  // Prevent body scroll
  document.body.style.overflow = "hidden"
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal")

  // Hide modal with animation
  modal.classList.remove("show")
  setTimeout(() => {
    modal.classList.add("hidden")
    document.body.style.overflow = "auto"
  }, 300)
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modal = document.getElementById("projectModal")
  if (e.target === modal) {
    closeProjectModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProjectModal()
  }
})

// Make functions global so they can be called from HTML
window.openProjectModal = openProjectModal
window.closeProjectModal = closeProjectModal
