declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default class reCAPTCHA {
    siteKey: string;
    action: string;

    constructor(siteKey: string, action: string) {
        loadReCaptcha(siteKey);
        this.siteKey = siteKey;
        this.action = action;
    }

    async getToken(): Promise<string> {
        let token = '';
        await window.grecaptcha.execute(this.siteKey, { action: this.action }).then((res: string) => {
            token = res;
        });
        return token;
    }
}

const loadReCaptcha = (siteKey: string) => {
    const oldScript = document.getElementById('recaptchaNode');
    if (!oldScript) {
        const script = document.createElement('script');
        script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${siteKey}`;
        script.id = 'recaptchaNode';
        document.body.appendChild(script);
    }
};
