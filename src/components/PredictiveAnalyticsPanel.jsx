import React from 'react';
import { 
  AlertOctagon, 
  Flame, 
  MapPin, 
  TrendingUp, 
  ShieldAlert, 
  Compass, 
  Award, 
  Sparkles,
  ArrowRight,
  Info,
  Calendar
} from 'lucide-react';
import { analyzeHotspotsAndPredict } from '../utils/predictiveModel';

export default function PredictiveAnalyticsPanel({ data, theme = 'light' }) {
  const isLight = theme === 'light';
  const analysis = analyzeHotspotsAndPredict(data);

  return (
    <div className="space-y-6">
      
      {/* Executive Summary Banner - Deep High Contrast Emerald Gradient */}
      <div className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white border border-emerald-700/60 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shrink-0">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Trí Tuệ Phân Tích & Dự Báo Phá Rừng
                </span>
                <span className="bg-slate-950/60 text-slate-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-slate-700">
                  Dựa trên số liệu cell & tọa độ
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1.5 drop-shadow-sm">
                Báo Cáo Điểm Nóng & Dự Báo Nguy Cơ Phá Rừng Tương Lai
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Hệ thống phân tích tần suất lịch sử, tốc độ biến động diện tích và cụm tọa độ nhằm chỉ ra chính xác các địa bàn đang bị phá nhiều nhất và dự báo các khu vực có nguy cơ cao trong thời gian tới.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-emerald-500/40 p-3.5 rounded-2xl shrink-0 shadow-lg">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div className="text-xs">
              <div className="text-slate-300 font-medium">Dự báo cho khoảng thời gian:</div>
              <div className="font-extrabold text-amber-300 text-sm">Tháng 08 - Tháng 12/2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 Section 1: TOP HOTSPOTS */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className={`font-extrabold text-base tracking-wide uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Danh Sách Điểm Nóng Phá Rừng Nặng Nhất
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Top 1: Commune */}
          <div className="bg-gradient-to-b from-amber-50/80 to-white dark:from-amber-950/20 dark:to-slate-900 border border-amber-200/60 dark:border-amber-900/50 shadow-md rounded-2xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
                <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Xã Bị Phá Nhiều Nhất
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  TOP XÃ
                </span>
              </div>

              {analysis.topCommunes.slice(0, 3).map((commune, idx) => (
                <div key={idx} className={`p-3 rounded-xl border mb-2.5 shadow-sm transition hover:shadow-md ${
                  isLight ? 'bg-white border-amber-100' : 'bg-slate-900/50 border-amber-900/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-xs shadow-sm ${
                        idx === 0 ? 'bg-amber-500 text-slate-950' : idx === 1 ? 'bg-slate-400 text-slate-950' : 'bg-amber-800 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{commune.name}</span>
                    </div>
                    <span className="font-mono font-extrabold text-amber-700 text-sm">
                      {commune.totalArea} ha
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 flex justify-between ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                    <span>Số vụ vi phạm: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{commune.count} vụ</strong></span>
                    <span>Tần suất: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{commune.monthFreq} tháng</strong></span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`text-[11px] pt-2 border-t italic font-medium ${isLight ? 'border-slate-300 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
              Địa giới hành chính cần tăng cường phối hợp Lực lượng xã.
            </div>
          </div>

          {/* Top 2: Sub-area */}
          <div className="bg-gradient-to-b from-rose-50/80 to-white dark:from-rose-950/20 dark:to-slate-900 border border-rose-200/60 dark:border-rose-900/50 shadow-md rounded-2xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
                <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  Tiểu Khu Bị Phá Nặng Nhất
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  TOP TIỂU KHU
                </span>
              </div>

              {analysis.topTieuKhus.slice(0, 3).map((tk, idx) => (
                <div key={idx} className={`p-3 rounded-xl border mb-2.5 shadow-sm transition hover:shadow-md ${
                  isLight ? 'bg-white border-rose-100' : 'bg-slate-900/50 border-rose-900/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-xs shadow-sm ${
                        idx === 0 ? 'bg-rose-600 text-white' : idx === 1 ? 'bg-slate-400 text-slate-950' : 'bg-rose-900 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`font-mono font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>TK {tk.tieuKhu}</span>
                      <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>({tk.commune})</span>
                    </div>
                    <span className="font-mono font-extrabold text-rose-700 text-sm">
                      {tk.totalArea} ha
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 flex justify-between ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                    <span>Ghi nhận: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{tk.count} vụ việc</strong></span>
                    <span className="truncate max-w-[130px]" title={tk.chuRung}>{tk.chuRung}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`text-[11px] pt-2 border-t italic font-medium ${isLight ? 'border-slate-300 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
              Tiểu khu rủi ro cao nhất cần lập chốt liên ngành.
            </div>
          </div>

          {/* Top 3: Plot */}
          <div className="bg-gradient-to-b from-teal-50/80 to-white dark:from-teal-950/20 dark:to-slate-900 border border-teal-200/60 dark:border-teal-900/50 shadow-md rounded-2xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <div className={`flex items-center justify-between mb-3 pb-2 border-b ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
                <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-600" />
                  Khoảnh Phá Rừng Dày Đặc
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-teal-100 text-teal-900 border-teal-300' : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                }`}>
                  TOP KHOẢNH
                </span>
              </div>

              {analysis.topKhoanhs.slice(0, 3).map((khoanh, idx) => (
                <div key={idx} className={`p-3 rounded-xl border mb-2.5 shadow-sm transition hover:shadow-md ${
                  isLight ? 'bg-white border-teal-100' : 'bg-slate-900/50 border-teal-900/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-mono font-extrabold text-xs truncate max-w-[170px] ${isLight ? 'text-slate-900' : 'text-white'}`} title={khoanh.name}>
                      {khoanh.name}
                    </span>
                    <span className="font-mono font-extrabold text-teal-700 text-sm">
                      {khoanh.totalArea} ha
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 flex justify-between ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                    <span>Phát hiện: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{khoanh.count} vụ</strong></span>
                    <span className="font-mono font-bold">K.{khoanh.khoanh}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`text-[11px] pt-2 border-t italic font-medium ${isLight ? 'border-slate-300 text-slate-600' : 'border-slate-400'}`}>
              Khoảnh bị tác động nhiều nhất cần kiểm tra thực địa.
            </div>
          </div>

        </div>
      </div>

      {/* 🔮 Section 2: AI / DATA-DRIVEN FUTURE RISK PREDICTION TABLE */}
      <div className="glass-panel rounded-2xl border shadow-xl overflow-hidden">
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between flex-wrap gap-3 ${
          isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Bảng Dự Báo Nguy Cơ & Khuyến Nghị Tăng Cường Bảo Vệ
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Dự báo chỉ số rủi ro (Risk Score) cho các tháng tới dựa trên xu hướng chuỗi thời gian
              </p>
            </div>
          </div>

          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
            isLight ? 'bg-white text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            Tự động tính toán theo số liệu cell & tọa độ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-extrabold text-[11px] uppercase ${
                isLight ? 'bg-slate-200 text-slate-900 border-slate-300' : 'bg-slate-950 text-slate-200 border-slate-800'
              }`}>
                <th className="py-3 px-4 w-12 text-center">Hạng</th>
                <th className="py-3 px-4">Tiểu Khu / Xã</th>
                <th className="py-3 px-4">Chủ Rừng</th>
                <th className="py-3 px-4 text-center">Diện tích phá (ha)</th>
                <th className="py-3 px-4 text-center">Số vụ vi phạm</th>
                <th className="py-3 px-4 text-center">Mức Nguy Cơ Dự Báo</th>
                <th className="py-3 px-4">Khuyến Nghị Cho Kiểm Lâm & Lãnh Đạo</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-300 text-slate-900' : 'divide-slate-800/70 text-slate-200'}`}>
              {analysis.predictions.map((item, index) => (
                <tr key={index} className={`transition duration-150 ${
                  index % 2 === 0 
                    ? (isLight ? 'bg-white' : 'bg-slate-900/40') 
                    : (isLight ? 'bg-slate-50' : 'bg-slate-950/40')
                } ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800/40'}`}>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-slate-500">
                    #{index + 1}
                  </td>

                  <td className="py-3 px-4">
                    <div className={`font-extrabold text-sm font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>TK {item.tieuKhu}</div>
                    <div className={`text-[11px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Xã {item.commune}</div>
                  </td>

                  <td className={`py-3 px-4 font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {item.chuRung}
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-extrabold text-rose-700 text-sm">
                    {item.totalArea} ha
                  </td>

                  <td className={`py-3 px-4 text-center font-mono font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {item.count} vụ
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-sm ${item.riskBadgeColor}`}>
                      {item.riskLevel} ({item.riskScore}%)
                    </span>
                  </td>

                  <td className={`py-3 px-4 font-semibold leading-relaxed max-w-[340px] ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {item.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`p-4 border-t flex items-center justify-between text-xs font-bold ${
          isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Info className="w-4 h-4 shrink-0" />
            <span>Mô hình sẽ tự động cập nhật khi người dùng nạp thêm dữ liệu Excel hoặc Tọa độ X,Y mới!</span>
          </div>
        </div>
      </div>

    </div>
  );
}
