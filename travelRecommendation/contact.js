// ===== CONTACT.JS - RANA TOURS=====

document.addEventListener('DOMContentLoaded', function() {

    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Form submit hone par
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Page reload roko

        // 1. Values le lo aur trim karo
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // 2. Validation
        if (name === '') {
            showMessage('Please enter your name', 'error');
            nameInput.focus();
            return;
        }

        if (email === '' || !isValidEmail(email)) {
            showMessage('Please enter a valid email', 'error');
            emailInput.focus();
            return;
        }

        if (message === '') {
            showMessage('Please enter your message', 'error');
            messageInput.focus();
            return;
        }

        // 3. Agar sab sahi hai to data object banao
        const formData = {
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleString() // Submit time save kar lo
        };

        // 4. LocalStorage me save karo - Demo ke liye
        saveToLocalStorage(formData);

        // 5. Success message dikhao
        showMessage('Thank you! Your message has been sent successfully.', 'success');

        // 6. Form clear kar do
        contactForm.reset();
    });


    // ===== HELPER FUNCTIONS =====

    // Email check karne ke liye
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Message show karne ke liye
    function showMessage(text, type) {
        // Pehle wala message hatao
        const oldMsg = document.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.classList.add('form-message', type);
        msgDiv.textContent = text;

        contactForm.prepend(msgDiv);

        // 3 sec baad auto hide
        setTimeout(() => {
            msgDiv.remove();
        }, 3000);
    }

    // LocalStorage me save karne ke liye
    function saveToLocalStorage(data) {
        // Pehle wale messages le lo
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        
        // Naya message add karo
        messages.push(data);
        
        // Wapas save karo
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        console.log('Message Saved:', data);
    }

});