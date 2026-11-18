
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const alertBox = document.getElementById('alert-box');
const authBox = document.getElementById('auth-box');
const dashboardBox = document.getElementById('dashboard-box');


window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        document.getElementById('login-email').value = savedEmail;
        document.getElementById('remember-me').checked = true;
    }

    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    if (activeUser) {
        showDashboard(activeUser);
    }
});


function switchTab(tab) {
    clearAlert();
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}


function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Ocultar';
    } else {
        input.type = 'password';
        btn.textContent = 'Mostrar';
    }
}


function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
}

function clearAlert() {
    alertBox.className = 'alert hidden';
    alertBox.textContent = '';
}


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;

    if (password !== confirmPassword) {
        showAlert('As senhas não coincidem.', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('usersDB')) || [];

    
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        showAlert('Este e-mail já está cadastrado.', 'error');
        return;
    }

    
    users.push({ name, email, password });
    localStorage.setItem('usersDB', JSON.stringify(users));

    registerForm.reset();
    switchTab('login');
    showAlert('Conta criada com sucesso! Faça login para continuar.', 'success');
});


loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    const users = JSON.parse(localStorage.getItem('usersDB')) || [];
    const validUser = users.find(user => user.email === email && user.password === password);

    if (!validUser) {
        showAlert('E-mail ou senha incorretos.', 'error');
        return;
    }

    
    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    
    sessionStorage.setItem('activeUser', JSON.stringify(validUser));
    showDashboard(validUser);
});


function forgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    if (!email) {
        showAlert('Digite seu e-mail no campo acima antes de clicar em "Esqueceu a senha?".', 'error');
        return;
    }
    showAlert(`Se o e-mail ${email} estiver cadastrado, um link de redefinição foi enviado.`, 'success');
}


function showDashboard(user) {
    authBox.classList.add('hidden');
    dashboardBox.classList.remove('hidden');
    document.getElementById('user-display-name').textContent = user.name;
    document.getElementById('user-display-email').textContent = user.email;
}


function logout() {
    sessionStorage.removeItem('activeUser');
    dashboardBox.classList.add('hidden');
    authBox.classList.remove('hidden');
    document.getElementById('login-password').value = '';
    clearAlert();
}