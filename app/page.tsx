'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../src/components/Sidebar';
import { ProfileHeader } from '../src/components/ProfileHeader';
import { SearchFiltersPanel, SearchFilters } from '../src/components/SearchFilters';
import { SearchInput } from '../src/components/SearchInput';
import { ChatMessage, Message, DocumentCitation } from '../src/components/ChatMessage';
import { ThemeToggle } from '../src/components/ThemeToggle';
import { SearchingAnimation } from '../src/components/SearchingAnimation';
import { FloatingBubbles } from '../src/components/FloatingBubbles';
import { ChevronLeft, ChevronRight, Lock, Download, Mail } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
  filters: SearchFilters;
}

const MOCK_CITATIONS: DocumentCitation[] = [
  {
    id: '1',
    title: 'AML Compliance Framework 2025',
    path: '/documents/compliance/AML_Framework_2025.pdf',
    snippet: 'Updated anti-money laundering procedures and customer due diligence requirements in accordance with FCA regulations.',
    type: 'PDF',
    category: 'AML & KYC'
  },
  {
    id: '2',
    title: 'FINRA Filing - Q4 2025',
    path: '/documents/regulatory/FINRA_Q4_2025.xlsx',
    snippet: 'Quarterly regulatory filing submitted to FINRA detailing trading activity, client complaints, and compliance attestations.',
    type: 'Excel',
    category: 'Regulatory Filings'
  }
];

export default function AFishApp() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchMode, setSearchMode] = useState<'deep-dive' | 'surface-skim'>('deep-dive');
	
  const bgClass = isDarkMode ? 'bg-[#151B25]' : 'bg-neutral-50';
  const sidebarClass = isDarkMode ? 'bg-[#1a2332] border-[#2a3544]' : 'bg-white border-neutral-300';
  const headerClass = isDarkMode ? 'bg-[#1a2332] border-[#2a3544]' : 'bg-white border-neutral-200';
  const textClass = isDarkMode ? 'text-neutral-100' : 'text-neutral-900';
  const subtextClass = isDarkMode ? 'text-slate-400' : 'text-neutral-600';
  const inputBgClass = isDarkMode ? 'bg-[#1e2632] border-[#2a3544]' : 'bg-white border-neutral-200';
  const contentBgClass = isDarkMode ? 'bg-[#151B25]' : 'bg-neutral-100';

  const [filters, setFilters] = useState<SearchFilters>({
    documentTypes: ['All Documents'],
    categories: ['All Categories'],
    timePeriod: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const generateAIResponse = (userQuery: string) => ({
    content: `I've searched our internal document library and found relevant information.`,
    confidence: 92
  });

  const handleSendMessage = (query: string, files?: File[]) => {
    if (!query.trim() && (!files || files.length === 0)) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query || `Uploaded ${files?.length} file(s)`,
      timestamp: new Date()
    };

    let conversation = currentConversation;

    if (!conversation) {
      conversation = {
        id: Date.now().toString(),
        title: query.slice(0, 50) || 'New Conversation',
        timestamp: new Date(),
        messages: [],
        filters: { ...filters }
      };
      setConversations(prev => [conversation!, ...prev]);
    }

    conversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      filters: { ...filters }
    };

    setCurrentConversation(conversation);
    setIsLoading(true);

    setTimeout(() => {
      const response = generateAIResponse(query);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        citations: MOCK_CITATIONS,
        timestamp: new Date(),
        confidence: response.confidence,
        saved: false
      };

      const updated = {
        ...conversation!,
        messages: [...conversation!.messages, aiMessage]
      };

      setCurrentConversation(updated);
      setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));
      setIsLoading(false);
    }, 12000);
  };

  const handleNewConversation = () => setCurrentConversation(null);

  const handleDownloadSummary = () => {
    alert('PDF download feature coming soon!');
  };

  const handleEmailSummary = () => {
    alert('Email summary feature coming soon!');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#151B25] text-white">
      <FloatingBubbles />

      	<div className={`px-6 py-2 text-center text-xs flex items-center justify-center gap-2 flex-shrink-0 ${
					isDarkMode
						? 'bg-[#070b0f] text-white opacity-80'
						: 'bg-neutral-200 text-neutral-700'
      		}`}>
        <Lock className="w-3 h-3" /> Fully private • Nothing leaves our environment • All responses are auditable
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          conversations={conversations}
          onSelectConversation={(conv) => setCurrentConversation(conv)}
          onNewConversation={handleNewConversation}
          selectedConversationId={currentConversation?.id}
          isDark={isDarkMode}
          isCollapsed={isSidebarCollapsed}
          logo={isDarkMode ? "/images/finLogoSquareOnDark.png" : "/images/finLogoSquareOnWhite.png"}
        />

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`fixed top-1/2 -translate-y-1/2 z-40 rounded-r-lg p-2 transition-colors shadow-sm cursor-pointer ${
          	isDarkMode
            	? 'bg-[#1e2632] border border-[#2a3544] hover:bg-[#243040]'
            	: 'bg-white border border-neutral-300 hover:bg-neutral-100'
        	}`}
        	style={{ left: isSidebarCollapsed ? '64px' : '256px' }}
        >
          {isSidebarCollapsed ? (
						<ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-neutral-600'}`} />
					) : (
						<ChevronLeft className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-neutral-600'}`} />
					)}
        </button>

        <div className="flex-1 flex flex-col" style={{ marginLeft: isSidebarCollapsed ? '64px' : '256px' }}>
          <header className={`border-b px-6 py-4 flex-shrink-0 ${headerClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isSidebarCollapsed && (
                  <img src={isDarkMode ? "/images/finLogoLongOnDark.png" : "/images/finLogoLongOnWhite.png"} alt="a•fish" className="h-10 w-auto" />
                )}
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
                <ProfileHeader 
                  userName="Sam Samson" 
                  userEmail="sam.samson@moneymatters.com" 
                  isDark={isDarkMode} 
                />
              </div>
            </div>
          </header>

          <div className={`flex-1 overflow-y-auto ${contentBgClass}`}>
            {!currentConversation || currentConversation.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <img 
                  src="/images/finHello.png" 
                  alt="Fin" 
                  className="w-48 h-48 mx-auto mb-6 object-contain"
                />
								<h2 className={`text-3xl font-semibold mb-4 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>Hi, I'm Fin.</h2>
                <p className={`text-xl ${subtextClass} mb-6`}>What are we fishing for today?</p>
								<p className={`mb-8 ${subtextClass}`}>
                  Ask me anything about our documents. I'll search through the files and provide answers with citations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSendMessage('What are our latest AML compliance requirements?')}
                    className={`p-4 rounded-lg text-left transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#1e2632] hover:bg-[#243040] border border-[#2a3544]'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-300'
                    }`}
                  >
                    <p className={`text-sm ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>What are our latest AML compliance requirements?</p>
                  </button>
                  <button
                    onClick={() => handleSendMessage('Summarise recent regulatory filings')}
                    className={`p-4 rounded-lg text-left transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#1e2632] hover:bg-[#243040] border border-[#2a3544]'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-300'
                    }`}
                  >
                    <p className={`text-sm ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>Summarise recent regulatory filings</p>
                  </button>
                  <button
                    onClick={() => handleSendMessage('Show me the latest risk management reports')}
                    className={`p-4 rounded-lg text-left transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#1e2632] hover:bg-[#243040] border border-[#2a3544]'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-300'
                    }`}
                  >
                    <p className={`text-sm ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>Show me the latest risk management reports</p>
                  </button>
                  <button
                    onClick={() => handleSendMessage('Find all incident and breach reports')}
                    className={`p-4 rounded-lg text-left transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#1e2632] hover:bg-[#243040] border border-[#2a3544]'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-300'
                    }`}
                  >
                    <p className={`text-sm ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>Find all incident and breach reports</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
                {currentConversation.messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    userName="Sam Samson" 
                    isDark={isDarkMode}
                  />
                ))}
                {isLoading && (
									<div className="flex flex-col items-center justify-center gap-4 mb-6">
										<SearchingAnimation isDark={isDarkMode} />
										<p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
											Fishing for information...
										</p>
									</div>
								)}
								<div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className={`border-t flex-shrink-0 ${isDarkMode ? 'border-[#2a3544] bg-[#1a2332]' : 'border-neutral-200 bg-white'}`}>
          	<div className="max-w-4xl mx-auto px-6 py-4 space-y-4">
              {currentConversation && currentConversation.messages.length > 0 && (
                <div className="flex items-center justify-between pb-3 border-b border-opacity-20" style={{ borderColor: isDarkMode ? '#2a3544' : '#d4d4d8' }}>
                  <div className={`text-sm ${isDarkMode ? 'text-white opacity-70' : 'text-neutral-600'}`}>
                  {currentConversation.messages.filter(m => m.role === 'assistant').length} {currentConversation.messages.filter(m => m.role === 'assistant').length === 1 ? 'response' : 'responses'} in this conversation
                </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadSummary}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'hover:bg-[#243040] text-slate-400 border border-[#2a3544]'
                        : 'hover:bg-neutral-100 text-neutral-600 border border-neutral-300'
                    }`}
                    >
                    <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={handleEmailSummary}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'hover:bg-[#243040] text-slate-400 border border-[#2a3544]'
                        : 'hover:bg-neutral-100 text-neutral-600 border border-neutral-300'
                    }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email Summary
                    </button>
                  </div>
                </div>
              )}

              <SearchFiltersPanel filters={filters} onFiltersChange={setFilters} isDark={isDarkMode} />
              <SearchInput
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                isDark={isDarkMode}
                searchMode={searchMode}
                onSearchModeChange={setSearchMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}