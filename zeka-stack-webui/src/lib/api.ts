import {authStorage} from './auth';

const BASE_URL = '/api';

export interface Project {
    id: number;
    key: string;
    name: string;
    description: string;
    icon: string;
    status: number;
}

export interface Feedback {
    id: number;
    projectId: number;
    title: string;
    description: string;
    issuesUrl?: string; // GitHub issues URL
    status: 'Open' | 'In Progress' | 'Complete' | 'Planned' | 'Under Review';
    priority: 'Low' | 'Medium' | 'High';
    voteCount: number;
    commentCount: number;
    createTime: string; // ISO string from backend
}

export interface UserAccount {
    id: number;
    githubId: number;
    githubLogin: string;
    githubName: string;
    avatarUrl: string;
    email: string;
    role: string;
    deviceId: string;
    lastLoginTime: string;
}

export interface AuthStatus {
    loggedIn: boolean;
    user: UserAccount | null;
}

export interface FeedbackComment {
    id: number;
    feedbackId: number;
    content: string;
    createTime: string;
}

// 对应后端 EventRecord
export interface EventRecord {
    id?: number;
    deviceId: string;
    clientTimestamp: number;
    projectName: string;
    pluginId: string;
    eventType: string | { value: string; desc: string }; // Modified to handle object
    provider: string;
    model: string;
    userAction: string;
    tokenCount: number;
    inputToken: number;
    outputToken: number;
    latencyMs: number;
    resultStatus: string;
    receivedTime?: number;
}

// Token 排名数据
export interface TokenRanking {
    githubName: string;
    deviceId: string;
    tokenTotal: number;
    rank: number;
}

// 通用分页响应结构
export interface PageResult<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

export const api = {
    getRecentEvents: async (deviceId: string, current: number = 1, size: number = 10): Promise<PageResult<EventRecord>> => {
        const res = await fetch(`${BASE_URL}/plugin/events/page?deviceId=${encodeURIComponent(deviceId)}&page=${current}&size=${size}`);
        if (!res.ok) throw new Error('Failed to fetch event page');
        const json = await res.json();
        const pageData = json?.data ?? json;
        return {
            records: Array.isArray(pageData.records) ? pageData.records : [],
            total: pageData.total || 0,
            size: pageData.size || size,
            current: pageData.current || current,
            pages: pageData.pages || 0
        };
    },

    getTokenRanking: async (limit: number = 5): Promise<TokenRanking[]> => {
        const res = await fetch(`${BASE_URL}/plugin/events/token-ranking?limit=${limit}`);
        if (!res.ok) throw new Error('Failed to fetch token ranking');
        const json = await res.json();
        // Handle both direct array and wrapped response
        const data = json?.data ?? json;
        return Array.isArray(data) ? data : [];
    },

    getProjects: async (): Promise<Project[]> => {
        const res = await fetch(`${BASE_URL}/projects/list?status=1`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data || []);
    },

    getFeedbacks: async (projectId: number, search?: string): Promise<Feedback[]> => {
        let url = `${BASE_URL}/projects/feedbacks/list?projectId=${projectId}`;
        if (search) {
            url += `&title=${encodeURIComponent(search)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch feedbacks');
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data || []);
    },

    createFeedback: async (feedback: { projectId: number; title: string; description: string; priority: string }) => {
        const res = await fetch(`${BASE_URL}/projects/feedbacks`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...feedback, status: 'Open'}),
        });
        if (!res.ok) throw new Error('Failed to create feedback');
    },

    voteFeedback: async (id: number) => {
        const res = await fetch(`${BASE_URL}/projects/feedbacks/${id}/vote`, {
            method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to vote');
    },

    getComments: async (feedbackId: number): Promise<FeedbackComment[]> => {
        const res = await fetch(`${BASE_URL}/projects/feedback-comment/list?feedbackId=${feedbackId}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data || []);
    },

    createComment: async (comment: { feedbackId: number; content: string }) => {
        const res = await fetch(`${BASE_URL}/projects/feedback-comment`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(comment),
        });
        if (!res.ok) throw new Error('Failed to create comment');
    },

    getFeedbackDetail: async (id: number): Promise<Feedback> => {
        const res = await fetch(`${BASE_URL}/projects/feedbacks/${id}`);
        if (!res.ok) throw new Error('Failed to fetch feedback detail');
        const json = await res.json();
        return Array.isArray(json) ? json[0] : (json.data || json);
    },

    getAuthStatus: async (): Promise<AuthStatus | null> => {
        // Local Development Mocking
        if (import.meta.env.DEV) {
            const params = new URLSearchParams(window.location.search);
            const mockRole = params.get('role');
            if (mockRole) {
                if (mockRole === 'guest') return null;

                return {
                    loggedIn: true,
                    user: {
                        id: mockRole === 'admin' ? 1 : 2,
                        githubId: 1000 + (mockRole === 'admin' ? 1 : 2),
                        githubLogin: `dev-${mockRole}`,
                        githubName: `Dev ${mockRole.charAt(0).toUpperCase() + mockRole.slice(1)}`,
                        avatarUrl: `https://ui-avatars.com/api/?name=${mockRole}&background=random`,
                        email: `${mockRole}@local.dev`,
                        role: mockRole, // 'admin' or 'user'
                        deviceId: 'dev-device-id',
                        lastLoginTime: new Date().toISOString()
                    }
                };
            }
        }

        const token = authStorage.getToken();
        if (!token) return null;
        try {
            const res = await fetch(`${BASE_URL}/auth/me`, {
                headers: {'Authorization': `Bearer ${token}`},
            });
            if (!res.ok) return null;
            const json = await res.json();
            const data = json?.data ?? json;
            if (data && typeof data === 'object' && 'loggedIn' in data) {
                return data as AuthStatus;
            }
            return null;
        } catch {
            return null;
        }
    },

    updateFeedbackStatus: async (id: number, status: string, feedback: Partial<Feedback>) => {
        const res = await fetch(`${BASE_URL}/projects/feedbacks/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id,
                status,
                ...feedback,
            }),
        });
        if (!res.ok) throw new Error('Failed to update feedback status');
    },

    deleteFeedback: async (id: number) => {
        const res = await fetch(`${BASE_URL}/projects/feedbacks`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify([id]),
        });
        if (!res.ok) throw new Error('Failed to delete feedback');
    },
};

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const ymd = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const time = date.toTimeString().split(' ')[0];
    return `${ymd} ${time}`;
};
