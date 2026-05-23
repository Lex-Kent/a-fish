import { MessageSquare, Plus, Search, Clock } from 'lucide-react';
import { useState } from 'react';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  selectedConversationId?: string;
  isDark?: boolean;
  isCollapsed: boolean;
  logo?: string;
}

export function Sidebar({ conversations, onSelectConversation, onNewConversation, selectedConversationId, isDark = true, isCollapsed, logo }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(true);

  const bgClass = isDark ? 'bg-[#1a2332] border-[#2a3544]' : 'bg-white border-neutral-300';
  const textClass = isDark ? 'text-slate-300' : 'text-neutral-700';
  const selectedClass = isDark ? 'bg-[#2d3b4e] text-neutral-100' : 'bg-neutral-200 text-neutral-900';
  const hoverClass = isDark ? 'hover:bg-[#243040]' : 'hover:bg-neutral-100';
  const tealClass = 'bg-[#0A856C] hover:bg-[#096f5a]';

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <div className={`w-16 border-r flex flex-col items-center py-4 gap-3 fixed left-0 top-8 bottom-0 z-30 ${bgClass}`}>
        <button
          onClick={onNewConversation}
          className={`p-3 rounded-lg transition-colors font-medium shadow-sm cursor-pointer text-white ${tealClass}`}
          title="New Chat"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-3 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'hover:bg-[#243040] text-slate-400'
              : 'hover:bg-neutral-100 text-neutral-600'
          }`}
          title="Search Chats"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-3 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'hover:bg-[#243040] text-slate-400'
              : 'hover:bg-neutral-100 text-neutral-600'
          }`}
          title="Chat History"
        >
          <Clock className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`w-64 border-r flex flex-col fixed left-0 top-8 bottom-0 z-30 ${bgClass}`}>
      {logo && (
        <div className="p-6 flex items-center justify-center border-b border-opacity-20" style={{ borderColor: isDark ? '#2a3544' : '#d4d4d8' }}>
          <img src={logo} alt="Fin" className="w-40 h-auto" />
        </div>
      )}
      <div className="p-3 space-y-3">
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors font-medium shadow-sm cursor-pointer ${tealClass}`}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>

        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-neutral-400'}`} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-lg text-sm outline-none transition-colors ${
              isDark
                ? 'bg-[#1e2632] border border-[#2a3544] text-neutral-100 placeholder:text-white placeholder:opacity-40 focus:border-[#3a4554]'
                : 'bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {filteredConversations.length === 0 ? (
          <div className={`p-4 text-center text-sm ${isDark ? 'text-white opacity-50' : 'text-neutral-400'}`}>
            {searchQuery ? 'No matching conversations' : 'No conversations yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                  selectedConversationId === conversation.id
                    ? selectedClass
                    : `${hoverClass} ${textClass}`
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{conversation.title}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      {new Date(conversation.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
