import React from 'react';
import { 
  TreePine, 
  FileSpreadsheet, 
  PlusCircle, 
  Printer, 
  Upload, 
  ShieldAlert,
  BarChart3,
  LogOut,
  Users,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  currentUser,
  theme = 'light',
  onToggleTheme,
  onLogout,
  onOpenUserManagement,
  onOpenAddModal, 
  onExportExcel, 
  onImportExcel, 
  onPrintReport,
  totalRecords,
  totalArea,
  selectedYear = 2026,
  setSelectedYear
}) {
  const permissions = currentUser?.permissions || {};
  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-30 px-4 lg:px-8 py-3.5 border-b transition-colors duration-200 ${
      isLight 
        ? 'bg-white/90 backdrop-blur-md border-slate-200/90 shadow-sm' 
        : 'bg-slate-900/90 backdrop-blur-md border-slate-800 shadow-xl'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20">
            <TreePine className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                isLight 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                Hạt Kiểm Lâm Krông Bông
              </span>
              
              {/* Year Switcher Button Group */}
              {setSelectedYear && (
                <div className={`flex items-center p-0.5 rounded-xl border ${
                  isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800 border-slate-700'
                }`}>
                  <button
                    onClick={() => setSelectedYear(2026)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold transition ${
                      selectedYear === 2026 
                        ? 'bg-emerald-700 text-white shadow-sm' 
                        : isLight ? 'text-slate-700 hover:text-emerald-800' : 'text-slate-300 hover:text-emerald-400'
                    }`}
                  >
                    Năm 2026 (41 vụ)
                  </button>
                  <button
                    onClick={() => setSelectedYear(2025)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold transition ${
                      selectedYear === 2025 
                        ? 'bg-emerald-700 text-white shadow-sm' 
                        : isLight ? 'text-slate-700 hover:text-emerald-800' : 'text-slate-300 hover:text-emerald-400'
                    }`}
                  >
                    Năm 2025 (153 vụ)
                  </button>
                  <button
                    onClick={() => setSelectedYear(0)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold transition ${
                      selectedYear === 0 
                        ? 'bg-blue-700 text-white shadow-sm' 
                        : isLight ? 'text-slate-700 hover:text-blue-800' : 'text-slate-300 hover:text-blue-400'
                    }`}
                  >
                    Tất cả các năm (194 vụ)
                  </button>
                </div>
              )}
            </div>
            <h1 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Hệ Thống Quản Lý & Báo Cáo Phá Rừng {selectedYear === 0 ? 'Tổng Hợp Multi-Year' : `Năm ${selectedYear}`}
            </h1>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title="Đổi giao diện Sáng / Tối"
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Giao diện Tối</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Giao diện Sáng</span>
              </>
            )}
          </button>

          {/* Logged in User Profile Badge */}
          {currentUser && (
            <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border shadow-sm ${
              isLight 
                ? 'bg-slate-50 border-slate-200' 
                : 'bg-slate-950 border-slate-800'
            }`}>
              <div className={`w-7 h-7 rounded-lg ${currentUser.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow`}>
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span className={isLight ? 'text-slate-900' : 'text-white'}>{currentUser.fullName}</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                    currentUser.role === 'LEADER'
                      ? (isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30')
                      : currentUser.role === 'STAFF'
                      ? (isLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-sky-500/10 text-sky-400 border-sky-500/30')
                      : (isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-500/10 text-purple-400 border-purple-500/30')
                  }`}>
                    {currentUser.roleName}
                  </span>
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{currentUser.title}</div>
              </div>

              {/* User Management */}
              <button
                onClick={onOpenUserManagement}
                className={`ml-1 p-1.5 rounded-lg transition ${
                  isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'
                }`}
                title="Quản lý tài khoản & Phân quyền"
              >
                <Users className="w-4 h-4 text-purple-600" />
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className={`p-1.5 rounded-lg transition ${
                  isLight ? 'hover:bg-rose-100 text-slate-600 hover:text-rose-600' : 'hover:bg-slate-800 text-slate-400 hover:text-rose-400'
                }`}
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {permissions.canImportExcel && (
              <label className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer transition border shadow-sm ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}>
                <Upload className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden sm:inline">Nhập File Excel</span>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  className="hidden" 
                  onChange={onImportExcel}
                />
              </label>
            )}

            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất File Excel</span>
            </button>

            <button
              onClick={onPrintReport}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition border shadow-sm ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="In / Xem bản PDF"
            >
              <Printer className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">Báo Cáo PDF</span>
            </button>

            {permissions.canAddIncident && (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-teal-500/20 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm Vụ Việc</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
