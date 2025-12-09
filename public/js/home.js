
        // Initialize GSAP Animations
        document.addEventListener("DOMContentLoaded", () => {
            

            // 1. Header Elements
            tl.from(".logo-anim", {
                y: -20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            .from(".search-anim", {
                y: -20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.6")
            .from(".nav-links-anim a", {
                y: -20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.6");

            // 2. Main Content
            tl.from(".hero-text-anim", {
                x: -50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            }, "-=0.4");

            tl.from(".hero-btn-anim", {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            }, "-=0.4");

            // 3. Image Section
            tl.from(".image-container-anim", {
                x: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=1.2");
            
            tl.from(".main-image", {
                scale: 0.8,
                duration: 1.2,
                ease: "power3.out"
            }, "-=1.0");

            // 4. Social Icons
            tl.from(".social-anim a", {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.5");

            // 5. Background Elements (Subtle entrance)
            gsap.from(".shape-yellow", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            });
            gsap.from(".shape-blue", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                delay: 0.2,
                ease: "power2.out"
            });
        });



// data 

/ COUNTERS
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute("data-target");
    const current = +counter.innerText;
    const inc = target / 200;

    if (current < target) {
      counter.innerText = Math.ceil(current + inc);
      setTimeout(updateCount, 10);
    } else {
      counter.innerText = target;
    }
  };
  updateCount();
});

// PIE CHART
const branchData = {
  labels: ["North", "South", "East", "West"],
  values: [6, 5, 7, 4]
};

const preferredBranch = branchData.labels[
  branchData.values.indexOf(Math.max(...branchData.values))
];

document.getElementById("preferredBranch").innerText = preferredBranch;

const ctx = document.getElementById("pieChart").getContext("2d");

new Chart(ctx, {
  type: "pie",
  data: {
    labels: branchData.labels,
    datasets: [{
      backgroundColor: ["#2e7d32", "#66bb6a", "#a5d6a7", "#388e3c"],
      data: branchData.values,
    }],
  },
  options: {
    responsive: false
  }
});

// FILTERS
function applyFilters() {
  alert("Filters applied!");
}





















