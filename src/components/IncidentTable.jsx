import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  FileText,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  UserCheck,
  UserX,
  Clock,
  Banknote
} from 'lucide-react';
import { getWGS84Location } from '../utils/coordinateConverter';

export default function IncidentTable({ 
  data, 
  userPermissions = {},
  onEditItem, 
  onDeleteItem, 
  onViewItemDetail,
  theme = 'light'
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('stt');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isCompact, setIsCompact] = useState(true);
  const itemsPerPage = 15;

  const isLight = theme === 'light';
  const canEdit = userPermissions.canEditIncident !== false;
  const canDelete = userPermissions.canDeleteIncident !== false;

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal = a[sortField] ?? '';
    let bVal = b[sortField] ?? '';
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return sortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal), 'vi') 
      : String(bVal).localeCompare(String(aVal), 'vi');
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="glass-panel rounded-2xl border shadow-xl overflow-hidden transition-all duration-200">
      
      {/* Table Top Header */}
      <div className={`p-3.5 border-b flex items-center justify-between flex-wrap gap-3 ${
        isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-950/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <FileText className={`w-4 h-4 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
          <h3 className={`font-extrabold text-xs sm:text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Bảng Số Liệu Chi Tiết Vụ Vi Phạm Phá Rừng {data[0]?.nam ? `Năm ${data[0].nam}` : 'Tổng Hợp Multi-Year'} (20 Cột Chuẩn Excel)
          </h3>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
            isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            Ô trống = Phá rừng Vô chủ
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCompact(!isCompact)}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 text-emerald-500" />
            <span>{isCompact ? 'Chế độ vừa màn hình' : 'Thu nhỏ cột hơn nữa'}</span>
          </button>

          <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Hiển thị <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{paginatedData.length}</span> / <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{data.length}</span> bản ghi
          </div>
        </div>
      </div>

      {/* Table Scroll Container */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-[11px] border-collapse">
          
          {/* Compact Table Headers */}
          <thead>
            <tr className={`border-b select-none font-extrabold text-[10px] sm:text-[11px] uppercase ${
              isLight ? 'bg-slate-200/90 text-slate-800 border-slate-300' : 'bg-slate-950 text-slate-200 border-slate-800'
            }`}>
              <th className="py-2.5 px-1.5 text-center border-r border-slate-300/40 w-8">TT</th>
              <th 
                onClick={() => handleSort('bbvphc')}
                className="py-2.5 px-2 cursor-pointer hover:bg-slate-300/50 transition border-r border-slate-300/40 w-[85px]"
              >
                <div className="flex items-center justify-between">
                  <span>BBVPHC</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th className="py-2.5 px-1.5 border-r border-slate-300/40 w-[55px]">TK</th>
              <th className="py-2.5 px-1.5 border-r border-slate-300/40 w-[45px]">Khoảnh</th>
              <th className="py-2.5 px-1.5 border-r border-slate-300/40 w-[75px]">Lô</th>
              <th 
                onClick={() => handleSort('tongDienTichBiPha')}
                className="py-2.5 px-2 text-right cursor-pointer hover:bg-slate-300/50 transition border-r border-slate-300/40 w-[75px] text-emerald-700"
              >
                <div className="flex items-center justify-end gap-0.5">
                  <span>DT (ha)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
              <th className="py-2.5 px-1 text-center border-r border-slate-300/40 w-[55px]">HT</th>
              <th className="py-2.5 px-1.5 text-right border-r border-slate-300/40 w-[65px] text-teal-700">Rừng SX</th>
              <th className="py-2.5 px-1.5 text-right border-r border-slate-300/40 w-[65px] text-sky-700">Rừng PH</th>
              <th className="py-2.5 px-2 border-r border-slate-300/40 w-[95px]">QĐ XPHC</th>
              <th className="py-2.5 px-1.5 border-r border-slate-300/40 w-[65px]">Địa giới</th>
              <th className="py-2.5 px-2 border-r border-slate-300/40 w-[110px]">Chủ rừng</th>
              <th className="py-2.5 px-2 border-r border-slate-300/40 w-[115px]">Báo cáo số</th>
              <th className="py-2.5 px-2 border-r border-slate-300/40 w-[125px] text-purple-900 dark:text-purple-300">Đối tượng vi phạm</th>
              <th className="py-2.5 px-2 border-r border-slate-300/40 w-[110px] text-center text-amber-900 dark:text-amber-300">Số tiền phạt đã thu</th>
              <th className="py-2.5 px-1.5 border-r border-slate-300/40 w-[60px]">BC PC</th>
              <th className="py-2.5 px-1.5 text-center border-r border-slate-300/40 w-[80px]">Tọa độ X,Y</th>
              
              {/* STICKY FIXED RIGHT ACTION COLUMN */}
              <th className={`py-2.5 px-2 text-center sticky right-0 z-20 w-[105px] shadow-[-6px_0_12px_rgba(0,0,0,0.06)] ${
                isLight ? 'bg-slate-200/95 text-slate-900 border-l border-slate-300' : 'bg-slate-950 text-white border-l border-slate-800'
              }`}>
                Cập nhật / Sửa
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`divide-y ${isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800/60 text-slate-200'}`}>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-amber-500 opacity-60" />
                    <p className="font-bold text-sm">Không tìm thấy bản ghi thỏa mãn điều kiện lọc.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                const hasHandled = item.qdKPHQ_XPHC && item.qdKPHQ_XPHC.trim() !== "";
                const hasViolator = item.doiTuongViPham && item.doiTuongViPham.trim() !== "";
                const isUnpaid = hasViolator && (item.ghiChu?.toLowerCase().includes("chưa nộp") || item.soTienPhatDaThuStr?.toLowerCase().includes("chưa nộp") || Number(item.tienPhat || 0) === 0);
                const isEven = index % 2 === 0;

                return (
                  <tr 
                    key={item.id}
                    className={`transition duration-150 group ${
                      isEven 
                        ? (isLight ? 'bg-white' : 'bg-slate-900/40') 
                        : (isLight ? 'bg-slate-50/80' : 'bg-slate-950/40')
                    } ${isLight ? 'hover:bg-emerald-50/60' : 'hover:bg-slate-800/60'}`}
                  >
                    <td className="py-2 px-1.5 text-center font-mono font-medium text-slate-400 border-r border-slate-200/50">
                      {globalIndex}
                    </td>

                    <td className={`py-2 px-2 font-extrabold border-r border-slate-200/50 whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {item.bbvphc}
                    </td>

                    <td className="py-2 px-1.5 font-mono font-bold text-emerald-600 border-r border-slate-200/50 whitespace-nowrap">
                      {item.tieuKhu}
                    </td>

                    <td className="py-2 px-1.5 text-center font-mono font-semibold border-r border-slate-200/50 whitespace-nowrap">
                      {item.khoanh}
                    </td>

                    <td className="py-2 px-1.5 font-mono font-bold text-amber-600 border-r border-slate-200/50 max-w-[75px] truncate" title={item.lo}>
                      {item.lo}
                    </td>

                    <td className="py-2 px-2 text-right font-extrabold text-emerald-600 border-r border-slate-200/50 whitespace-nowrap">
                      {Number(item.tongDienTichBiPha || 0).toFixed(2)}
                    </td>

                    <td className="py-2 px-1 text-center border-r border-slate-200/50">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                        isLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {item.hienTrangRung}
                      </span>
                    </td>

                    <td className="py-2 px-1.5 text-right font-mono font-semibold text-teal-600 border-r border-slate-200/50 whitespace-nowrap">
                      {item.rungSanXuat > 0 ? item.rungSanXuat.toFixed(2) : '-'}
                    </td>

                    <td className="py-2 px-1.5 text-right font-mono font-semibold text-sky-600 border-r border-slate-200/50 whitespace-nowrap">
                      {item.rungPhongHo > 0 ? item.rungPhongHo.toFixed(2) : '-'}
                    </td>

                    <td className="py-2 px-2 border-r border-slate-200/50 max-w-[95px] truncate" title={item.qdKPHQ_XPHC}>
                      {hasHandled ? (
                        <span className="text-emerald-600 font-bold text-[10px] inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{item.qdKPHQ_XPHC}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">Chưa ra QĐ</span>
                      )}
                    </td>

                    <td className="py-2 px-1.5 font-bold border-r border-slate-200/50 whitespace-nowrap">
                      {item.diaGioiHanhChinh}
                    </td>

                    <td className="py-2 px-2 font-medium border-r border-slate-200/50 max-w-[110px] truncate text-[10.5px]" title={item.chuRung}>
                      {item.chuRung}
                    </td>

                    {/* Báo cáo số (Cột 14) */}
                    <td className="py-2 px-2 border-r border-slate-200/50 max-w-[115px] truncate text-[10.5px]" title={item.bcCty_bbXa_doiTuong}>
                      {item.bcCty_bbXa_doiTuong || '-'}
                    </td>

                    {/* Đối tượng vi phạm (Cột 15) */}
                    <td className="py-2 px-2 border-r border-slate-200/50 whitespace-nowrap">
                      {hasViolator ? (
                        <span className="font-extrabold text-[11.5px] text-purple-900 dark:text-purple-300 inline-flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          {item.doiTuongViPham}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-normal italic">
                          <UserX className="w-3 h-3 opacity-50" />
                          Vô chủ
                        </span>
                      )}
                    </td>

                    {/* Số tiền phạt đã thu (Cột 16) */}
                    <td className="py-2 px-2 border-r border-slate-200/50 text-center whitespace-nowrap">
                      {hasViolator ? (
                        isUnpaid ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded border bg-rose-100 text-rose-800 border-rose-300">
                            <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                            chưa nộp phạt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-mono font-extrabold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border bg-emerald-50 border-emerald-200">
                            <Banknote className="w-3 h-3 text-emerald-600 shrink-0" />
                            {item.soTienPhatDaThuStr || `${(item.tienPhat).toLocaleString('vi-VN')}`}
                          </span>
                        )
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">-</span>
                      )}
                    </td>

                    <td className="py-2 px-1.5 border-r border-slate-200/50 font-mono text-[10px] text-center whitespace-nowrap">
                      {item.bcPC}
                    </td>

                    <td className="py-2 px-1.5 text-center border-r border-slate-200/50">
                      {item.viTriX && item.viTriY ? (() => {
                        const wgs = getWGS84Location(item);
                        return (
                          <span className={`inline-flex items-center gap-0.5 text-[9.5px] font-mono px-1 py-0.5 rounded border ${
                            isLight ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-sky-950/60 text-sky-400 border-sky-800/50'
                          }`} title={`VN-2000 X: ${item.viTriX}, Y: ${item.viTriY} ${wgs ? `| WGS84: ${wgs.formatted}` : ''}`}>
                            <MapPin className="w-2.5 h-2.5" />
                            {item.viTriX}
                          </span>
                        );
                      })() : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* STICKY FIXED RIGHT ACTION COLUMN (Nút Sửa & Cập Nhật) */}
                    <td className={`py-2 px-2 text-center sticky right-0 z-10 shadow-[-6px_0_12px_rgba(0,0,0,0.06)] border-l ${
                      isEven 
                        ? (isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800') 
                        : (isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800')
                    }`}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewItemDetail(item)}
                          className={`p-1 rounded-lg transition ${
                            isLight ? 'hover:bg-slate-200 text-slate-600 hover:text-sky-600' : 'hover:bg-slate-700 text-slate-400 hover:text-sky-400'
                          }`}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {canEdit && (
                          <button
                            onClick={() => onEditItem(item)}
                            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-1 rounded-lg transition shadow-sm"
                            title="Sửa & Cập nhật vụ việc này"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className={`p-1 rounded-lg transition ${
                              isLight ? 'hover:bg-rose-100 text-slate-500 hover:text-rose-600' : 'hover:bg-slate-700 text-slate-400 hover:text-rose-400'
                            }`}
                            title="Xóa bản ghi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className={`p-3 border-t flex items-center justify-between ${
        isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950/80 border-slate-800'
      }`}>
        <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Trang <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentPage}</span> / <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{totalPages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition border ${
              isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            ).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-extrabold transition ${
                  currentPage === pageNum
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isLight 
                    ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200' 
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition border ${
              isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
