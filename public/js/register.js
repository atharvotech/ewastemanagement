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

	// Animation Timeline
	const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

	tl.from(".login-container", {
		duration: 1.2,
		y: 50,
		opacity: 0,
		scale: 0.95
	});

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

	// Magnetic Button Effect (Register)
	const btn = document.getElementById('registerBtn');
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
			ease: "power2.out"
		});
	});

	// Micro interactions
	const helpReg = document.getElementById('helpReg');
	helpReg.addEventListener('mouseenter', () => {
		gsap.to(helpReg, { x: 5, duration: 0.1, yoyo: true, repeat: 3, ease: 'sine.inOut' });
	});
	helpReg.addEventListener('mouseleave', () => gsap.to(helpReg, { x: 0, duration: 0.2 }));

	const terms = document.getElementById('terms');
	terms.addEventListener('click', () => {
		setTimeout(() => {
			const input = terms.querySelector('input');
			const checkmark = terms.querySelector('.checkmark');
			if (input.checked) {
				// visual check animation
				gsap.fromTo(checkmark, { scale: 0.6, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.5)' });
				// clear checkbox error state if present
				terms.classList.remove('has-error');
				const existing = terms.parentElement.querySelector('.error-msg');
				if (existing) existing.remove();
			}
		}, 10);
	});
});


// ============================
// FORM VALIDATION / SUBMIT
// ============================

const regForm = document.querySelector('.register-form');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const termsInput = document.getElementById('acceptTerms');
const registerBtn = document.getElementById('registerBtn');

function showError(inputOrContainer, message) {
	// If the input is the checkbox container (label.checkbox-container), handle differently
	if (inputOrContainer && inputOrContainer.classList && inputOrContainer.classList.contains('checkbox-container')) {
		// remove any existing message within form-actions
		const parent = inputOrContainer.parentElement;
		let oldErr = parent.querySelector('.error-msg');
		if (oldErr) oldErr.remove();

		const error = document.createElement('p');
		error.className = 'error-msg';
		error.style.color = '#ff6b6b';
		error.style.fontSize = '13px';
		error.style.marginTop = '6px';
		error.id = 'termsError';
		error.textContent = message;

		// mark checkbox visually as error and insert the message right after the checkbox label
		inputOrContainer.classList.add('has-error');
		inputOrContainer.after(error);
		gsap.from(error, { opacity: 0, y: -5, duration: 0.25 });
		return;
	}

	// default behavior: regular input groups
	let group = inputOrContainer.parentElement;

	// remove existing error
	let oldError = group.querySelector('.error-msg');
	if (oldError) oldError.remove();

	const error = document.createElement('p');
	error.className = 'error-msg';
	error.style.color = '#ff6b6b';
	error.style.fontSize = '13px';
	error.style.marginTop = '6px';
	error.textContent = message;

	group.appendChild(error);

	gsap.from(error, { opacity: 0, y: -5, duration: 0.25 });
}

function clearError(inputOrContainer) {
	// checkbox container
	if (inputOrContainer && inputOrContainer.classList && inputOrContainer.classList.contains('checkbox-container')) {
		let oldError = inputOrContainer.parentElement.querySelector('.error-msg');
		if (oldError) oldError.remove();
		inputOrContainer.classList.remove('has-error');
		return;
	}

	let oldError = inputOrContainer.parentElement.querySelector('.error-msg');
	if (oldError) oldError.remove();
}

function validEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

regForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	let fullName = fullNameInput.value.trim();
	let email = emailInput.value.trim();
	let password = passwordInput.value.trim();
	let confirm = confirmInput.value.trim();

	let valid = true;

	if (fullName === '') { showError(fullNameInput, 'Full name is required'); valid = false; } else clearError(fullNameInput);

	if (email === '') { showError(emailInput, 'Email is required'); valid = false; }
	else if (!validEmail(email)) { showError(emailInput, 'Enter a valid email'); valid = false; }
	else clearError(emailInput);

	if (password === '') { showError(passwordInput, 'Password is required'); valid = false; }
	else if (password.length < 6) { showError(passwordInput, 'Password must be at least 6 characters'); valid = false; }
	else clearError(passwordInput);

	if (confirm === '') { showError(confirmInput, 'Please confirm password'); valid = false; }
	else if (confirm !== password) { showError(confirmInput, 'Passwords do not match'); valid = false; }
	else clearError(confirmInput);

	if (!termsInput.checked) { showError(termsInput.closest('.checkbox-container'), 'You must accept the terms'); valid = false; } else clearError(termsInput.closest('.checkbox-container'));

	if (!valid) return;

	// Loading state
	registerBtn.disabled = true;
	registerBtn.querySelector('span')?.classList.add('loading');
	gsap.to(registerBtn, { scale: 0.95, duration: 0.15 });

	try {
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fullName, email, password })
		});

		const data = await res.json();

		if (res.ok) {
			alert('Registration successful — please sign in');
			window.location.href = '/login';
		} else {
			// Show server-side error or message
			alert('Registration Failed: ' + (data.message || 'Check your details and try again'));
		}
	} catch (err) {
		alert('Network error: could not contact server');
	} finally {
		registerBtn.disabled = false;
		registerBtn.querySelector('span')?.classList.remove('loading');
		gsap.to(registerBtn, { scale: 1, duration: 0.15 });
	}
});

