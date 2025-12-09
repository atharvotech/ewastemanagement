// COUNTERS
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

