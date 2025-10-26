// Form handling and submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('complaintForm');
    const statusDiv = document.getElementById('formStatus');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const complaintData = {
            message: formData.get('complaintMessage'),
            timestamp: new Date().toISOString()
        };
        
        // Store complaint in localStorage
        const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
        complaints.push(complaintData);
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        // Show success message
        showStatus('Complaint submitted successfully! Anay will be notified.', 'success');
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
    
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        statusDiv.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
    
    // Add some interactive effects
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Character counter for textarea
    const messageTextarea = document.getElementById('complaintMessage');
    const maxLength = 2000;
    
    messageTextarea.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        let counter = document.getElementById('charCounter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'charCounter';
            counter.style.cssText = 'text-align: right; color: #666; font-size: 0.9rem; margin-top: 0.5rem;';
            this.parentElement.appendChild(counter);
        }
        
        counter.textContent = `${remaining} characters remaining`;
        
        if (remaining < 100) {
            counter.style.color = '#e74c3c';
        } else if (remaining < 300) {
            counter.style.color = '#f39c12';
        } else {
            counter.style.color = '#666';
        }
    });
});
