import React from 'react';
import { 
  ShieldAlert, 
  Trees, 
  Shield, 
  Banknote, 
  CheckCircle2, 
  Flame,
  UserCheck,
  Clock
} from 'lucide-react';

export default function KPISummary({ data, theme = 'light' }) {
  const isLight = theme === 'light';
  
  const totalIncidents = data.length;
  const totalArea = data.reduce((acc, curr) => acc + (Number(curr.tongDienTichBiPha) || 0), 0);
  
  // Violator statistics
  const withViolatorCount = data.filter(d => d.doiTuongViPham && d.doiTuongViPham.trim() !== "").length;
  const ownerlessCount = totalIncidents - withViolatorCount;
  
  // Fines & Payment statistics
  const totalFinesPaid = data.reduce((acc, curr) => acc + (Number(curr.tienPhat) || 0), 0);
  const unpaidCount = data.filter(d => (d.doiTuongViPham && d.doiTuongViPham.trim() !== "") && (d.ghiChu?.toLowerCase().includes("chưa nộp") || Number(d.tienPhat || 0) === 0)).length;

  const handledCount = data.filter(d => d.qdKPHQ_XPHC && d.qdKPHQ_XPHC.trim() !== "").length;
  const handledRate = totalIncidents > 0 ? Math.round((handledCount / totalIncidents) * 100) : 0;

  const currentYear = data[0]?.nam;
  const yearStr = currentYear ? `Năm ${currentYear}` : 'Tất cả các năm';

  const paidViolators = data
    .filter(d => (d.doiTuongViPham && d.doiTuongViPham.trim() !== "") && d.tienPhat > 0)
    .map(d => d.doiTuongViPham);
  const paidViolatorsStr = paidViolators.length > 0 ? paidViolators.join(", ") : "Chưa có tiền phạt";

  const unpaidViolators = data
    .filter(d => (d.doiTuongViPham && d.doiTuongViPham.trim() !== "") && (d.ghiChu?.toLowerCase().includes("chưa nộp") || Number(d.tienPhat || 0) === 0))
    .map(d => d.doiTuongViPham);
  const unpaidViolatorsStr = unpaidViolators.length > 0 ? unpaidViolators.join(", ") : "0 đối tượng nợ phạt";

  const cards = [
    {
      title: "Tổng Số Vụ Phá Rừng",
      value: `${totalIncidents} vụ`,
      sub: `${withViolatorCount} vụ có đối tượng | ${ownerlessCount} vụ vô chủ`,
      icon: ShieldAlert,
      bgLight: "bg-amber-500/10 border-amber-300 text-amber-950",
      bgDark: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-white",
      iconBgLight: "bg-amber-500 text-slate-950 font-bold",
      iconBgDark: "bg-slate-900/60 text-amber-400"
    },
    {
      title: "Tổng Diện Tích Bị Phá",
      value: `${totalArea.toFixed(2)} ha`,
      sub: `Theo báo cáo kiểm kê ${yearStr}`,
      icon: Flame,
      bgLight: "bg-rose-500/10 border-rose-300 text-rose-950",
      bgDark: "from-red-500/20 to-rose-500/10 border-red-500/30 text-white",
      iconBgLight: "bg-rose-600 text-white",
      iconBgDark: "bg-slate-900/60 text-rose-400"
    },
    {
      title: "Vụ Có Đối Tượng Vi Phạm",
      value: `${withViolatorCount} vụ`,
      sub: `Tách riêng tên đối tượng vi phạm`,
      icon: UserCheck,
      bgLight: "bg-emerald-500/10 border-emerald-300 text-emerald-950",
      bgDark: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-white",
      iconBgLight: "bg-emerald-600 text-white",
      iconBgDark: "bg-slate-900/60 text-emerald-400"
    },
    {
      title: "Tiền Phạt Đã Thu Nộp",
      value: `${(totalFinesPaid / 1000000).toLocaleString('vi-VN')} triệu đ`,
      sub: paidViolatorsStr,
      icon: Banknote,
      bgLight: "bg-purple-500/10 border-purple-300 text-purple-950",
      bgDark: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-white",
      iconBgLight: "bg-purple-600 text-white",
      iconBgDark: "bg-slate-900/60 text-purple-400"
    },
    {
      title: "Đối Tượng Chưa Nộp Phạt",
      value: `${unpaidCount} vụ`,
      sub: unpaidViolatorsStr,
      icon: Clock,
      bgLight: "bg-rose-500/15 border-rose-400 text-rose-950",
      bgDark: "from-rose-500/30 to-red-500/20 border-rose-500/40 text-white",
      iconBgLight: "bg-rose-700 text-white font-bold",
      iconBgDark: "bg-slate-900/60 text-rose-400"
    },
    {
      title: "Tỷ Lệ Ban Hành QĐ",
      value: `${handledRate}%`,
      sub: `${handledCount}/${totalIncidents} hồ sơ có QĐ`,
      icon: CheckCircle2,
      bgLight: "bg-teal-500/10 border-teal-300 text-teal-950",
      bgDark: "from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-white",
      iconBgLight: "bg-teal-600 text-white",
      iconBgDark: "bg-slate-900/60 text-teal-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className={`p-4 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
              isLight 
                ? card.bgLight 
                : `bg-gradient-to-br ${card.bgDark}`
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-extrabold tracking-tight uppercase ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                {card.title}
              </span>
              <div className={`p-2 rounded-xl shadow-sm ${
                isLight ? card.iconBgLight : card.iconBgDark
              }`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight mt-1">
              {card.value}
            </div>

            <div className={`text-[11px] font-bold mt-1.5 truncate ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`} title={card.sub}>
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
