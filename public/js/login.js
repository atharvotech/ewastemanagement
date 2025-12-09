document.addEventListener('DOMContentLoaded', () => {
    // Create Particles
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particlesContainer.appendChild(particle);

        gsap.to(particle, {
            y: Math.random() * -100 - 50,
            x: Math.random() * 50 - 25,
            duration: Math.random() * 5 + 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 5
        });
    }

    // Initial Animation Timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate Container (Removed rotateX)
    tl.from(".login-container", {
        duration: 1.2,
        y: 50,
        opacity: 0,
        scale: 0.95
    });

    // Animate Header Elements
    tl.from(".logo-icon", {
        duration: 0.8,
        y: -30,
        opacity: 0,
        scale: 0,
        rotation: -360,
        ease: "back.out(1.7)"
    }, "-=0.6");

    tl.from(".login-header h1, .login-header p", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1
    }, "-=0.4");

    // Animate Form Elements
    tl.from(".input-group", {
        duration: 0.8,
        x: -30,
        opacity: 0,
        stagger: 0.15
    }, "-=0.4");

    tl.from(".form-actions", {
        duration: 0.8,
        opacity: 0,
        y: 10
    }, "-=0.4");

    tl.from(".login-btn", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        scale: 0.9
    }, "-=0.6");

    tl.from(".login-footer", {
        duration: 0.8,
        opacity: 0
    }, "-=0.4");

    // Magnetic Button Effect (Refined)
    const btn = document.getElementById('loginBtn');
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out" // Smoother reset, less bouncy
        });
    });

    // Micro-interaction: Forgot Password Wiggle
    const forgotPwd = document.getElementById('forgotPwd');
    forgotPwd.addEventListener('mouseenter', () => {
        gsap.to(forgotPwd, {
            x: 5,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "sine.inOut"
        });
    });

    forgotPwd.addEventListener('mouseleave', () => {
        gsap.to(forgotPwd, {
            x: 0,
            duration: 0.2
        });
    });

    // Micro-interaction: Checkbox Pop
    const rememberMe = document.getElementById('rememberMe');
    const checkmark = rememberMe.querySelector('.checkmark');

    rememberMe.addEventListener('click', () => {
        // We need to check the input state after the click event propagates
        setTimeout(() => {
            const input = rememberMe.querySelector('input');
            if (input.checked) {
                gsap.fromTo(checkmark,
                    { scale: 0.5, opacity: 0.5 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1.5, 0.5)" }
                );
            }
        }, 10);
    });
});



// ============================
// FORM VALIDATION
// ============================

const emailInput = document.getElementById('email');

// Note: The actual form element, passwordInput, and helper functions
// are defined later in the file to avoid duplicate declarations.

// form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     let email = emailInput.value.trim();
//     let password = passwordInput.value.trim();
//     let valid = true;

//     // Validate Email
//     if (email === "") {
//         showError(emailInput, "Email is required");
//         valid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         showError(emailInput, "Enter a valid email");
//         valid = false;
//     } else {
//         clearError(emailInput);
//     }

//     // Validate Password
//     if (password === "") {
//         showError(passwordInput, "Password is required");
//         valid = false;
//     } else if (password.length < 6) {
//         showError(passwordInput, "Password must be at least 6 characters");
//         valid = false;
//     } else {
//         clearError(passwordInput);
//     }

//     // If valid → submit or animate success
//     if (valid) {
//         gsap.to("#loginBtn", {
//             scale: 0.9,
//             duration: 0.2,
//             yoyo: true,
//             repeat: 1,
//             ease: "power1.out"
//         });

//         setTimeout(() => {
//             alert("Login Successful!");
//             form.submit(); // replace this with AJAX later if needed
//         }, 300);
//     }
// });

// ============================
// FORM SUBMISSION (UPDATED FOR AJAX LOGIN)
// ============================

const form = document.querySelector('.login-form');
const phoneInput = document.getElementById('phone'); // optional phone field if present
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');


// Helper to get the correct input element based on your existing code's logic
// NOTE: Your current form validation uses 'email' and 'password', but your backend uses 'phone' and 'password'.
// I am updating the logic to correctly use 'phone' if that's what your HTML inputs are named/ID'd.
// If your HTML input for phone is still 'email', you must change the ID in your HTML to 'phone' for clarity.
const input1 = phoneInput || emailInput; // Fallback if phoneInput isn't found

function showError(input, message) {
    let group = input.parentElement;

    // remove existing error
    let oldError = group.querySelector(".error-msg");
    if (oldError) oldError.remove();

    // create new error
    const error = document.createElement("p");
    error.className = "error-msg";
    error.style.color = "#ff6b6b";
    error.style.fontSize = "13px";
    error.style.marginTop = "6px";
    error.textContent = message;

    group.appendChild(error);

    gsap.from(error, {
        opacity: 0,
        y: -5,
        duration: 0.3
    });
}

function clearError(input) {
    let group = input.parentElement;
    let error = group.querySelector(".error-msg");
    if (error) error.remove();
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = input1.value.trim(); // Use email/phone input value
    let password = passwordInput.value.trim();
    let valid = true;

    // NOTE: I am using the Phone field for validation based on your backend logic.
    // If your input is named 'email' in the HTML, you should update it to 'phone' for consistency.

    // Validate Email/Phone (used as the primary login identifier)
    if (email === "") {
        showError(input1, "Email is required");
        valid = false;
    } else {
        clearError(input1);
    }

    // Validate Password
    if (password === "") {
        showError(passwordInput, "Password is required");
        valid = false;
    } else {
        clearError(passwordInput);
    }

    if (!valid) return;

    // Start loading state/animation
    loginBtn.disabled = true;
    loginBtn.querySelector('span')?.classList.add('loading');

    gsap.to(loginBtn, { scale: 0.9, duration: 0.2 });


    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // SUCCESS: Save auth token and user info to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            alert('Login Successful! Welcome, ' + data.user.fullName);
            window.location.href = '/dashboard'; // Redirect to dashboard
        } else {
            // FAILURE
            if (res.status === 404 && data.message.includes('register')) {
                // User not found
                alert('Account not found. Redirecting to registration.');
                window.location.href = '/register';
            } else {
                // Invalid password or other server error
                alert('Login Failed: ' + data.message);
            }
        }
    } catch (err) {
        alert('A network error occurred. Check server connection.');
    } finally {
        // Stop loading state/animation
        loginBtn.disabled = false;
        loginBtn.querySelector('span')?.classList.remove('loading');
        gsap.to(loginBtn, { scale: 1, duration: 0.2 });
    }
});

let currentUser = null;
let authToken = null;
async function initializeDashboard() {
    // Check if user is logged in
    authToken = localStorage.getItem('authToken');
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (authToken || currentUser) {
        // Redirect to login if not authenticated
        window.location.href = '/dashboard';
        return;
    }
}
initializeDashboard();