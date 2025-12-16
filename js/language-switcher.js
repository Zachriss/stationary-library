class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLang') || 'sw';
        this.elements = document.querySelectorAll('[data-lang]');
        this.init();
    }

    async init() {
        await this.loadLanguageFiles();
        this.updateContent();
        this.setupEventListeners();
    }

    async loadLanguageFiles() {
        try {
            const [enResponse, swResponse] = await Promise.all([
                fetch('./languages/en.json'),
                fetch('./languages/sw.json')
            ]);
            
            this.languages = {
                en: await enResponse.json(),
                sw: await swResponse.json()
            };
        } catch (error) {
            console.error('Error loading language files:', error);
        }
    }

    updateContent() {
        if (!this.languages) return;

        // Update all elements with data-lang attribute
        this.elements.forEach(element => {
            const keys = element.dataset.lang.split('.');
            let value = this.languages[this.currentLang];
            
            keys.forEach(key => {
                if (value && value[key]) {
                    value = value[key];
                }
            });
            
            if (value && typeof value === 'string') {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
            }
        });

        // Update language buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;

        // Save preference
        localStorage.setItem('preferredLang', this.currentLang);
    }

    switchLanguage(lang) {
        if (lang !== this.currentLang) {
            this.currentLang = lang;
            this.updateContent();
            
            // Dispatch custom event for other components
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { lang }
            }));
        }
    }

    setupEventListeners() {
        // Language buttons
        document.addEventListener('click', (e) => {
            const langBtn = e.target.closest('.lang-btn');
            if (langBtn) {
                e.preventDefault();
                this.switchLanguage(langBtn.dataset.lang);
            }
        });

        // Listen for language change events
        document.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.lang;
            this.updateContent();
        });
    }

    getText(key) {
        if (!this.languages) return key;
        
        const keys = key.split('.');
        let value = this.languages[this.currentLang];
        
        keys.forEach(k => {
            if (value && value[k]) {
                value = value[k];
            }
        });
        
        return value || key;
    }
}

// Initialize language switcher
let languageSwitcher;

document.addEventListener('DOMContentLoaded', () => {
    languageSwitcher = new LanguageSwitcher();
});