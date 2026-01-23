import React from 'react';
import {ChevronUp, MessageSquare} from 'lucide-react';
import type {Request} from '../data';
import {formatDate} from '../lib/api';

interface RequestCardProps {
    request: Request;
    onClick: (request: Request) => void;
}

const statusConfig = {
    'Planned': {
        color: 'bg-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        hoverBorder: 'group-hover/card:border-blue-300'
    },
    'In Progress': {
        color: 'bg-amber-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        hoverBorder: 'group-hover/card:border-amber-300'
    },
    'Complete': {
        color: 'bg-emerald-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        hoverBorder: 'group-hover/card:border-emerald-300'
    },
    'Under Review': {
        color: 'bg-purple-500',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        hoverBorder: 'group-hover/card:border-purple-300'
    },
    'Open': {
        color: 'bg-gray-400',
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
        hoverBorder: 'group-hover/card:border-gray-300'
    },
};

const priorityConfig = {
    'High': {emoji: '🔥', label: 'High Priority', bg: 'bg-red-50 text-red-600 border-red-100'},
    'Medium': {emoji: '✨', label: 'Medium Priority', bg: 'bg-yellow-50 text-yellow-600 border-yellow-100'},
    'Low': {emoji: '💡', label: 'Low Priority', bg: 'bg-blue-50 text-blue-600 border-blue-100'},
};

// Adjusted thresholds and distinct colors
const getVoteStyle = (count: number) => {
    if (count >= 20) return 'bg-orange-50 border-orange-100 text-orange-600'; // Hot (was 50)
    if (count >= 10) return 'bg-indigo-50 border-indigo-100 text-indigo-600'; // Trending (was 20)
    if (count >= 5) return 'bg-sky-50 border-sky-100 text-sky-600'; // Growing (distinct blue)
    return 'bg-slate-50 border-slate-100 text-slate-500'; // New/Quiet
};

const getVoteIconColor = (count: number) => {
    if (count >= 20) return 'text-orange-500';
    if (count >= 10) return 'text-indigo-500';
    if (count >= 5) return 'text-sky-500';
    return 'text-slate-400';
};

const getCommentStyle = (count: number) => {
    if (count >= 10) return 'bg-purple-50 text-purple-600 border-purple-100'; // Active
    if (count >= 3) return 'bg-violet-50 text-violet-600 border-violet-100'; // Some discussion
    return 'bg-gray-50 text-gray-500 border-gray-100'; // Quiet
};

export const RequestCard: React.FC<RequestCardProps> = ({request, onClick}) => {
    const statusStyle = statusConfig[request.status] || statusConfig['Open'];
    const priorityStyle = priorityConfig[request.priority] || priorityConfig['Low'];

    const voteStyle = getVoteStyle(request.voteCount);
    const voteIconColor = getVoteIconColor(request.voteCount);
    const commentStyle = getCommentStyle(request.commentCount);

    return (
        <div
            onClick={() => onClick(request)}
            className={`relative bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex gap-5 items-start cursor-pointer group/card overflow-hidden ${statusStyle.hoverBorder}`}
        >
            {/* Vote Button Column */}
            <div className="flex flex-col items-center min-w-[3.5rem] pt-1 pl-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); /* Add vote logic here later if needed */
                    }}
                    className={`flex flex-col items-center justify-center w-14 h-16 rounded-2xl border transition-all shadow-sm ${voteStyle} hover:scale-105`}
                >
                    <ChevronUp className={`w-6 h-6 mb-0.5 ${voteIconColor}`} strokeWidth={3}/>
                    <span className="text-base font-bold">{request.voteCount}</span>
                </button>
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover/card:text-indigo-600 transition-colors line-clamp-2">
                        {request.title}
                    </h3>

                    {/* Priority Badge with Emoji */}
                    <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${priorityStyle.bg} shadow-sm`}>
                        <span>{priorityStyle.emoji}</span>
                        <span className="hidden sm:inline">{request.priority}</span>
                    </div>
                </div>

                <p className="text-gray-500 text-[15px] leading-relaxed mb-4 line-clamp-2 font-medium">
                    {request.description}
                </p>

                <div className="flex items-center flex-wrap gap-y-2 gap-x-4 text-xs font-semibold text-gray-400">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.color}`}></span>
                        {request.status}
                    </span>

                    {/* Comment Badge - Dynamic Color */}
                    <span className={`flex items-center gap-1.5 transition-colors px-2 py-1 rounded-md border ${commentStyle}`}>
                        <MessageSquare className="w-3.5 h-3.5"/>
                        {request.commentCount}
                    </span>

                    <span className="ml-auto text-gray-300 font-normal">{formatDate(request.createTime)}</span>
                </div>
            </div>
        </div>
    );
};
