import {useEffect, useState} from 'react';
import {Copy, Github, LogOut, RefreshCw, Trash2} from 'lucide-react';
import {authHeaders, authStorage} from '../lib/auth';
import {useTranslation} from 'react-i18next';

type UserAccount = {
    githubLogin?: string;
    githubName?: string;
    avatarUrl?: string;
    email?: string;
    deviceId?: string;
};

export const Settings = () => {
    const {t} = useTranslation();
    const [user, setUser] = useState<UserAccount | null>(null);
    const [deviceId, setDeviceId] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [freeAiApiKey, setFreeAiApiKey] = useState('');
    const [freeAiApiKeyExpiresAt, setFreeAiApiKeyExpiresAt] = useState<number | null>(null);

    const fetchMe = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/me', {headers: authHeaders()});
            const json = await response.json();
            const data = json?.data ?? json;
            if (!data?.loggedIn) {
                authStorage.clearToken();
                window.location.hash = '#/login';
                return;
            }
            setUser(data.user);
            setDeviceId(data.user?.deviceId || '');
            setFreeAiApiKey(data?.freeAiApiKey || '');
            setFreeAiApiKeyExpiresAt(data?.freeAiApiKeyExpiresAt || null);
        } catch {
            setError(t('settings.cannotGetUserInfo'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authStorage.getToken()) {
            window.location.hash = '#/login';
            return;
        }
        fetchMe();
    }, []);

    const handleUpdateDevice = async () => {
        if (!deviceId.trim()) {
            setError(t('settings.deviceIdCannotBeEmpty'));
            return;
        }
        setError('');
        setActionLoading('device');
        try {
            const response = await fetch('/api/auth/device', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', ...authHeaders()},
                body: JSON.stringify({deviceId: deviceId.trim()})
            });
            if (!response.ok) {
                throw new Error('update device failed');
            }
            authStorage.setDeviceId(deviceId.trim());
            await fetchMe();
        } catch {
            setError(t('settings.deviceIdUpdateFailed'));
        } finally {
            setActionLoading('');
        }
    };

    const handleLogout = async () => {
        setActionLoading('logout');
        try {
            await fetch('/api/auth/logout', {method: 'POST', headers: authHeaders()});
        } finally {
            authStorage.clearToken();
            window.location.hash = '#/login';
            setActionLoading('');
        }
    };

    const handleDelete = async () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setActionLoading('delete');
        try {
            await fetch('/api/auth/account', {method: 'DELETE', headers: authHeaders()});
        } finally {
            authStorage.clearToken();
            window.location.hash = '#/login';
            setActionLoading('');
            setShowDeleteConfirm(false);
        }
    };

    const handleCopyFreeAiApiKey = async () => {
        if (!freeAiApiKey) {
            return;
        }
        try {
            await navigator.clipboard.writeText(freeAiApiKey);
        } catch {
            setError(t('settings.copyFreeAiApiKeyFailed'));
        }
    };

    return (
        <div className="bg-[#F3F6F0] font-['Space_Grotesk'] text-slate-900">
            <div className="mx-auto max-w-5xl px-6 py-16">
                <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <p className="text-sm font-medium text-emerald-600">{t('settings.title')}</p>
                        <h1 className="mt-2 text-3xl font-semibold">{t('settings.subtitle')}</h1>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={actionLoading === 'logout'}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300"
                    >
                        <LogOut className="h-4 w-4"/>
                        {t('settings.logout')}
                    </button>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center text-slate-500 shadow">
                        {t('settings.loadingAccount')}
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="avatar" className="h-full w-full object-cover"/>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <Github className="h-6 w-6"/>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold">{user?.githubName || user?.githubLogin}</p>
                                    <p className="text-sm text-slate-500">@{user?.githubLogin}</p>
                                    {user?.email && <p className="text-xs text-slate-400">{user.email}</p>}
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">{t('settings.freeAiApiKeyLabel')}</label>
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            value={freeAiApiKey}
                                            readOnly
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCopyFreeAiApiKey}
                                            disabled={!freeAiApiKey}
                                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Copy className="h-4 w-4"/>
                                            {t('settings.copy')}
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">
                                        {freeAiApiKeyExpiresAt
                                            ? t('settings.freeAiApiKeyExpiresAt', {date: new Date(freeAiApiKeyExpiresAt).toLocaleString()})
                                            : t('settings.freeAiApiKeyUnavailable')}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">{t('settings.deviceIdLabel')}</label>
                                    <input
                                        value={deviceId}
                                        onChange={(e) => setDeviceId(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                                    />
                                </div>
                                {error && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={handleUpdateDevice}
                                    disabled={actionLoading === 'device'}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <RefreshCw className="h-4 w-4"/>
                                    {actionLoading === 'device' ? t('settings.updating') : t('settings.updateDeviceId')}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-8 shadow">
                            <h2 className="text-lg font-semibold text-rose-800">{t('settings.dangerZone')}</h2>
                            <p className="mt-2 text-sm text-rose-700">
                                {t('settings.dangerZoneDesc')}
                            </p>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={actionLoading === 'delete'}
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <Trash2 className="h-4 w-4"/>
                                {actionLoading === 'delete' ? t('settings.deleting') : t('settings.deleteAccount')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900">{t('settings.confirmDeleteTitle')}</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            {t('settings.confirmDeleteDesc')}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
                            >
                                {t('settings.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={actionLoading === 'delete'}
                                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {actionLoading === 'delete' ? t('settings.deleting') : t('settings.confirmDelete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
