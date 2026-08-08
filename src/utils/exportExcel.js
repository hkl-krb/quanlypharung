import * as XLSX from 'xlsx';

export const exportToExcel = (data, customTitle) => {
  const yearLabel = data[0]?.nam ? `NĂM ${data[0].nam}` : 'CÁC NĂM';
  const fileName = customTitle || `BAO_CAO_TONG_HOP_PHA_RUNG_${yearLabel.replace(/\s+/g, '_')}_KRONGBONG.xlsx`;

  // Title row
  const titleRow = [
    ["HẠT KIỂM LÂM KHU VỰC KRÔNG BÔNG"],
    [`BIỂU: TỔNG HỢP PHÁ RỪNG ${yearLabel}`],
    [] // Empty row
  ];

  // Column header structure (2 rows for merged sub-headers)
  const headerRow1 = [
    "TT",
    "BBVPHC (Số, ngày tháng)",
    "Kế hoạch xác minh",
    "Tiểu khu",
    "Khoảnh",
    "Lô",
    "Tổng diện tích rừng bị phá (ha)",
    "Hiện trạng rừng",
    "Loại rừng", "", // Spans 2 cols
    "QĐ KPHQ hoặc QĐ XPHC (Số, ngày tháng)",
    "Địa giới hành chính",
    "Chủ rừng",
    "Báo cáo số",
    "Đối tượng vi phạm",
    "Số tiền phạt đã thu",
    "Báo cáo Pháp chế",
    "Vị trí", "", // Spans 2 cols (X, Y)
    "Ghi chú"
  ];

  const headerRow2 = [
    "", "", "", "", "", "", "", "",
    "Rừng sản xuất (ha)", "Rừng phòng hộ (ha)",
    "", "", "", "", "", "", "",
    "X", "Y",
    ""
  ];

  // Format data rows
  const dataRows = data.map((item, index) => {
    const hasViolator = item.doiTuongViPham && item.doiTuongViPham.trim() !== "";
    const isUnpaid = hasViolator && (item.ghiChu?.toLowerCase().includes("chưa nộp") || item.soTienPhatDaThuStr?.toLowerCase().includes("chưa nộp") || Number(item.tienPhat || 0) === 0);

    let finePaidStr = "";
    if (hasViolator) {
      if (isUnpaid) {
        finePaidStr = "chưa nộp phạt";
      } else {
        finePaidStr = item.soTienPhatDaThuStr || (item.tienPhat ? item.tienPhat.toLocaleString('vi-VN') : "");
      }
    }

    return [
      index + 1,
      item.bbvphc || "",
      item.keHoachXacMinh || "",
      item.tieuKhu || "",
      item.khoanh || "",
      item.lo || "",
      item.tongDienTichBiPha || 0,
      item.hienTrangRung || "",
      item.rungSanXuat || 0,
      item.rungPhongHo || 0,
      item.qdKPHQ_XPHC || "",
      item.diaGioiHanhChinh || "",
      item.chuRung || "",
      item.bcCty_bbXa_doiTuong || "",
      item.doiTuongViPham || "",
      finePaidStr,
      item.bcPC || "",
      item.viTriX || "",
      item.viTriY || "",
      item.ghiChu || ""
    ];
  });

  // Calculate totals
  const totalArea = data.reduce((sum, item) => sum + Number(item.tongDienTichBiPha || 0), 0);
  const totalRSX = data.reduce((sum, item) => sum + Number(item.rungSanXuat || 0), 0);
  const totalRPH = data.reduce((sum, item) => sum + Number(item.rungPhongHo || 0), 0);

  const totalRow = [
    "TỔNG CỘNG", "", "", "", "", "",
    Number(totalArea.toFixed(2)),
    "",
    Number(totalRSX.toFixed(2)),
    Number(totalRPH.toFixed(2)),
    "", "", "", "", "", "", "", "", "", ""
  ];

  // Combine into single sheet data
  const sheetData = [...titleRow, headerRow1, headerRow2, ...dataRows, totalRow];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Set merged cells (title & headers)
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 19 } }, // Company title
    { s: { r: 1, c: 0 }, e: { r: 1, c: 19 } }, // Report title
    { s: { r: 3, c: 8 }, e: { r: 3, c: 9 } },  // Merged "Loại rừng"
    { s: { r: 3, c: 17 }, e: { r: 3, c: 18 } } // Merged "Vị trí"
  ];

  // Column width configuration optimized
  worksheet['!cols'] = [
    { wch: 5 },  // TT
    { wch: 16 }, // BBVPHC
    { wch: 16 }, // KH xác minh
    { wch: 10 }, // Tiểu khu
    { wch: 10 }, // Khoảnh
    { wch: 22 }, // Lô
    { wch: 18 }, // Tổng diện tích
    { wch: 14 }, // Hiện trạng
    { wch: 16 }, // Rừng sản xuất
    { wch: 16 }, // Rừng phòng hộ
    { wch: 20 }, // QĐ KPHQ/XPHC
    { wch: 16 }, // Địa giới
    { wch: 30 }, // Chủ rừng
    { wch: 22 }, // Báo cáo số
    { wch: 22 }, // Đối tượng vi phạm
    { wch: 20 }, // Số tiền phạt đã thu
    { wch: 16 }, // BC PC
    { wch: 12 }, // X
    { wch: 12 }, // Y
    { wch: 18 }  // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `PHÁ RỪNG ${yearLabel}`);

  XLSX.writeFile(workbook, fileName);
};
