// Thư viện Phân tích Điểm nóng & Dự báo Xu hướng Nguy cơ Phá rừng Tương lai
// Dựa trên dữ liệu bảng cell và phân tích tọa độ địa bàn Hạt Kiểm lâm Krông Bông

export function analyzeHotspotsAndPredict(data) {
  if (!data || data.length === 0) {
    return {
      topCommunes: [],
      topTieuKhus: [],
      topKhoanhs: [],
      predictions: [],
      overallRiskLevel: 'Bình thường'
    };
  }

  // 1. Thống kê theo Xã (Địa giới hành chính)
  const communeMap = {};
  data.forEach(item => {
    const commune = item.diaGioiHanhChinh || 'Chưa xác định';
    if (!communeMap[commune]) {
      communeMap[commune] = { name: commune, totalArea: 0, count: 0, months: new Set() };
    }
    communeMap[commune].totalArea += Number(item.tongDienTichBiPha || 0);
    communeMap[commune].count += 1;
    if (item.thang) communeMap[commune].months.add(item.thang);
  });

  const topCommunes = Object.values(communeMap)
    .map(c => ({
      ...c,
      totalArea: Number(c.totalArea.toFixed(2)),
      monthFreq: c.months.size
    }))
    .sort((a, b) => b.totalArea - a.totalArea);

  // 2. Thống kê theo Tiểu khu
  const tieuKhuMap = {};
  data.forEach(item => {
    const tk = item.tieuKhu || 'Khác';
    const commune = item.diaGioiHanhChinh || '';
    if (!tieuKhuMap[tk]) {
      tieuKhuMap[tk] = { 
        tieuKhu: tk, 
        commune: commune, 
        totalArea: 0, 
        count: 0, 
        recentMonth: 0,
        chuRung: item.chuRung || '',
        coords: []
      };
    }
    tieuKhuMap[tk].totalArea += Number(item.tongDienTichBiPha || 0);
    tieuKhuMap[tk].count += 1;
    if (item.thang > tieuKhuMap[tk].recentMonth) {
      tieuKhuMap[tk].recentMonth = item.thang;
    }
    if (item.viTriX && item.viTriY) {
      tieuKhuMap[tk].coords.push({ x: item.viTriX, y: item.viTriY });
    }
  });

  const topTieuKhus = Object.values(tieuKhuMap)
    .map(tk => ({
      ...tk,
      totalArea: Number(tk.totalArea.toFixed(2))
    }))
    .sort((a, b) => b.totalArea - a.totalArea);

  // 3. Thống kê theo Khoảnh
  const khoanhMap = {};
  data.forEach(item => {
    const key = `TK ${item.tieuKhu} - K.${item.khoanh} (${item.diaGioiHanhChinh})`;
    if (!khoanhMap[key]) {
      khoanhMap[key] = {
        name: key,
        tieuKhu: item.tieuKhu,
        khoanh: item.khoanh,
        commune: item.diaGioiHanhChinh,
        totalArea: 0,
        count: 0
      };
    }
    khoanhMap[key].totalArea += Number(item.tongDienTichBiPha || 0);
    khoanhMap[key].count += 1;
  });

  const topKhoanhs = Object.values(khoanhMap)
    .map(k => ({
      ...k,
      totalArea: Number(k.totalArea.toFixed(2))
    }))
    .sort((a, b) => b.totalArea - a.totalArea);

  // 4. Thuật toán Dự báo Tương lai Nguy cơ Phá rừng (Future Deforestation Risk Prediction)
  // Dựa trên: Tần suất vụ việc gần đây + Tốc độ gia tăng diện tích + Mật độ điểm tọa độ
  const maxMonthInDataset = Math.max(...data.map(d => d.thang || 1), 7);

  const predictions = topTieuKhus.map(tk => {
    // Tần suất các tháng gần nhất
    const recentIncidents = data.filter(d => d.tieuKhu === tk.tieuKhu && d.thang >= maxMonthInDataset - 2).length;
    const frequencyWeight = (tk.count / data.length) * 40; // 40% trọng số từ tổng vụ
    const recencyWeight = (recentIncidents / 3) * 35;       // 35% trọng số từ vụ việc gần đây
    const areaWeight = (tk.totalArea / Math.max(topTieuKhus[0]?.totalArea || 1, 1)) * 25; // 25% trọng số diện tích

    const riskScore = Math.min(99, Math.round(frequencyWeight + recencyWeight + areaWeight + 15));

    let riskLevel = 'Bình thường';
    let riskBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    let recommendation = 'Duy trì tuần tra định kỳ theo kế hoạch.';

    if (riskScore >= 75) {
      riskLevel = 'Rất Cao (Nguy cơ bùng phát)';
      riskBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      recommendation = `Cần tăng cường ngay chốt chặn 24/7 tại Tiểu khu ${tk.tieuKhu} (${tk.commune}). Dự báo nguy cơ tiếp tục bị xâm hại trong Tháng ${maxMonthInDataset + 1} & ${maxMonthInDataset + 2}!`;
    } else if (riskScore >= 50) {
      riskLevel = 'Cao (Cần tuần tra dày)';
      riskBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      recommendation = `Lên kế hoạch truy quét kết hợp Kiểm lâm & UBND xã ${tk.commune} tại Tiểu khu ${tk.tieuKhu}.`;
    } else if (riskScore >= 30) {
      riskLevel = 'Trung Bình';
      riskBadgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      recommendation = `Theo dõi sát diễn biến và cập nhật ảnh vệ tinh/bản đồ tọa độ định kỳ.`;
    }

    return {
      tieuKhu: tk.tieuKhu,
      commune: tk.commune,
      chuRung: tk.chuRung,
      totalArea: tk.totalArea,
      count: tk.count,
      riskScore,
      riskLevel,
      riskBadgeColor,
      recommendation
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  return {
    topCommunes,
    topTieuKhus,
    topKhoanhs,
    predictions,
    maxMonth: maxMonthInDataset
  };
}
