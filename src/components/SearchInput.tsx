import { Mic, Paperclip, Send, Loader2, X, Waves, Droplet } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchInputProps {
  onSubmit: (query: string, files?: File[]) => void;
  isLoading?: boolean;
  isDark?: boolean;
  searchMode?: 'deep-dive' | 'surface-skim';
  onSearchModeChange?: (mode: 'deep-dive' | 'surface-skim') => void;
}

export function SearchInput({ onSubmit, isLoading, isDark = true, searchMode = 'deep-dive', onSearchModeChange }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || attachedFiles.length > 0) {
      onSubmit(query, attachedFiles);
      setQuery('');
      setAttachedFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setQuery('Sample voice transcription: What are the Q4 financial reports?');
      }, 2000);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target as Node)) {
        setShowModeMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-700 text-neutral-200 rounded-lg text-sm"
            >
              <Paperclip className="w-4 h-4" />
              <span className="max-w-xs truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="hover:bg-neutral-600 rounded p-0.5 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center gap-2 border rounded-2xl px-4 py-3 transition-colors min-h-[52px] ${
          isDark
            ? 'bg-[#1e2632] border-[#2a3544] focus-within:border-[#3a4554]'
            : 'bg-white border-neutral-300 focus-within:border-blue-500'
        }`}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask a question about our documents..."
            className={`flex-1 outline-none bg-transparent resize-none max-h-32 py-1 ${
              isDark
                ? 'text-neutral-100 placeholder:text-white placeholder:opacity-40'
                : 'text-neutral-900 placeholder:text-neutral-400'
            }`}
            rows={1}
            disabled={isLoading}
          />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
          />

          <div className="flex items-center gap-1">
            {/* Search Mode Selector */}
            <div className="relative" ref={modeMenuRef}>
              <button
                type="button"
                onClick={() => setShowModeMenu(!showModeMenu)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? 'hover:bg-[#243040] text-slate-400'
                    : 'hover:bg-neutral-100 text-neutral-600'
                }`}
                title={searchMode === 'deep-dive' ? 'Deep Dive' : 'Surface Skim'}
                disabled={isLoading}
              >
                {searchMode === 'deep-dive' ? (
                  <Droplet className="w-5 h-5" />
                ) : (
                  <Waves className="w-5 h-5" />
                )}
              </button>

              {showModeMenu && (
                <div className={`absolute bottom-full left-0 mb-2 rounded-2xl border shadow-xl overflow-hidden min-w-[220px] ${
                  isDark
                    ? 'bg-[#1e2632] border-[#2a3544]'
                    : 'bg-white border-neutral-300'
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchModeChange?.('deep-dive');
                      setShowModeMenu(false);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#243040] ${
                      searchMode === 'deep-dive'
                        ? isDark ? 'bg-[#243040]' : 'bg-neutral-100'
                        : ''
                    }`}
                  >
                    <Droplet className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-neutral-100">Deep Dive</div>
                      <div className="text-xs text-slate-400 whitespace-nowrap">Comprehensive search</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSearchModeChange?.('surface-skim');
                      setShowModeMenu(false);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#243040] ${
                      searchMode === 'surface-skim'
                        ? isDark ? 'bg-[#243040]' : 'bg-neutral-100'
                        : ''
                    }`}
                  >
                    <Waves className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-neutral-100">Surface Skim</div>
                      <div className="text-xs text-slate-400 whitespace-nowrap">Quick overview</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-[#243040] text-slate-400'
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              title="Attach files"
              disabled={isLoading}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : isDark
                  ? 'hover:bg-[#243040] text-slate-400'
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={isLoading || (!query.trim() && attachedFiles.length === 0)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Send"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isRecording && (
          <div className="absolute -top-8 left-4 text-sm text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording...
          </div>
        )}
      </form>
    </div>
  );
}
