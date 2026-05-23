import { FileText, User, ExternalLink, File, FileSpreadsheet, Presentation, Image as ImageIcon, Heart } from 'lucide-react';
import { useState } from 'react';

export interface DocumentCitation {
  id: string;
  title: string;
  path: string;
  snippet: string;
  type: string;
  category: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: DocumentCitation[];
  timestamp: Date;
  confidence?: number;
  saved?: boolean;
}

interface ChatMessageProps {
  message: Message;
  userAvatar?: string;
  userName?: string;
  isDark?: boolean;
  onToggleSave?: (messageId: string) => void;
}

const DOC_TYPE_ICONS: Record<string, React.ReactNode> = {
  PDF: <FileText className="w-4 h-4" />,
  Word: <FileText className="w-4 h-4" />,
  Excel: <FileSpreadsheet className="w-4 h-4" />,
  PowerPoint: <Presentation className="w-4 h-4" />,
  Images: <ImageIcon className="w-4 h-4" />,
  Text: <File className="w-4 h-4" />,
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'AML & KYC': <FileText className="w-4 h-4" />,
  'Compliance Policies': <FileText className="w-4 h-4" />,
  'Regulatory Filings': <FileText className="w-4 h-4" />,
  'Audit & Assurance': <FileSpreadsheet className="w-4 h-4" />,
  'Risk Management': <FileText className="w-4 h-4" />,
  'Board & Executive Memos': <FileText className="w-4 h-4" />,
  'Incident & Breach Reports': <FileText className="w-4 h-4" />,
  'Training & Attestations': <FileText className="w-4 h-4" />,
  'Client Onboarding': <FileText className="w-4 h-4" />,
  'Market Surveillance': <FileText className="w-4 h-4" />,
};

export function ChatMessage({ message, userAvatar, userName, isDark = true, onToggleSave }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src="/images/finFront.png" alt="Fin" className="w-10 h-10 object-contain" />
          </div>
          <span className={`text-xs ${isDark ? 'text-white opacity-60' : 'text-neutral-600'}`}>Fin</span>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl`}>
        <div className="flex-1 min-w-0">
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-[#0A856C] text-white'
                : isDark
                ? 'bg-[#1e2632] text-white'
                : 'bg-neutral-200 text-neutral-900'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>

            {!isUser && message.confidence !== undefined && (
              <div className={`mt-3 pt-3 flex items-center justify-between ${isDark ? 'border-t border-[#2a3544]' : 'border-t border-neutral-300'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isDark ? 'text-white opacity-60' : 'text-neutral-600'}`}>
                    Confidence:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-24 h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#2a3544]' : 'bg-neutral-300'}`}>
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${message.confidence}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${isDark ? 'text-white opacity-80' : 'text-neutral-700'}`}>
                      {message.confidence}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleSave?.(message.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    message.saved
                      ? 'text-red-500 hover:bg-red-500/10'
                      : isDark
                      ? 'text-slate-400 hover:bg-[#243040]'
                      : 'text-neutral-500 hover:bg-neutral-300'
                  }`}
                  title={message.saved ? 'Unsave answer' : 'Save answer'}
                >
                  <Heart className={`w-4 h-4 ${message.saved ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 space-y-2 w-full">
            <p className={`text-xs px-2 ${isDark ? 'text-white opacity-60' : 'text-neutral-600'}`}>Sources:</p>
            {message.citations.map((citation) => (
              <button
                key={citation.id}
                className={`w-full text-left border rounded-lg p-3 transition-all group cursor-pointer ${
                  isDark
                    ? 'bg-[#1e2632] hover:bg-[#243040] border-[#2a3544] hover:border-[#3a4554]'
                    : 'bg-white hover:bg-neutral-50 border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex gap-1 mt-0.5">
                    <div className="text-orange-500 group-hover:text-orange-400">
                      {DOC_TYPE_ICONS[citation.type] || <File className="w-4 h-4" />}
                    </div>
                    <div className="text-purple-500 group-hover:text-purple-400">
                      {CATEGORY_ICONS[citation.category] || <FileText className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium transition-colors ${
                        isDark
                          ? 'text-neutral-200 group-hover:text-white'
                          : 'text-neutral-800 group-hover:text-neutral-900'
                      }`}>
                        {citation.title}
                      </p>
                      <ExternalLink className={`w-3 h-3 flex-shrink-0 transition-colors ${
                        isDark
                          ? 'text-neutral-500 group-hover:text-neutral-400'
                          : 'text-neutral-400 group-hover:text-neutral-600'
                      }`} />
                    </div>
                    <p className={`text-xs mt-1 line-clamp-2 transition-colors ${
                      isDark
                        ? 'text-white opacity-60 group-hover:opacity-70'
                        : 'text-neutral-600 group-hover:text-neutral-700'
                    }`}>
                      {citation.snippet}
                    </p>
                    <p className={`text-xs mt-1 transition-colors ${
                      isDark
                        ? 'text-white opacity-50 group-hover:opacity-60'
                        : 'text-neutral-500 group-hover:text-neutral-600'
                    }`}>{citation.path}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <span className={`text-xs mt-1 px-2 ${isDark ? 'text-white opacity-50' : 'text-neutral-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium bg-[#0A856C] text-xs">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
          ) : (
            userName ? userName.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : <User className="w-5 h-5" />
          )}
        </div>
      )}
    </div>
  );
}
