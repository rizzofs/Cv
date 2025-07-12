// CV Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Add scroll animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add contact info copy functionality
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            
            // Create temporary tooltip
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Copiado al portapapeles';
            tooltip.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--secondary-color);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 1000;
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            // Copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                tooltip.style.opacity = '1';
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(tooltip);
                    }, 300);
                }, 2000);
            }).catch(err => {
                console.log('Failed to copy text: ', err);
            });
        });
    });

    // PDF Download functionality
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
            this.disabled = true;
            
            // Configure PDF options
            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'CV_Federico_Rizzo.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: '.section:has(.skills-container)'
                }
            };

            // Get the content to print
            const element = document.getElementById('content-to-print');
            
            // Generate PDF
            html2pdf().set(opt).from(element).save().then(() => {
                // Restore button state
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.textContent = 'PDF descargado exitosamente';
                successMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #27ae60;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 1000;
                    font-size: 14px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                document.body.appendChild(successMsg);
                setTimeout(() => successMsg.style.opacity = '1', 100);
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(successMsg);
                    }, 300);
                }, 3000);
            }).catch(err => {
                console.error('Error generating PDF:', err);
                
                // Restore button state
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.textContent = 'Error al generar el PDF. Intenta nuevamente.';
                errorMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #e74c3c;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 1000;
                    font-size: 14px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                document.body.appendChild(errorMsg);
                setTimeout(() => errorMsg.style.opacity = '1', 100);
                setTimeout(() => {
                    errorMsg.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(errorMsg);
                    }, 300);
                }, 3000);
            });
        });
    }

    // Add scroll to top functionality
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--secondary-color);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;

    scrollToTopBtn.addEventListener('click', scrollToTop);
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Add loading state for profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        profileImg.addEventListener('error', function() {
            this.style.display = 'none';
            console.log('Profile image failed to load');
        });
    }

    // Add error handling for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.log(`Image failed to load: ${this.src}`);
        });
    });

    console.log('CV Interactive Features loaded successfully!');
}); 