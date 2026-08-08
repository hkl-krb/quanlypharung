import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TableProperties, 
  MapPin, 
  FileText, 
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenUserManagement, theme = 'light' }) {
  const isLight = theme === 'light';

  // Slide 2 ảnh thực tế Kiểm lâm Krông Bông (Chỉ hiển thị ảnh thuần túy, không có chữ)
  const [currentSlide, setCurrentSlide] = useState(0);
  const baseUrl = import.meta.env.BASE_URL || './';
  const slides = [
    { src: `${baseUrl}images/ranger1.jpg` },
    { src: `${baseUrl}images/ranger2.jpg` }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
    <aside className={`w-full md:w-64 p-3 md:p-4 shrink-0 transition-colors duration-200 flex flex-col justify-between ${
      isLight 
        ? 'bg-white border-b md:border-b-0 md:border-r border-slate-300 shadow-sm' 
        : 'bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-800'
    }`}>
      <div>
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
                className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left shrink-0 md:w-full group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-lg font-extrabold border border-transparent'
                    : isLight 
                    ? 'sidebar-menu-inactive text-slate-800 hover:text-slate-950 hover:bg-slate-50/80 font-bold border border-slate-200 hover:border-emerald-300 hover:shadow-md' 
                    : 'sidebar-menu-inactive text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/50 hover:border-emerald-600/50'
                }`}
                style={!isActive ? {
                  background: isLight
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)'
                    : 'linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.5) 100%)',
                } : {}}
              >
                {/* Subtle animated border shimmer for inactive items */}
                {!isActive && (
                  <span className={`absolute inset-0 rounded-2xl pointer-events-none overflow-hidden`}>
                    <span className={`absolute inset-0 rounded-2xl border ${
                      isLight ? 'border-slate-200/70' : 'border-slate-700/40'
                    }`} />
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' 
                      : isLight 
                      ? 'bg-slate-100 text-emerald-800 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:shadow-sm' 
                      : 'bg-slate-800/80 text-emerald-400 group-hover:text-emerald-300 group-hover:bg-slate-700/80'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm leading-tight">{item.label}</div>
                    <div className={`text-[11px] mt-0.5 hidden md:block ${
                      isActive 
                        ? 'text-emerald-100 font-medium' 
                        : isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 hidden md:block transition-transform ${
                  isActive ? 'text-amber-400 translate-x-0.5' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        {/* Admin User Management Button */}
        {onOpenUserManagement && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onOpenUserManagement}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300/60 hover:border-purple-400/80 font-extrabold text-xs transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div className="text-left">
                <div>⚙️ Quản Lý Người Dùng</div>
                <div className="text-[10px] font-normal text-purple-600/80 dark:text-purple-400/80">Sửa đổi thông tin & phân quyền</div>
              </div>
            </button>
          </div>
        )}

        {/* Đơn vị quản lý & Slide 2 ảnh thuần túy */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-400 px-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đơn Vị Quản Lý</span>
          </div>

          {/* 2-Image Pure Slide Carousel (No text/captions) */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-md group">
            <div className="relative h-40 w-full overflow-hidden bg-slate-950">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt="Lực lượng Kiểm lâm Krông Bông"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Left / Right Navigation Buttons */}
            <button
              onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white transition z-20 opacity-0 group-hover:opacity-100 shadow"
              title="Ảnh trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white transition z-20 opacity-0 group-hover:opacity-100 shadow"
              title="Ảnh tiếp theo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Carousel Slide Dots (Subtle) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-slate-950/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-emerald-400 w-3.5' : 'bg-white/60 w-1.5'
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Agency Details */}
          <div className={`p-2.5 rounded-xl text-xs space-y-0.5 text-center ${
            isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-950/60 text-slate-300'
          }`}>
            <div className="font-extrabold text-emerald-800 dark:text-emerald-400">
              <div>Hạt Kiểm lâm khu vực</div>
              <div>Krông Bông</div>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Địa chỉ: xã Krông Bông, Tỉnh Đắk Lắk
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
