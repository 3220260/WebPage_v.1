/* =========================================
   1. CORE SETTINGS & TRACKING
   ========================================= */
const GA_MEASUREMENT_ID = 'G-P6TN4GQJLW';

function loadAllTracking() {
    if (window.trackingLoaded) return;
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { 'anonymize_ip': true });
    window.trackingLoaded = true;
}

function trackEvent(category, action, label) {
    if (typeof gtag === 'function') {
        gtag('event', action, { 'event_category': category, 'event_label': label });
    }
}

/* =========================================
   2. UI FUNCTIONS (MODALS, TOASTS, TABS)
   ========================================= */

// Ειδοποιήσεις (Toasts) - Απαραίτητο για την αντιγραφή IBAN
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success'
        ? '<i class="fa-solid fa-circle-check text-green-400"></i>'
        : '<i class="fa-solid fa-circle-info text-blue-400"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Κλείδωμα Scroll
    
    const helper = document.querySelector('.helper-container');
    if (helper) helper.style.display = 'none';
    
    history.pushState({modalId: id}, null, `#${id}`);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
    
    const activeModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
    if (activeModals.length === 0) {
        document.body.classList.remove('scroll-locked');
        document.body.classList.remove('overflow-hidden');
        
        // Επαναφορά θέσης αν χρησιμοποιήθηκε position: fixed
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        const helper = document.querySelector('.helper-container');
        if (helper) helper.style.display = 'flex';
    }
}

function toggleSidebar() {
    const menu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('sidebarOverlay');
    if (!menu || !overlay) return;

    const isClosed = menu.classList.contains('-translate-x-full');
    if (isClosed) {
        document.body.classList.add('overflow-hidden');
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            menu.classList.remove('-translate-x-full');
        });
    } else {
        menu.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => { overlay.classList.add('hidden'); }, 300);
    }
}

function openImagePreview(imgName) {
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImageTarget');
    if (!modal || !img) return;
    
    img.src = imgName;
    modal.classList.remove('hidden');
    
    // Σκληρό κλείδωμα scroll και αφής
    document.body.classList.add('scroll-locked');
    
    // Αποτροπή μετακίνησης μέσω αφής στο modal
    modal.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}

function switchTab(showId, hideId, activeBtnId, inactiveBtnId) {
    document.getElementById(showId).classList.remove('hidden');
    document.getElementById(hideId).classList.add('hidden');
    const activeBtn = document.getElementById(activeBtnId);
    const inactiveBtn = document.getElementById(inactiveBtnId);
    
    const isVoda = activeBtnId.includes('v-') || activeBtnId === 'btn-v-port';
    const color = isVoda ? 'red' : 'blue';
    
    inactiveBtn.className = "flex-1 py-3 md:py-4 font-bold text-xs md:text-sm text-gray-500 hover:bg-gray-100 transition";
    activeBtn.className = `flex-1 py-3 md:py-4 font-bold text-xs md:text-sm text-${color}-600 border-b-4 border-${color}-600 bg-white`;
}

/* =========================================
   3. COPY FUNCTIONS
   ========================================= */
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const msg = element.querySelector('.copy-msg');
        const icon = element.querySelector('.fa-copy');
        if (msg) { msg.classList.remove('opacity-0'); msg.classList.add('opacity-100'); }
        if (icon) {
            icon.classList.remove('fa-copy', 'fa-regular');
            icon.classList.add('fa-check', 'fa-solid');
        }
        setTimeout(() => {
            if (msg) { msg.classList.remove('opacity-100'); msg.classList.add('opacity-0'); }
            if (icon) {
                icon.classList.remove('fa-check', 'fa-solid');
                icon.classList.add('fa-copy', 'fa-regular');
            }
        }, 2000);
    }).catch(() => showToast('Η αντιγραφή απέτυχε', 'error'));
}

async function copyIBAN(text, element) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Ο αριθμός λογαριασμού αντιγράφηκε!', 'success');
        const iconCopy = element.querySelector('.icon-copy');
        const iconCheck = element.querySelector('.icon-check');
        if (iconCopy && iconCheck) { iconCopy.classList.add('hidden'); iconCheck.classList.remove('hidden'); }
        element.classList.add('border-green-500', 'bg-green-50');
        setTimeout(() => {
            if (iconCopy && iconCheck) { iconCopy.classList.remove('hidden'); iconCheck.classList.add('hidden'); }
            element.classList.remove('border-green-500', 'bg-green-50');
        }, 2000);
    } catch (err) {
        showToast('Η αντιγραφή απέτυχε', 'error');
    }
}

/* =========================================
   4. CHATBOT — MOBILE FULL SCREEN + KEYBOARD
   ========================================= */
let _chatScrollY = 0;

function _chatShowHeader() {
    const header = document.getElementById('chatHeader');
    const btn = document.getElementById('chatFloatingClose');
    if (header) header.classList.remove('chat-header-hidden');
    if (btn) btn.style.display = 'none';
}

function _chatHideHeader() {
    const header = document.getElementById('chatHeader');
    const btn = document.getElementById('chatFloatingClose');
    if (header) header.classList.add('chat-header-hidden');
    if (btn) btn.style.display = 'flex';
}

function openChatModal() {
    const modal = document.getElementById('chatModal');
    const content = document.getElementById('chatModalContent');
    if (!modal) return;

    _chatScrollY = window.scrollY || document.documentElement.scrollTop;
    _chatShowHeader();

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-y-full', 'md:translate-y-10', 'md:scale-95');
        content.classList.add('translate-y-0', 'md:scale-100');
    });

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_chatScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    trackEvent('Chatbot', 'Open', 'AI Assistant UI');
}

function closeChatModal() {
    const modal = document.getElementById('chatModal');
    const content = document.getElementById('chatModalContent');
    if (!modal) return;

    _chatShowHeader();
    modal.classList.add('opacity-0');
    content.classList.remove('translate-y-0', 'md:scale-100');
    content.classList.add('translate-y-full', 'md:translate-y-10', 'md:scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, _chatScrollY);
    }, 400);
}

// VisualViewport Handling για κινητά (Πληκτρολόγιο)
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        const modal = document.getElementById('chatModal');
        if (!modal || modal.classList.contains('hidden') || window.innerWidth >= 768) return;

        const vvH = window.visualViewport.height;
        const vvT = window.visualViewport.offsetTop;
        modal.style.top = `${vvT}px`;
        modal.style.height = `${vvH}px`;

        if (vvH < window.screen.height * 0.75) _chatHideHeader();
        else _chatShowHeader();
    });
}

window.addEventListener('message', (event) => {
    if (event.data === 'closeChat') closeChatModal();
    if (event.data === 'message-sent' || event.data === 'close-keyboard') {
        document.activeElement.blur();
    }
});

/* =========================================
   5. COOKIE CONSENT & ZOOM LOCK
   ========================================= */
function handleCookieConsent(action) {
    const banner = document.getElementById('cookieConsentBanner');
    if (!banner) return;
    if (action === 'accept') {
        localStorage.setItem('cookieConsent', 'accepted');
        loadAllTracking();
        showToast('Οι προτιμήσεις αποθηκεύτηκαν', 'success');
    } else {
        localStorage.setItem('cookieConsent', 'rejected');
        showToast('Τα cookies απορρίφθηκαν', 'info');
    }
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => banner.classList.add('hidden'), 500);
}

// Αποτροπή zoom σε iOS
document.addEventListener('touchstart', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

/* =========================================
   6. INITIALIZATION & ROUTING
   ========================================= */
document.addEventListener("DOMContentLoaded", function () {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => { preloader.style.display = 'none'; document.body.classList.remove('loading'); }, 700);
        }, 300);
    }

    // Cookies Check
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        setTimeout(() => { document.getElementById('cookieConsentBanner')?.classList.remove('hidden'); }, 1000);
    } else if (consent === 'accepted') {
        loadAllTracking();
    }

    // Hash Routing (nyxlabs.gr/#modalID)
    if (window.location.hash) {
        const modalId = window.location.hash.substring(1);
        openModal(modalId);
    }

    // Global click listeners
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) closeModal(e.target.id);
        if (e.target.id === 'sidebarOverlay') toggleSidebar();
    });

    // Intersection Observer για τα Animations (Reveal)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${i * 100}ms`;
        observer.observe(el);
    });
});

// Διαχείριση "Πίσω" στο Browser
window.onpopstate = function (event) {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
    document.body.classList.remove('overflow-hidden');
    if (event.state && event.state.modalId) {
        const modal = document.getElementById(event.state.modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }
    }
};