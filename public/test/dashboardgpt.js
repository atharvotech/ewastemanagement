const form = document.getElementById("ewasteForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", function(e) {
    e.preventDefault();
    msg.textContent = "Your e-waste pickup request has been submitted ✔";
    msg.style.color = "#869C81";

    setTimeout(() => msg.textContent = "", 4000);

    form.reset();
});
