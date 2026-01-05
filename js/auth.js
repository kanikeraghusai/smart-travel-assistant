// auth.js - Login and Signup Logic

// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { name: 'Demo User', email: 'demo@travel.com', password: 'demo123' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users'));
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            alert('User with this email already exists!');
            return;
        }
        
        // Create new user
        const newUser = {
            name: fullname,
            email: email,
            password: password
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        alert('Account created successfully!');
        window.location.href = 'dashboard.html';
    });
}