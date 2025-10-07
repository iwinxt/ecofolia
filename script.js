// Eco-Folia - JavaScript melhorado
document.addEventListener('DOMContentLoaded', function() {
    // ========== MENU MOBILE ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    const body = document.body;

    // Alternar menu mobile
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('show');
            mobileMenuBtn.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        nav.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
        body.classList.remove('no-scroll');
    }
});

// Fechar menu ao redimensionar para desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        nav.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
        body.classList.remove('no-scroll');
    }
});

    // ========== SCROLL SUAVE ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== ANIMAÇÃO DE ELEMENTOS AO SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.fantasia-card, .step, .beneficio-card, .avaliacao-card, .content-grid, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // ========== ANIMAÇÃO DE CONTAGEM ESTATÍSTICAS ==========
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Observar seção de estatísticas (se existir)
    const statsSection = document.getElementById('estatisticas');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.stat-number').forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-value'));
                        animateValue(stat, 0, target, 2000);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ========== SLIDER DE AVALIAÇÕES ==========
    const avaliacoesGrid = document.querySelector('.avaliacoes-grid');
    if (avaliacoesGrid) {
        // Adicionar controles de slider se for dispositivo móvel
        if (window.innerWidth < 992) {
            const avaliacoesContainer = avaliacoesGrid.parentElement;
            const avaliacoesCards = document.querySelectorAll('.avaliacao-card');
            
            // Criar controles do slider
            const sliderControls = document.createElement('div');
            sliderControls.className = 'slider-controls';
            sliderControls.innerHTML = `
                <button class="slider-prev"><i class="fas fa-chevron-left"></i></button>
                <div class="slider-dots"></div>
                <button class="slider-next"><i class="fas fa-chevron-right"></i></button>
            `;
            avaliacoesContainer.appendChild(sliderControls);
            
            // Adicionar dots
            const dotsContainer = sliderControls.querySelector('.slider-dots');
            avaliacoesCards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            });
            
            // Configurar slider
            let currentSlide = 0;
            const dots = document.querySelectorAll('.dot');
            
            // Função para mostrar slide específico
            function showSlide(index) {
                avaliacoesCards.forEach(card => card.style.display = 'none');
                avaliacoesCards[index].style.display = 'block';
                
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
                
                currentSlide = index;
            }
            
            // Inicializar primeiro slide
            showSlide(0);
            
            // Event listeners para controles
            document.querySelector('.slider-next').addEventListener('click', () => {
                let nextSlide = currentSlide + 1;
                if (nextSlide >= avaliacoesCards.length) nextSlide = 0;
                showSlide(nextSlide);
            });
            
            document.querySelector('.slider-prev').addEventListener('click', () => {
                let prevSlide = currentSlide - 1;
                if (prevSlide < 0) prevSlide = avaliacoesCards.length - 1;
                showSlide(prevSlide);
            });
            
            // Auto-avanço do slider
            let slideInterval = setInterval(() => {
                let nextSlide = currentSlide + 1;
                if (nextSlide >= avaliacoesCards.length) nextSlide = 0;
                showSlide(nextSlide);
            }, 5000);
            
            // Pausar auto-avanço ao interagir
            sliderControls.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderControls.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    let nextSlide = currentSlide + 1;
                    if (nextSlide >= avaliacoesCards.length) nextSlide = 0;
                    showSlide(nextSlide);
                }, 5000);
            });
        }
    }

    // ========== BOTÃO VOLTAR AO TOPO ==========
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== VALIDAÇÃO DE FORMULÁRIO ==========
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && !isValidEmail(emailInput.value)) {
                e.preventDefault();
                emailInput.classList.add('error');
                emailInput.placeholder = 'Por favor, insira um e-mail válido';
                emailInput.value = '';
            }
        });
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Remover mensagem de erro ao focar no campo
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            this.placeholder = 'Seu e-mail';
        });
    });

    // ========== ANIMAÇÃO DE DIGITAÇÃO NO HERO ==========
    const heroText = document.querySelector('.hero-content h2');
    if (heroText) {
        const originalText = heroText.textContent;
        heroText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Iniciar animação quando a seção hero estiver visível
        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                heroObserver.disconnect();
            }
        }, { threshold: 0.5 });
        
        heroObserver.observe(document.getElementById('hero'));
    }

    // ========== EFETO PARALLAX ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ========== MODAL PARA IMAGENS DE FANTASIAS ==========
    const fantasiaImages = document.querySelectorAll('.fantasia-img img');
    fantasiaImages.forEach(img => {
        img.addEventListener('click', function() {
            // Criar modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${this.src}" alt="${this.alt}">
                </div>
            `;
            document.body.appendChild(modal);
            
            // Mostrar modal
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Fechar modal
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
            
            // Fechar ao clicar fora da imagem
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                }
            });
        });
    });

    // ========== ANIMAÇÃO DE FLUTUAÇÃO CONTÍNUA ==========
    function animateFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            // Remover qualquer animação anterior
            el.style.animation = 'none';
            
            // Calcular novos valores aleatórios
            const delay = Math.random() * 5;
            const duration = 5 + Math.random() * 3;
            
            // Aplicar nova animação
            el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
    }

    // Iniciar e renovar animações periodicamente
    animateFloatingElements();
    setInterval(animateFloatingElements, 15000);

    // ========== ALTERNÂNCIA DE TEMA CLARO/ESCURO ==========
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    document.querySelector('.header-content').appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // Verificar preferência salva
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // ========== CARREGAMENTO LAZY PARA IMAGENS ==========
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
});

// ========== ANIMAÇÃO DE DIGITAÇÃO PARA TEXTOS DINÂMICOS ==========
function initTypingEffect(element, texts, speed = 100) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = speed;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = speed / 2;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = speed;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingDelay = 1000; // Pausa no final
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingDelay = 500; // Pausa antes de começar novo texto
        }
        
        setTimeout(type, typingDelay);
    }
    
    // Iniciar efeito quando elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            type();
            observer.disconnect();
        }
    }, { threshold: 0.5 });
    
    observer.observe(element);
}

// Inicializar efeito de digitação se houver elemento com a classe typing-effect
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const texts = JSON.parse(typingElement.getAttribute('data-texts'));
        initTypingEffect(typingElement, texts);
    }
});