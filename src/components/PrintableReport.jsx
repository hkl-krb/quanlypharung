import React from 'react';
import { Printer, Download, ArrowLeft } from 'lucide-react';

export default function PrintableReport({ data, onExportExcel, onBack }) {
  const totalDienTichPha = data.reduce((sum, item) => sum + Number(item.tongDienTichBiPha || 0), 0);
  const totalRungSanXuat = data.reduce((sum, item) => sum + Number(item.rungSanXuat || 0), 0);
  const totalRungPhongHo = data.reduce((sum, item) => sum + Number(item.rungPhongHo || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại ứng dụng</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition shadow-md shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Tải Bảng Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl transition shadow-md shadow-purple-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo / Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet View Container */}
      <div className="printable-container bg-white text-black p-6 md:p-10 rounded-2xl shadow-2xl border border-slate-200 overflow-x-auto min-w-[1100px]">
        
        {/* Document Header */}
        <div className="text-center mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            CỤC KIỂM LÂM - HẠT KIỂM LÂM KHU VỰC KRÔNG BÔNG
          </div>
          <h2 className="text-xl font-extrabold uppercase mt-1 tracking-tight text-slate-900">
            BIỂU: TỔNG HỢP PHÁ RỪNG {data[0]?.nam ? `NĂM ${data[0].nam}` : 'MULTI-YEAR'}
          </h2>
          <p className="text-xs italic text-slate-500 mt-1">
            (Số liệu cập nhật phân loại đối tượng vi phạm & tiền phạt đã thu theo 20 cột chuẩn kiểm kê 2026)
          </p>
        </div>

        {/* Standard Official Table - 20 Columns */}
        <table className="w-full border-collapse border border-black text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold text-black border-b border-black">
              <th rowSpan={2} className="border border-black p-1.5 w-8">TT</th>
              <th rowSpan={2} className="border border-black p-1.5 w-24">BBVPHC<br/>(Số, ngày tháng)</th>
              <th rowSpan={2} className="border border-black p-1.5 w-20">Kế hoạch xác minh</th>
              <th rowSpan={2} className="border border-black p-1.5 w-16">Tiểu khu</th>
              <th rowSpan={2} className="border border-black p-1.5 w-14">Khoảnh</th>
              <th rowSpan={2} className="border border-black p-1.5 w-24">Lô</th>
              <th rowSpan={2} className="border border-black p-1.5 w-20">Tổng diện tích rừng bị phá (ha)</th>
              <th rowSpan={2} className="border border-black p-1.5 w-16">Hiện trạng rừng</th>
              <th colSpan={2} className="border border-black p-1.5">Loại rừng</th>
              <th rowSpan={2} className="border border-black p-1.5 w-24">QĐ KPHQ hoặc QĐ XPHC (Số, ngày tháng)</th>
              <th rowSpan={2} className="border border-black p-1.5 w-20">Địa giới hành chính</th>
              <th rowSpan={2} className="border border-black p-1.5 w-32">Chủ rừng</th>
              <th rowSpan={2} className="border border-black p-1.5 w-24">Báo cáo số</th>
              <th rowSpan={2} className="border border-black p-1.5 w-28">Đối tượng vi phạm</th>
              <th rowSpan={2} className="border border-black p-1.5 w-24">Số tiền phạt đã thu</th>
              <th rowSpan={2} className="border border-black p-1.5 w-20">BC PC</th>
              <th colSpan={2} className="border border-black p-1.5">Vị trí</th>
              <th rowSpan={2} className="border border-black p-1.5 w-24">Ghi chú</th>
            </tr>
            <tr className="bg-slate-100 text-center font-bold text-black border-b border-black">
              <th className="border border-black p-1 w-16">Rừng sản xuất (ha)</th>
              <th className="border border-black p-1 w-16">Rừng phòng hộ (ha)</th>
              <th className="border border-black p-1 w-12">X</th>
              <th className="border border-black p-1 w-12">Y</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, idx) => {
              const hasViolator = item.doiTuongViPham && item.doiTuongViPham.trim() !== "";
              const isUnpaid = hasViolator && (item.ghiChu?.toLowerCase().includes("chưa nộp") || item.soTienPhatDaThuStr?.toLowerCase().includes("chưa nộp") || Number(item.tienPhat || 0) === 0);

              let fineStr = "";
              if (hasViolator) {
                fineStr = isUnpaid ? "chưa nộp phạt" : (item.soTienPhatDaThuStr || (item.tienPhat ? item.tienPhat.toLocaleString('vi-VN') : ""));
              }

              return (
                <tr key={item.id} className="text-black hover:bg-slate-50">
                  <td className="border border-black p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-black p-1.5 text-center font-mono font-bold">{item.bbvphc}</td>
                  <td className="border border-black p-1.5 text-center">{item.keHoachXacMinh || ''}</td>
                  <td className="border border-black p-1.5 text-center font-mono">{item.tieuKhu}</td>
                  <td className="border border-black p-1.5 text-center font-mono">{item.khoanh}</td>
                  <td className="border border-black p-1.5 font-mono">{item.lo}</td>
                  <td className="border border-black p-1.5 text-right font-mono font-bold">{item.tongDienTichBiPha ?? ''}</td>
                  <td className="border border-black p-1.5 text-center font-mono">{item.hienTrangRung}</td>
                  <td className="border border-black p-1.5 text-right font-mono">{item.rungSanXuat > 0 ? item.rungSanXuat : ''}</td>
                  <td className="border border-black p-1.5 text-right font-mono">{item.rungPhongHo > 0 ? item.rungPhongHo : ''}</td>
                  <td className="border border-black p-1.5 text-center font-mono">{item.qdKPHQ_XPHC || ''}</td>
                  <td className="border border-black p-1.5 text-center">{item.diaGioiHanhChinh}</td>
                  <td className="border border-black p-1.5">{item.chuRung}</td>
                  <td className="border border-black p-1.5">{item.bcCty_bbXa_doiTuong || ''}</td>
                  <td className="border border-black p-1.5 font-bold">
                    {hasViolator ? (
                      <span className="text-purple-900">{item.doiTuongViPham}</span>
                    ) : (
                      <span className="text-slate-400 font-normal italic">Vô chủ</span>
                    )}
                  </td>
                  <td className="border border-black p-1.5 text-center font-mono font-bold">
                    {hasViolator ? (
                      isUnpaid ? (
                        <span className="text-rose-600">chưa nộp phạt</span>
                      ) : (
                        <span className="text-emerald-700">{fineStr}</span>
                      )
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="border border-black p-1.5 text-center font-mono text-[10px]">{item.bcPC}</td>
                  <td className="border border-black p-1.5 text-center font-mono text-[10px]">{item.viTriX || ''}</td>
                  <td className="border border-black p-1.5 text-center font-mono text-[10px]">{item.viTriY || ''}</td>
                  <td className="border border-black p-1.5 text-center font-semibold">{item.ghiChu || ''}</td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-slate-200 font-extrabold text-black text-center">
              <td colSpan={6} className="border border-black p-2 text-right">TỔNG CỘNG ({data.length} vụ):</td>
              <td className="border border-black p-2 text-right font-mono text-sm">{totalDienTichPha.toFixed(2)}</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-right font-mono">{totalRungSanXuat.toFixed(2)}</td>
              <td className="border border-black p-2 text-right font-mono">{totalRungPhongHo.toFixed(2)}</td>
              <td colSpan={10} className="border border-black p-2"></td>
            </tr>
          </tbody>
        </table>

        {/* Signatures Footer */}
        <div className="grid grid-cols-2 text-center mt-12 text-xs font-bold text-black">
          <div>
            <p className="uppercase">NGƯỜI LẬP BIỂU</p>
            <p className="text-[11px] font-normal italic text-slate-500 mt-0.5">(Ký, ghi rõ họ tên)</p>
            <div className="h-20"></div>
          </div>
          <div>
            <p className="uppercase">HẠT TRƯỞNG / PHÓ HẠT TRƯỞNG</p>
            <p className="text-[11px] font-normal italic text-slate-500 mt-0.5">(Ký, đóng dấu)</p>
            <div className="h-20"></div>
          </div>
        </div>

        {/* Copyright notice on document */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-center space-y-1">
          <div className="text-xs sm:text-sm font-extrabold text-black uppercase tracking-wide">
            Copyright: Bản quyền thuộc về Hạt Kiểm lâm khu vực Krông Bông
          </div>
          <div className="text-xs font-semibold text-slate-700">
            Hệ thống quản lý sử dụng nội bộ.
          </div>
        </div>

      </div>
    </div>
  );
}
