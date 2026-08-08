import React from 'react';
import { 
  LayoutDashboard, 
  TableProperties, 
  MapPin, 
  FileText, 
  Layers,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, theme = 'light' }) {
  const isLight = theme === 'light';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tổng Quan Lãnh Đạo',
      icon: LayoutDashboard,
      badge: 'BIỂU ĐỒ',
      description: 'Phân tích chỉ số KPI & tỷ lệ'
    },
    {
      id: 'prediction',
      label: 'Dự Báo & Điểm Nóng',
      icon: Sparkles,
      badge: 'DỰ BÁO AI',
      description: 'Xã, tiểu khu & dự báo nguy cơ'
    },
    {
      id: 'table',
      label: 'Bảng Số Liệu Chi Tiết',
      icon: TableProperties,
      badge: '19 CỘT',
      description: 'Quản lý, tìm kiếm & sửa dữ liệu'
    },
    {
      id: 'map',
      label: 'Bản Đồ Tọa Độ GIS',
      icon: MapPin,
      badge: 'TỌA ĐỘ X,Y',
      description: 'Trực quan điểm vi phạm theo X-Y'
    },
    {
      id: 'report',
      label: 'Báo Cáo Mẫu Chuẩn',
      icon: FileText,
      badge: 'EXCEL / IN',
      description: 'Biểu tổng hợp chuẩn 2026'
    }
  ];

  return (
    <aside className={`w-full md:w-64 p-3 md:p-4 shrink-0 transition-colors duration-200 ${
      isLight 
        ? 'bg-white border-b md:border-b-0 md:border-r border-slate-300 shadow-sm' 
        : 'bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-800'
    }`}>
      
      {/* Navigation Title */}
      <div className={`hidden md:flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider mb-3.5 px-3 ${
        isLight ? 'text-slate-700' : 'text-slate-400'
      }`}>
        <Layers className="w-4 h-4 text-emerald-700" />
        <span>Danh Mục Quản Lý</span>
      </div>

      {/* Menu List */}
      <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between p-3 rounded-2xl transition text-left shrink-0 md:w-full group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-lg font-extrabold'
                  : isLight 
                  ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition ${
                  isActive 
                    ? 'bg-amber-400 text-slate-950 font-bold' 
                    : isLight 
                    ? 'bg-slate-100 text-emerald-800 group-hover:bg-slate-200' 
                    : 'bg-slate-800 text-emerald-400 group-hover:text-emerald-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-sm leading-tight">{item.label}</div>
                  <div className={`text-[11px] mt-0.5 hidden md:block ${
                    isActive 
                      ? 'text-emerald-100 font-medium' 
                      : isLight 
                      ? 'text-slate-600 font-medium' 
                      : 'text-slate-400 font-normal'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 hidden md:block transition ${
                isActive ? 'text-amber-400 translate-x-0.5' : isLight ? 'text-slate-400 opacity-0 group-hover:opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'
              }`} />
            </button>
          );
        })}
      </nav>

      {/* Administrative Info Box */}
      <div className={`hidden md:block mt-8 p-3.5 rounded-2xl border ${
        isLight 
          ? 'bg-slate-100 border-slate-300' 
          : 'bg-slate-800/60 border-slate-700'
      }`}>
        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 mb-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-700" />
          <span>Đơn Vị Quản Lý</span>
        </div>
        <p className={`text-xs font-extrabold ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>Hạt Kiểm lâm khu vực Krông Bông</p>
        <p className={`text-[11px] mt-1 font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Đô thị Krông Kmar, Huyện Krông Bông, Tỉnh Đắk Lắk</p>
      </div>

    </aside>
  );
}
