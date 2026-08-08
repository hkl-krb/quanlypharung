import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, AlertCircle, UserCheck, Banknote, MapPin, Globe } from 'lucide-react';
import { COMMUNE_OPTIONS, FOREST_OWNER_OPTIONS, MONTH_OPTIONS } from '../data/initialData';
import { convertVN2000ToWGS84 } from '../utils/coordinateConverter';

export default function IncidentModal({ isOpen, onClose, onSave, editingItem, selectedYear = 2026 }) {
  const [formData, setFormData] = useState({
    nam: 2026,
    bbvphc: '',
    keHoachXacMinh: '',
    tieuKhu: '',
    khoanh: '',
    lo: '',
    dienTichBaoCao: 0.1,
    tongDienTichBiPha: 0.1,
    hienTrangRung: 'txg',
    rungSanXuat: 0.1,
    rungPhongHo: 0,
    qdKPHQ_XPHC: '',
    diaGioiHanhChinh: 'Cư Pui',
    chuRung: 'Công ty Lâm nghiệp Krông Bông',
    bcCty_bbXa_doiTuong: '',
    doiTuongViPham: '',
    bcPC: 'BC PC tháng 01',
    thang: 1,
    quy: 1,
    viTriX: 582500,
    viTriY: 1385200,
    ghiChu: '',
    tienPhat: 0,
    trangThaiNopPhat: 'Vô chủ'
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({ 
        ...editingItem,
        nam: editingItem.nam || 2026,
        doiTuongViPham: editingItem.doiTuongViPham || '',
        trangThaiNopPhat: editingItem.trangThaiNopPhat || (editingItem.doiTuongViPham ? 'Đã nộp phạt' : 'Vô chủ')
      });
    } else {
      const defaultYear = selectedYear !== 0 ? selectedYear : 2026;
      setFormData({
        nam: defaultYear,
        bbvphc: `${Math.floor(Math.random() * 50 + 150)}.${new Date().getDate()}.${new Date().getMonth() + 1}`,
        keHoachXacMinh: '',
        tieuKhu: '1153',
        khoanh: '1',
        lo: '1a',
        dienTichBaoCao: 0.15,
        tongDienTichBiPha: 0.15,
        hienTrangRung: 'txg',
        rungSanXuat: 0.15,
        rungPhongHo: 0,
        qdKPHQ_XPHC: '',
        diaGioiHanhChinh: 'Cư Pui',
        chuRung: 'Công ty Lâm nghiệp Krông Bông',
        bcCty_bbXa_doiTuong: '',
        doiTuongViPham: '',
        bcPC: 'BC PC tháng 01',
        thang: 1,
        quy: 1,
        viTriX: 582500,
        viTriY: 1385200,
        ghiChu: '',
        tienPhat: 0,
        trangThaiNopPhat: 'Vô chủ'
      });
    }
  }, [editingItem, isOpen, selectedYear]);

  if (!isOpen) return null;

  const convertedWGS84 = convertVN2000ToWGS84(formData.viTriX, formData.viTriY);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      lat: convertedWGS84?.lat,
      lng: convertedWGS84?.lng
    };
    onSave(finalData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = type === 'number' ? parseFloat(value) || 0 : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: finalValue };

      // Auto update Quarter when Month changes
      if (name === 'thang') {
        const m = Number(finalValue);
        updated.quy = Math.ceil(m / 3);
        updated.bcPC = `BC PC tháng ${m.toString().padStart(2, '0')}`;
      }

      // Auto update Total Deforested Area if Rừng Sản Xuất or Rừng Phòng Hộ changes
      if (name === 'rungSanXuat' || name === 'rungPhongHo') {
        const rsx = name === 'rungSanXuat' ? Number(finalValue) : Number(prev.rungSanXuat || 0);
        const rph = name === 'rungPhongHo' ? Number(finalValue) : Number(prev.rungPhongHo || 0);
        updated.tongDienTichBiPha = Number((rsx + rph).toFixed(2));
        updated.dienTichBaoCao = updated.tongDienTichBiPha;
      }

      // Auto set Violator Status
      if (name === 'doiTuongViPham') {
        if (!finalValue || finalValue.trim() === '') {
          updated.trangThaiNopPhat = 'Vô chủ';
        } else if (updated.trangThaiNopPhat === 'Vô chủ') {
          updated.trangThaiNopPhat = 'Đã nộp phạt';
        }
      }

      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {editingItem ? 'Chỉnh Sửa Thông Tin Vụ Phá Rừng' : 'Khai Báo Vụ Vi Phạm Phá Rừng Mới'}
              </h3>
              <p className="text-xs text-slate-400">
                Nhập đầy đủ thông tin số liệu theo biểu mẫu chuẩn 2026 Hạt Kiểm lâm Krông Bông
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: BBVPHC, Năm, Tháng, Kế hoạch */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Số/Ngày BBVPHC <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="bbvphc"
                value={formData.bbvphc}
                onChange={handleChange}
                required
                placeholder="VD: 84.12.01"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                Năm Báo Cáo <span className="text-red-400">*</span>
              </label>
              <select
                name="nam"
                value={formData.nam || 2026}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-amber-300 font-extrabold focus:border-amber-400 focus:outline-none"
              >
                <option value={2026}>Năm 2026</option>
                <option value={2025}>Năm 2025</option>
                <option value={2024}>Năm 2024</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tháng Báo Cáo <span className="text-red-400">*</span>
              </label>
              <select
                name="thang"
                value={formData.thang}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {MONTH_OPTIONS.filter(m => m.value !== 0).map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kế Hoạch Xác Minh
              </label>
              <input
                type="text"
                name="keHoachXacMinh"
                value={formData.keHoachXacMinh || ''}
                onChange={handleChange}
                placeholder="VD: KH 12/KH-KL"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Tiểu Khu, Khoảnh, Lô */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tiểu Khu <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="tieuKhu"
                value={formData.tieuKhu}
                onChange={handleChange}
                required
                placeholder="VD: 1153"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Khoảnh <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="khoanh"
                value={formData.khoanh}
                onChange={handleChange}
                required
                placeholder="VD: 2"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lô <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lo"
                value={formData.lo}
                onChange={handleChange}
                required
                placeholder="VD: 47a"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 3: Rừng Sản Xuất, Rừng Phòng Hộ, Tổng Diện Tích */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-teal-400 mb-1">
                Rừng Sản Xuất (ha)
              </label>
              <input
                type="number"
                step="0.01"
                name="rungSanXuat"
                value={formData.rungSanXuat}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sky-400 mb-1">
                Rừng Phòng Hộ (ha)
              </label>
              <input
                type="number"
                step="0.01"
                name="rungPhongHo"
                value={formData.rungPhongHo}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                Tổng Diện Tích Phá (ha)
              </label>
              <input
                type="number"
                step="0.01"
                name="tongDienTichBiPha"
                value={formData.tongDienTichBiPha}
                onChange={handleChange}
                readOnly
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-emerald-300 font-extrabold focus:outline-none font-mono cursor-not-allowed"
              />
            </div>
          </div>

          {/* Row 4: Hiện trạng, QĐ KPHQ/XPHC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hiện Trạng Rừng (Mã trạng thái)
              </label>
              <input
                type="text"
                name="hienTrangRung"
                value={formData.hienTrangRung}
                onChange={handleChange}
                placeholder="VD: txg, txb, txn, loo..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Số/Ngày QĐ KPHQ hoặc QĐ XPHC
              </label>
              <input
                type="text"
                name="qdKPHQ_XPHC"
                value={formData.qdKPHQ_XPHC || ''}
                onChange={handleChange}
                placeholder="VD: 11.20.01"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Địa giới hành chính, Chủ rừng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Địa Giới Hành Chính (Xã) <span className="text-red-400">*</span>
              </label>
              <select
                name="diaGioiHanhChinh"
                value={formData.diaGioiHanhChinh}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {COMMUNE_OPTIONS.filter(c => c !== "Tất cả").map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chủ Rừng / Đơn Vị Quản Lý <span className="text-red-400">*</span>
              </label>
              <select
                name="chuRung"
                value={formData.chuRung}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {FOREST_OWNER_OPTIONS.filter(f => f !== "Tất cả").map((f, i) => (
                  <option key={i} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Separated Violator Field & Báo cáo số */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40">
            <div>
              <label className="block text-xs font-bold text-purple-300 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                Đối Tượng Vi Phạm (Để trống nếu Vô chủ)
              </label>
              <input
                type="text"
                name="doiTuongViPham"
                value={formData.doiTuongViPham || ''}
                onChange={handleChange}
                placeholder="VD: Tráng Dũng Vinh, Y Phát Êban..."
                className="w-full bg-slate-950 border border-purple-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Báo Cáo Số (Cột 14)
              </label>
              <input
                type="text"
                name="bcCty_bbXa_doiTuong"
                value={formData.bcCty_bbXa_doiTuong || ''}
                onChange={handleChange}
                placeholder="VD: BC số 07 ngày 08/01, Rừng xã..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 7: Mức tiền phạt & Trạng thái nộp phạt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-purple-400" />
                Mức Tiền Phạt XPHC (VND)
              </label>
              <input
                type="number"
                name="tienPhat"
                value={formData.tienPhat}
                onChange={handleChange}
                placeholder="VD: 11000000 (Để 0 nếu chưa nộp)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Trạng Thái Nộp Phạt / Tình Trạng
              </label>
              <select
                name="trangThaiNopPhat"
                value={formData.trangThaiNopPhat || 'Vô chủ'}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Đã nộp phạt">🟢 Đã nộp phạt (Có số tiền)</option>
                <option value="Chưa nộp phạt">🔴 Chưa nộp phạt (Chưa cập nhật tiền)</option>
                <option value="Vô chủ">⚪ Vụ việc vô chủ (Không có đối tượng)</option>
              </select>
            </div>
          </div>

          {/* Row 8: Tọa độ VN-2000 & Live Conversion EPSG:4326 (WGS84) */}
          <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="block text-xs font-extrabold text-sky-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                Tọa Độ VN-2000 Đắk Lắk (3° - Kinh tuyến trục 108°30')
              </label>
              {convertedWGS84 && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>EPSG:4326:</span>
                  <strong className="font-mono">{convertedWGS84.formatted}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Tọa Độ X (Đông giả / Easting - VD: 582120)
                </label>
                <input
                  type="number"
                  name="viTriX"
                  value={formData.viTriX || 0}
                  onChange={handleChange}
                  placeholder="VD: 582120"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Tọa Độ Y (Bắc giả / Northing - VD: 1385400)
                </label>
                <input
                  type="number"
                  name="viTriY"
                  value={formData.viTriY || 0}
                  onChange={handleChange}
                  placeholder="VD: 1385400"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 italic">
              * Tự động tính toán & quy đổi về WGS 84 (EPSG:4326) để hiển thị chuẩn xác lên nền bản đồ Google Vệ tinh.
            </p>
          </div>

          {/* Row 9: Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ghi Chú (Phạt xx tr, chưa nộp phạt...)
            </label>
            <input
              type="text"
              name="ghiChu"
              value={formData.ghiChu || ''}
              onChange={handleChange}
              placeholder="VD: Phạt 11 tr, chưa nộp phạt, 5tr, 20tr..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{editingItem ? 'Lưu Thay Đổi' : 'Tạo Mới Vụ Việc'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
