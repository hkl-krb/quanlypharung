import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  Building2, 
  UserCheck
} from 'lucide-react';
import { 
  COMMUNE_OPTIONS, 
  FOREST_OWNER_OPTIONS, 
  MONTH_OPTIONS, 
  QUARTER_OPTIONS,
  VIOLATOR_TYPE_OPTIONS,
  YEAR_OPTIONS
} from '../data/initialData';

export default function FilterBar({
  selectedYear = 2026,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedQuarter,
  setSelectedQuarter,
  selectedCommune,
  setSelectedCommune,
  selectedForestOwner,
  setSelectedForestOwner,
  selectedViolatorFilter = 'ALL',
  setSelectedViolatorFilter,
  searchTerm,
  setSearchTerm,
  onResetFilters,
  filteredCount,
  totalCount,
  theme = 'light'
}) {
  const isLight = theme === 'light';

  return (
    <div className="glass-panel rounded-2xl p-4 mb-6 transition-all duration-200">
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3.5 pb-3 border-b ${
        isLight ? 'border-slate-300' : 'border-slate-800'
      }`}>
        
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isLight ? 'bg-emerald-700 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <Filter className="w-4 h-4" />
          </div>
          <h3 className={`font-extrabold text-sm tracking-wide uppercase ${isLight ? 'text-slate-950' : 'text-white'}`}>
            Bộ Lọc Số Liệu Tùy Chọn ({selectedYear === 0 ? 'Tất Cả Các Năm' : `Năm ${selectedYear}`})
          </h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
            isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-800 text-slate-200 border-slate-700'
          }`}>
            {filteredCount} / {totalCount} vụ việc
          </span>
        </div>

        {/* Reset button */}
        <button
          onClick={onResetFilters}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition border ${
            isLight 
              ? 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100 border-slate-300' 
              : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800 border-slate-700'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại bộ lọc</span>
        </button>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        
        {/* Year Selector */}
        <div>
          <label className={`block text-[11px] font-extrabold mb-1 flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Năm Làm Việc
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear && setSelectedYear(Number(e.target.value))}
            className={`w-full text-xs font-bold rounded-xl px-2.5 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
              isLight 
                ? 'bg-blue-50/50 border border-blue-200 text-blue-950' 
                : 'bg-slate-900 border border-slate-700 text-white'
            }`}
          >
            <option value={2026}>Năm 2026 (41 vụ)</option>
            <option value={2025}>Năm 2025 (153 vụ)</option>
            <option value={0}>Tất cả các năm (194 vụ)</option>
          </select>
        </div>

        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-2 relative">
          <Search className={`w-4 h-4 absolute left-3 top-8 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          <label className={`block text-[11px] font-extrabold mb-1 flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            Tìm Kiếm Từ Khóa
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm số BB, tiểu khu, tên đối tượng..."
            className={`w-full text-xs font-bold rounded-xl pl-9 pr-3 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
              isLight 
                ? 'bg-slate-50/50 border border-slate-300 text-slate-950 placeholder-slate-400' 
                : 'bg-slate-900 border border-slate-700 text-white placeholder-slate-400'
            }`}
          />
        </div>

        {/* Month Selector */}
        <div>
          <label className={`block text-[11px] font-extrabold mb-1 flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            Theo Tháng
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(Number(e.target.value));
              if (Number(e.target.value) !== 0) setSelectedQuarter(0);
            }}
            className={`w-full text-xs font-bold rounded-xl px-3 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
              isLight 
                ? 'bg-emerald-50/50 border border-emerald-200 text-emerald-950' 
                : 'bg-slate-900 border border-slate-700 text-white'
            }`}
          >
            {MONTH_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quarter Selector */}
        <div>
          <label className={`block text-[11px] font-extrabold mb-1 flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Theo Quý
          </label>
          <select
            value={selectedQuarter}
            onChange={(e) => {
              setSelectedQuarter(Number(e.target.value));
              if (Number(e.target.value) !== 0) setSelectedMonth(0);
            }}
            className={`w-full text-xs font-bold rounded-xl px-3 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
              isLight 
                ? 'bg-amber-50/50 border border-amber-200 text-amber-950 focus:ring-amber-600' 
                : 'bg-slate-900 border border-slate-700 text-white focus:ring-amber-600'
            }`}
          >
            {QUARTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Commune Selector */}
        <div>
          <label className={`block text-[11px] font-extrabold mb-1 flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            Địa Giới Xã
          </label>
          <select
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            className={`w-full text-xs font-bold rounded-xl px-3 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
              isLight 
                ? 'bg-sky-50/50 border border-sky-200 text-sky-950 focus:ring-sky-600' 
                : 'bg-slate-900 border border-slate-700 text-white focus:ring-sky-600'
            }`}
          >
            {COMMUNE_OPTIONS.map(commune => (
              <option key={commune} value={commune}>
                {commune}
              </option>
            ))}
          </select>
        </div>

        {/* Violator / Fine Selector */}
        <div>
          <label className={`block text-[11px] font-extrabold mb-1 flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            Đối Tượng / Nộp Phạt
          </label>
          <select
            value={selectedViolatorFilter}
            onChange={(e) => setSelectedViolatorFilter(e.target.value)}
            className={`w-full text-xs font-bold rounded-xl px-3 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              isLight 
                ? 'bg-purple-50/50 border border-purple-200 text-purple-950 font-bold' 
                : 'bg-slate-900 border border-slate-700 text-white font-bold'
            }`}
          >
            {VIOLATOR_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
