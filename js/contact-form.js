// contact-form.js - Contact form handling with validation

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');

    if (!form) return;

    // Form validation
    const validateField = (field) => {
        const errorSpan = field.parentElement.querySelector('.form-error');
        let isValid = true;
        let message = '';

        // Check if required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email';
            }
        }

        // Update UI
        if (!isValid) {
            field.classList.add('error');
            if (errorSpan) errorSpan.textContent = message;
        } else {
            field.classList.remove('error');
            if (errorSpan) errorSpan.textContent = '';
        }

        return isValid;
    };

    // Real-time validation on blur
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Focus first error field
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        // Disable submit button
        const submitButton = form.querySelector('.form-submit');
        const originalText = submitButton.querySelector('.button-text').textContent;
        submitButton.disabled = true;
        submitButton.querySelector('.button-text').textContent = 'Sending...';

        try {
            // Get form data
            const formData = new FormData(form);

            // Submit to Formspree (or your chosen backend)
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                form.hidden = true;
                successMessage.hidden = false;
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form error:', error);
            form.hidden = true;
            errorMessage.hidden = false;
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.querySelector('.button-text').textContent = originalText;
        }
    });
});
