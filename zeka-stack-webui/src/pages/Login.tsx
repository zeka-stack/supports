import {useEffect, useState} from 'react';
import {Github, KeyRound, ShieldCheck, Sparkles} from 'lucide-react';
import {authHeaders, authStorage, parseTokenFromLocation} from '../lib/auth';
import {useTranslation} from 'react-i18next';

const generateDeviceId = () => {
    if (crypto?.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
};

export const Login = () => {
    const {t} = useTranslation();
    const [deviceId, setDeviceId] = useState(authStorage.getDeviceId());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const syncToken = () => {
            const next = parseTokenFromLocation();
            if (next && next !== token) {
                setToken(next);
            }
        };
        syncToken();
        window.addEventListener('hashchange', syncToken);
        return () => window.removeEventListener('hashchange', syncToken);
    }, [token]);

    useEffect(() => {
        const search = window.location.search;
        const hash = window.location.hash;
        const searchParams = new URLSearchParams(search);
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(t('login.loginFailed'));
        }
        const hashIndex = hash.indexOf('?');
        if (!errorParam && hashIndex >= 0) {
            const hashParams = new URLSearchParams(hash.slice(hashIndex + 1));
            if (hashParams.get('error')) {
                setError(t('login.loginFailed'));
            }
        }
        if (!token) {
            return;
        }
        authStorage.setToken(token);
        setLoading(true);
        fetch('/api/auth/me', {headers: authHeaders()})
            .then((res) => res.json())
            .then(() => {
                window.location.hash = '#/settings';
            })
            .catch(() => {
                setError(t('login.loginValidationError'));
                authStorage.clearToken();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    const handleLogin = async () => {
        if (!deviceId.trim()) {
            setError(t('login.pleaseFillDeviceId'));
            return;
        }
        setError('');
        setLoading(true);
        try {
            authStorage.setDeviceId(deviceId.trim());
            const response = await fetch(`/api/oauth/github/login?deviceId=${encodeURIComponent(deviceId.trim())}`);
            const json = await response.json();
            const data = json?.data ?? json;
            if (!data?.url) {
                throw new Error(t('login.cannotGetLoginUrl'));
            }
            window.location.href = data.url;
        } catch {
            setError(t('login.getLoginUrlFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = () => {
        const next = generateDeviceId();
        setDeviceId(next);
        authStorage.setDeviceId(next);
    };

    return (
        <div className="bg-[#F7F5F2] text-slate-900">
            <div className="relative overflow-hidden">
                <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-amber-200 via-rose-200 to-indigo-200 blur-3xl opacity-70"/>
                <div className="absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-indigo-200 via-teal-200 to-emerald-200 blur-3xl opacity-70"/>
            </div>
            <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                            <Sparkles className="h-4 w-4 text-amber-500"/>
                            {t('login.badge')}
                        </div>
                        <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                            <span className="block">{t('login.title')}</span>
                            <span className="mt-3 block text-amber-600">{t('login.subtitle')}</span>
                        </h1>
                        <p className="max-w-xl text-lg text-slate-600">
                            {t('login.description')}
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <ShieldCheck className="h-5 w-5 text-emerald-500"/>
                                <p className="mt-3 text-sm font-medium text-slate-700">{t('login.authorizeToUse')}</p>
                                <p className="mt-1 text-xs text-slate-500">{t('login.authorizeDesc')}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <KeyRound className="h-5 w-5 text-indigo-500"/>
                                <p className="mt-3 text-sm font-medium text-slate-700">{t('login.deviceBinding')}</p>
                                <p className="mt-1 text-xs text-slate-500">{t('login.deviceDesc')}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <Github className="h-5 w-5 text-slate-700"/>
                                <p className="mt-3 text-sm font-medium text-slate-700">{t('login.githubLoginLabel')}</p>
                                <p className="mt-1 text-xs text-slate-500">{t('login.githubLoginDesc')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">{t('login.bindDeviceAndLogin')}</h2>
                                <p className="mt-2 text-sm text-slate-500">{t('login.deviceDesc2')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">{t('login.deviceIdLabel')}</label>
                                <input
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    placeholder={t('login.deviceIdPlaceholder')}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                                />
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                    <span>{t('login.changeDeviceIdSettings')}</span>
                                    <button
                                        type="button"
                                        onClick={handleGenerate}
                                        className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                                    >
                                        {t('login.generateDeviceId')}
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {error}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <Github className="h-4 w-4"/>
                                {loading ? t('login.redirecting') : t('login.loginWithGithub')}
                            </button>
                            <p className="text-center text-xs text-slate-400">
                                {t('login.agreeToPrivacy')}
                                <a href="#/privacy" className="mx-1 text-amber-600 hover:text-amber-500">
                                    {t('login.privacyPolicy')}
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
