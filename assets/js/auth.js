/**
 * Private Content Authentication System
 * - AES-GCM 암호화 (Web Crypto API)
 * - 비밀번호 → PBKDF2 키 유도 → AES-GCM 복호화
 * - sessionStorage에 인증 상태 저장 (브라우저 닫으면 로그아웃)
 */

const AUTH = {
    // 비밀번호 해시 (SHA-256). 아래에서 설정.
    // 실제 비밀번호는 저장하지 않고 해시만 비교.
    PASSWORD_HASH: '12baccaadcaac7fc729a7df67ddc1dd0a03e6d91f368f8041267d071960c8cc8',

    SALT: 'vieworks-tech-blog-salt-2026',
    SESSION_KEY: 'blog_auth',

    isAuthenticated() {
        return sessionStorage.getItem(this.SESSION_KEY) === 'true';
    },

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + this.SALT);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async login(password) {
        const hash = await this.hashPassword(password);
        if (hash === this.PASSWORD_HASH) {
            sessionStorage.setItem(this.SESSION_KEY, 'true');
            sessionStorage.setItem(this.SESSION_KEY + '_pw', btoa(password));
            return true;
        }
        return false;
    },

    getPassword() {
        const encoded = sessionStorage.getItem(this.SESSION_KEY + '_pw');
        return encoded ? atob(encoded) : null;
    },

    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY + '_pw');
    },

    // AES-GCM 복호화용 키 유도
    async deriveKey(password) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: encoder.encode(this.SALT), iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
    },

    // 암호화된 콘텐츠 복호화
    async decryptContent(encryptedBase64, password) {
        try {
            const key = await this.deriveKey(password);
            const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
            const iv = encryptedBytes.slice(0, 12);
            const ciphertext = encryptedBytes.slice(12);
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv }, key, ciphertext
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            return null;
        }
    }
};

// ===== UI Helpers =====

function showAuthModal() {
    document.getElementById('auth-overlay').classList.add('active');
    setTimeout(() => document.getElementById('auth-password').focus(), 100);
}

function hideAuthModal() {
    document.getElementById('auth-overlay').classList.remove('active');
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-error').style.display = 'none';
}

async function handleLogin() {
    const pw = document.getElementById('auth-password').value;
    if (!pw) return;
    const ok = await AUTH.login(pw);
    if (ok) {
        hideAuthModal();
        updateAuthUI();
        // 비공개 페이지라면 콘텐츠 복호화
        if (typeof onAuthSuccess === 'function') onAuthSuccess(pw);
    } else {
        document.getElementById('auth-error').style.display = 'block';
    }
}

function handleLogout() {
    AUTH.logout();
    updateAuthUI();
    location.reload();
}

function updateAuthUI() {
    const lockBtn = document.getElementById('nav-lock');
    if (!lockBtn) return;
    if (AUTH.isAuthenticated()) {
        lockBtn.innerHTML = '<i class="fa-solid fa-leaf"></i> 인증됨';
        lockBtn.classList.add('authed');
    } else {
        lockBtn.innerHTML = '<i class="fa-solid fa-lock"></i> 비공개';
        lockBtn.classList.remove('authed');
    }
}

// Enter 키 지원
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    const pwInput = document.getElementById('auth-password');
    if (pwInput) {
        pwInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
});
