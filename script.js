document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- Sticky Navbar Styling ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-md', 'bg-white/95');
                navbar.classList.remove('bg-white/90');
            } else {
                navbar.classList.remove('shadow-md', 'bg-white/95');
                navbar.classList.add('bg-white/90');
            }
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    const fadeElements = document.querySelectorAll('.fade-in-up');
    if (fadeElements.length > 0) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        fadeElements.forEach(element => scrollObserver.observe(element));
    }

    // =========================================================
    // --- EmailJS Setup & Form Submission ---
    // =========================================================
    /*
      HOW TO SETUP EMAILJS (Beginner Friendly):
      1. Go to https://www.emailjs.com/ and sign up for a free account.
      2. Click "Email Services" -> "Add New Service" (e.g., Gmail) and copy your Service ID.
      3. Click "Email Templates" -> "Create New Template". 
         Design the email you want to receive. Use these variables in the template:
         {{from_name}}, {{phone_number}}, {{city}}, {{business_type}}
         Then copy your Template ID.
      4. Go to "Account" (top right) -> "API Keys" to copy your Public Key.
      5. Replace "YOUR_PUBLIC_KEY", "YOUR_SERVICE_ID", and "YOUR_TEMPLATE_ID" below.
    */

    // Initialize EmailJS using your Public Key
    emailjs.init({
        publicKey: "YOUR_PUBLIC_KEY", // <-- Replace with your real Public Key before deploying
    });

    const distributorForm = document.getElementById('distributorForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitIcon = document.getElementById('submitIcon');
    const formMessage = document.getElementById('formMessage');

    // Modal Elements for Success Popup
    const successModal = document.getElementById('successModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Function to gracefully show the custom success modal
    const showModal = () => {
        successModal.classList.remove('hidden');
        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            modalContent.classList.remove('opacity-0', 'scale-95');
            modalContent.classList.add('opacity-100', 'scale-100');
        }, 10);
    };

    // Function to gracefully hide the custom success modal
    const closeModal = () => {
        modalOverlay.classList.add('opacity-0');
        modalContent.classList.remove('opacity-100', 'scale-100');
        modalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            successModal.classList.add('hidden');
        }, 300);
    };

    // Modal Close Triggers
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Form Submission Handler
    if (distributorForm) {
        distributorForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Get values and check if empty (Basic Validation)
            const name = document.getElementById('from_name').value.trim();
            const phone = document.getElementById('phone_number').value.trim();
            const city = document.getElementById('city').value.trim();
            const business = document.getElementById('business_type').value;

            if (!name || !phone || !city || !business) {
                // Show inline error if browser HTML5 validation failed to catch it
                formMessage.textContent = "Please fill out all required fields.";
                formMessage.className = "p-3 rounded-md text-sm font-medium text-center bg-red-100 text-red-800 mt-4";
                formMessage.classList.remove('hidden');
                return;
            }

            // 2. Change button UI to "Sending..." loading state
            submitBtn.disabled = true;
            submitText.textContent = "Sending...";
            submitIcon.className = "fa-solid fa-circle-notch fa-spin";
            formMessage.classList.add('hidden'); // Hide any previous error messages

            // 3. Prepare data to send
            const templateParams = {
                from_name: name,
                phone_number: phone,
                city: city,
                business_type: business,
            };

            // 4. Send the email using EmailJS
            // <-- Replace with your real Service ID and Template ID
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);

                    // Show success popup
                    showModal();

                    // Clear the form
                    distributorForm.reset();
                })
                .catch((error) => {
                    console.error('FAILED...', error);

                    // Show inline error message
                    formMessage.textContent = "Oops! Something went wrong. Please check console or try calling us.";
                    formMessage.className = "p-3 rounded-md text-sm font-medium text-center bg-red-100 text-red-800 mt-4";
                    formMessage.classList.remove('hidden');
                })
                .finally(() => {
                    // Restore button UI back to original state
                    submitBtn.disabled = false;
                    submitText.textContent = "Submit Inquiry";
                    submitIcon.className = "fa-solid fa-arrow-right";
                });
        });
    }
});
