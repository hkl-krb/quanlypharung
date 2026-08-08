import React, { useState } from 'react';
import { MapPin, Compass, Layers, Info, ShieldAlert, CheckCircle2, ExternalLink, Globe } from 'lucide-react';
import { convertVN2000ToWGS84, getWGS84Location } from '../utils/coordinateConverter';

export default function MapVisualizer({ data, theme = 'light' }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const isLight = theme === 'light';

  // Filter valid points with coordinates
  const validPoints = data.filter(d => d.viTriX && d.viTriY && d.viTriX > 0);

  const xValues = validPoints.map(p => p.viTriX);
  const yValues = validPoints.map(p => p.viTriY);
  
  const minX = Math.min(...xValues, 580000);
  const maxX = Math.max(...xValues, 588000);
  const minY = Math.min(...yValues, 1378000);
  const maxY = Math.max(...yValues, 1388000);

  const getPercentX = (x) => {
    if (maxX === minX) return 50;
    return Math.max(8, Math.min(92, ((x - minX) / (maxX - minX)) * 84 + 8));
  };

  const getPercentY = (y) => {
    if (maxY === minY) return 50;
    return Math.max(8, Math.min(92, 100 - (((y - minY) / (maxY - minY)) * 84 + 8)));
  };

  const selectedLocation = selectedPoint ? getWGS84Location(selectedPoint) : null;

  return (
    <div className="space-y-6">
      
      {/* Map Control Header */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/10 text-sky-400'}`}>
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Bản Đồ Định Vị Tọa Độ Vi Phạm (VN-2000 ➔ EPSG:4326 WGS84)
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              Tự động tính toán & chuyển đổi tọa độ VN-2000 Đắk Lắk sang WGS84 để ghim lên nền bản đồ Google Vệ tinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold ${
            isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Cư Pui ({data.filter(d => d.diaGioiHanhChinh === 'Cư Pui').length})</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold ${
            isLight ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Yang Mao ({data.filter(d => d.diaGioiHanhChinh === 'Yang Mao').length})</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Canvas */}
        <div className={`lg:col-span-2 rounded-2xl p-6 border relative min-h-[480px] flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-200 ${
          isLight ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-950/80 border-slate-800 text-slate-100'
        }`}>
          
          {/* Top Compass Overlay */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10 select-none">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Bản Đồ Định Vị VN-2000 Krông Bông (Khu vực Cư Pui - Yang Mao)</span>
            </div>
            <div className="bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 font-mono text-[11px] text-sky-400 font-bold">
              {validPoints.length} điểm tọa độ
            </div>
          </div>

          {/* Grid lines background simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415525_1px,transparent_1px),linear-gradient(to_bottom,#33415525_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

          <div className="absolute top-12 left-10 text-[10px] font-extrabold text-emerald-400/30 uppercase tracking-widest pointer-events-none">
            Rừng Phòng Hộ Krông Bông
          </div>
          <div className="absolute bottom-12 right-12 text-[10px] font-extrabold text-sky-400/30 uppercase tracking-widest pointer-events-none">
            Địa Bàn Xã Yang Mao
          </div>

          {/* Coordinate Markers Container */}
          <div className="relative w-full h-[380px] my-auto">
            {validPoints.map((pt) => {
              const posX = getPercentX(pt.viTriX);
              const posY = getPercentY(pt.viTriY);
              const isSelected = selectedPoint?.id === pt.id;
              const isCuPui = pt.diaGioiHanhChinh === 'Cư Pui';
              const wgs = getWGS84Location(pt);

              return (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <span className={`absolute -inset-1 rounded-full animate-ping opacity-40 ${
                    isCuPui ? 'bg-emerald-400' : 'bg-sky-400'
                  }`}></span>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 ring-2 ${
                    isCuPui 
                      ? 'bg-emerald-600 border-white text-white ring-emerald-500/30' 
                      : 'bg-sky-600 border-white text-white ring-sky-500/30'
                  } ${isSelected ? 'ring-4 ring-amber-400 bg-amber-500 border-amber-200' : ''}`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[11px] px-3 py-2 rounded-xl border border-slate-700 whitespace-nowrap shadow-2xl z-40 pointer-events-none">
                    <div className="font-bold text-emerald-400">TK {pt.tieuKhu} - K.{pt.khoanh} - Lô {pt.lo}</div>
                    <div className="text-[10px] text-slate-300">VN2000 X: {pt.viTriX} | Y: {pt.viTriY}</div>
                    {wgs && (
                      <div className="text-[10px] text-sky-400 font-mono mt-0.5">🌐 WGS84: {wgs.formatted}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 z-10">
            <span>Tọa độ VN-2000 X: {minX} - {maxX}</span>
            <span>Tọa độ VN-2000 Y: {minY} - {maxY}</span>
          </div>

        </div>

        {/* Selected Incident Detail & Google Satellite View Sidebar */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <Info className="w-4 h-4 text-emerald-600" />
              <h4 className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Tọa Độ & Vị Trí Bản Đồ Vệ Tinh</h4>
            </div>

            {selectedPoint ? (
              <div className="space-y-3 text-xs">
                
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <span className="text-[10px] uppercase font-bold text-emerald-600">Số Biên Bản Vi Phạm</span>
                  <div className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedPoint.bbvphc}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tiểu khu / Khoảnh / Lô</span>
                    <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      TK {selectedPoint.tieuKhu} - K.{selectedPoint.khoanh} - Lô {selectedPoint.lo}
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Diện Tích Thống Kê</span>
                    <div className="font-extrabold text-emerald-600 text-sm mt-0.5">
                      {selectedPoint.tongDienTichBiPha} ha
                    </div>
                  </div>
                </div>

                {/* VN-2000 to WGS84 Display Box */}
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  isLight ? 'bg-sky-50/80 border-sky-200 text-sky-950' : 'bg-sky-950/40 border-sky-800 text-sky-200'
                }`}>
                  <div className="font-bold text-[11px] text-sky-700 dark:text-sky-300 uppercase tracking-wide">
                    Hệ Tọa Độ Gốc VN-2000 Đắk Lắk:
                  </div>
                  <div className="font-mono text-xs flex justify-between">
                    <span>Tọa độ X (Easting): <strong>{selectedPoint.viTriX}</strong></span>
                    <span>Y (Northing): <strong>{selectedPoint.viTriY}</strong></span>
                  </div>

                  {selectedLocation && (
                    <div className="pt-2 mt-1 border-t border-sky-200 dark:border-sky-800/60">
                      <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        Chuyển Đổi Hệ Tọa Độ WGS 84 (EPSG:4326):
                      </div>
                      <div className="font-mono font-black text-sm text-emerald-800 dark:text-emerald-300 mt-0.5">
                        {selectedLocation.formatted}
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Maps Satellite Direct Button & Iframe */}
                {selectedLocation && (
                  <div className="space-y-2 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-extrabold text-xs transition shadow-md shadow-sky-600/30"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Trên Google Maps Vệ Tinh 🛰️</span>
                    </a>

                    <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-inner h-44 bg-slate-950">
                      <iframe
                        title="Google Maps Satellite View"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <Globe className="w-8 h-8 opacity-40 text-sky-500" />
                <p className="text-xs">Nhấp vào một điểm màu trên bản đồ để tự động chuyển tọa độ VN-2000 sang WGS84 và xem ảnh vệ tinh Google Maps.</p>
              </div>
            )}
          </div>

          <div className={`mt-4 pt-3 border-t text-[11px] ${isLight ? 'border-slate-200 text-slate-400' : 'border-slate-800 text-slate-500'}`}>
            Tự động tính toán theo tham số VN-2000 Đắk Lắk (múi 3°, kinh tuyến trục 108°30').
          </div>
        </div>

      </div>

    </div>
  );
}
