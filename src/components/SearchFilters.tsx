import { SlidersHorizontal, X, Calendar } from 'lucide-react';
import { useState } from 'react';

export interface SearchFilters {
  documentTypes: string[];
  categories: string[];
  timePeriod: string;
  dateFrom: string;
  dateTo: string;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isDark?: boolean;
}

const DOCUMENT_TYPES = ['All Documents', 'PDF', 'Excel', 'Word', 'Scans', 'PowerPoint', 'CSV / Data'];
const CATEGORIES = ['All Categories', 'AML & KYC', 'Compliance Policies', 'Regulatory Filings', 'Audit & Assurance', 'Risk Management', 'Board & Executive Memos', 'Incident & Breach Reports', 'Training & Attestations', 'Client Onboarding', 'Market Surveillance'];
const TIME_PERIODS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Past 3 Months', value: '3months' },
  { label: 'Past 6 Months', value: '6months' },
  { label: 'Past Year', value: 'year' }
];

export function SearchFiltersPanel({ filters, onFiltersChange, isDark = true }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const toggleDocumentType = (type: string) => {
    if (type === 'All Documents') {
      onFiltersChange({ ...filters, documentTypes: ['All Documents'] });
    } else {
      const newTypes = filters.documentTypes.includes(type)
        ? filters.documentTypes.filter(t => t !== type)
        : [...filters.documentTypes.filter(t => t !== 'All Documents'), type];
      onFiltersChange({ ...filters, documentTypes: newTypes.length === 0 ? ['All Documents'] : newTypes });
    }
  };

  const removeDocumentType = (type: string) => {
    const newTypes = filters.documentTypes.filter(t => t !== type);
    onFiltersChange({ ...filters, documentTypes: newTypes.length === 0 ? ['All Documents'] : newTypes });
  };

  const toggleCategory = (category: string) => {
    if (category === 'All Categories') {
      onFiltersChange({ ...filters, categories: ['All Categories'] });
    } else {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter(c => c !== category)
        : [...filters.categories.filter(c => c !== 'All Categories'), category];
      onFiltersChange({ ...filters, categories: newCategories.length === 0 ? ['All Categories'] : newCategories });
    }
  };

  const removeCategory = (category: string) => {
    const newCategories = filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories.length === 0 ? ['All Categories'] : newCategories });
  };

  const removeTimePeriod = () => {
    onFiltersChange({ ...filters, timePeriod: 'all', dateFrom: '', dateTo: '' });
    setShowDateInputs(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDocTypeClassName = (type: string) => {
    const isSelected = filters.documentTypes.includes(type);
    return `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      isSelected
        ? 'bg-orange-600 text-white'
        : isDark
        ? 'bg-[#1e2632] text-slate-400 hover:bg-[#243040] border border-[#2a3544]'
        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
    }`;
  };

  const getCategoryClassName = (category: string) => {
    const isSelected = filters.categories.includes(category);
    return `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      isSelected
        ? 'bg-purple-600 text-white'
        : isDark
        ? 'bg-[#1e2632] text-slate-400 hover:bg-[#243040] border border-[#2a3544]'
        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
    }`;
  };

  const getTimePeriodClassName = (value: string) => {
    const isSelected = filters.timePeriod === value;
    return `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      isSelected
        ? 'bg-blue-600 text-white'
        : isDark
        ? 'bg-[#1e2632] text-slate-400 hover:bg-[#243040] border border-[#2a3544]'
        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
    }`;
  };

  const selectedDocTypes = filters.documentTypes;
  const selectedCategories = filters.categories;
  const isDefaultState =
    filters.documentTypes.length === 1 &&
    filters.documentTypes[0] === 'All Documents' &&
    filters.categories.length === 1 &&
    filters.categories[0] === 'All Categories' &&
    filters.timePeriod === 'all';

  const currentTimePeriod = TIME_PERIODS.find(p => p.value === filters.timePeriod);
  const hasCustomDates = filters.dateFrom && filters.dateTo;

  return (
    <div className="space-y-2 relative">
      <div className="flex flex-wrap items-center gap-2">
        {selectedDocTypes.map(type => (
          <div
            key={type}
            className="px-3 py-1.5 rounded-lg text-sm bg-orange-600 text-white flex items-center gap-2 select-none"
          >
            <span>{type}</span>
            {type !== 'All Documents' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeDocumentType(type);
                }}
                className="hover:bg-orange-700 rounded p-0.5 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {selectedCategories.map(category => (
          <div
            key={category}
            className="px-3 py-1.5 rounded-lg text-sm bg-purple-600 text-white flex items-center gap-2 select-none"
          >
            <span>{category}</span>
            {category !== 'All Categories' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCategory(category);
                }}
                className="hover:bg-purple-700 rounded p-0.5 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {hasCustomDates ? (
          <div className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white flex items-center gap-2 select-none">
            <span>{formatDate(filters.dateFrom)} → {formatDate(filters.dateTo)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTimePeriod();
              }}
              className="hover:bg-blue-700 rounded p-0.5 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          currentTimePeriod && (
            <div className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white flex items-center gap-2 select-none">
              <span>{currentTimePeriod.label}</span>
              {filters.timePeriod !== 'all' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTimePeriod();
                  }}
                  className="hover:bg-blue-700 rounded p-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )
        )}

        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors flex items-center gap-2 cursor-pointer ${
              isDark
                ? 'bg-[#1e2632] text-slate-400 hover:bg-[#243040] border-[#2a3544]'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 border-neutral-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Show All Filters
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={`border rounded-lg p-4 space-y-4 absolute bottom-full left-0 right-0 mb-2 shadow-2xl ${
          isDark
            ? 'bg-[#1e2632] border-[#2a3544]'
            : 'bg-white border-neutral-300'
        }`}>
          <button
            onClick={() => setIsExpanded(false)}
            className={`absolute top-3 right-3 p-1 rounded transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-[#243040] text-slate-400'
                : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>Document Types</h4>
            <div className="flex flex-wrap gap-2">
              {DOCUMENT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleDocumentType(type)}
                  className={`${getDocTypeClassName(type)} cursor-pointer`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>Categories</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`${getCategoryClassName(category)} cursor-pointer`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>Time Period</h4>

            {showDateInputs ? (
              <div className="space-y-3">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-neutral-500 mb-1 block">From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value, timePeriod: 'custom' })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? 'bg-neutral-700 border-neutral-600 text-neutral-200'
                          : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-neutral-500 mb-1 block">To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value, timePeriod: 'custom' })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? 'bg-neutral-700 border-neutral-600 text-neutral-200'
                          : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => setShowDateInputs(false)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                        : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {TIME_PERIODS.map(period => (
                  <button
                    key={period.value}
                    onClick={() => onFiltersChange({ ...filters, timePeriod: period.value, dateFrom: '', dateTo: '' })}
                    className={`${getTimePeriodClassName(period.value)} cursor-pointer`}
                  >
                    {period.label}
                  </button>
                ))}
                <button
                  onClick={() => setShowDateInputs(true)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  Custom Dates
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
