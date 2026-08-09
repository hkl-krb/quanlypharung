import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  MapPin, 
  Trees, 
  Building2,
  UserCheck,
  Banknote,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export default function AnalyticsDashboard({ data, theme = 'light' }) {
  const isLight = theme === 'light';

  // 1. Monthly Trends
  const monthlyData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
    const monthItems = data.filter(d => d.thang === m);
    const totalArea = monthItems.reduce((sum, item) => sum + Number(item.tongDienTichBiPha || 0), 0);
    const count = monthItems.length;
    return {
      name: `Tháng ${m.toString().padStart(2, '0')}`,
      'Diện tích (ha)': Number(totalArea.toFixed(2)),
      'Số vụ việc': count
    };
  });

  // 2. Deforestation by Commune
  const communeMap = {};
  data.forEach(item => {
    const commune = item.diaGioiHanhChinh || 'Khác';
    if (!communeMap[commune]) {
      communeMap[commune] = { name: commune, 'Diện tích (ha)': 0, 'Số vụ': 0 };
    }
    communeMap[commune]['Diện tích (ha)'] += Number(item.tongDienTichBiPha || 0);
    communeMap[commune]['Số vụ'] += 1;
  });
  const communeData = Object.values(communeMap).map(c => ({
    ...c,
    'Diện tích (ha)': Number(c['Diện tích (ha)'].toFixed(2))
  }));

  // 3. Deforestation by Forest Type
  const totalRungSanXuat = data.reduce((sum, d) => sum + Number(d.rungSanXuat || 0), 0);
  const totalRungPhongHo = data.reduce((sum, d) => sum + Number(d.rungPhongHo || 0), 0);
  const forestTypeData = [
    { name: 'Rừng Sản Xuất', value: Number(totalRungSanXuat.toFixed(2)), color: '#10b981' },
    { name: 'Rừng Phòng Hộ', value: Number(totalRungPhongHo.toFixed(2)), color: '#0ea5e9' }
  ];

  // 4. Deforestation by Violator & Fine Collection (100% Dynamic)
  const violatorItems = data.filter(d => d.doiTuongViPham && d.doiTuongViPham.trim() !== "");
  const ownerlessCount = data.length - violatorItems.length;

  const violatorChartData = violatorItems.map(v => ({
    name: v.doiTuongViPham,
    'Số tiền (triệu đ)': (Number(v.tienPhat) || 0) / 1000000,
    status: v.trangThaiNopPhat || (v.tienPhat > 0 ? 'Đã nộp phạt' : 'Chưa nộp phạt'),
    area: v.tongDienTichBiPha,
    tk: v.tieuKhu,
    nam: v.nam
  }));

  const totalFinesPaid = violatorItems.reduce((sum, item) => sum + Number(item.tienPhat || 0), 0);

  // 5. Deforestation by Forest Owner
  const ownerMap = {};
  data.forEach(item => {
    const owner = item.chuRung || 'Khác';
    if (!ownerMap[owner]) {
      ownerMap[owner] = 0;
    }
    ownerMap[owner] += Number(item.tongDienTichBiPha || 0);
  });
  const ownerData = Object.keys(ownerMap).map(key => ({
    name: key,
    'Diện tích (ha)': Number(ownerMap[key].toFixed(2))
  }));

  const tooltipStyle = isLight 
    ? { backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }
    : { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#ffffff', fontSize: '12px' };

  const gridColor = isLight ? '#f1f5f9' : '#1e293b';
  const axisColor = isLight ? '#64748b' : '#64748b';

  return (
    <div className="space-y-6">
      
      {/* Multi-Year Comparison Card */}
      <div className="glass-panel rounded-2xl p-5 border shadow-lg bg-gradient-to-r from-emerald-950/20 via-teal-900/10 to-slate-900/20">
        <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Bảng So Sánh Diễn Biến Phá Rừng Cùng Kỳ (2025 vs 2026)
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                So sánh số vụ, diện tích rừng bị thiệt hại và công tác xử lý đối tượng vi phạm
              </p>
            </div>
          </div>
          <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
            Dữ liệu đối soát độc lập
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
            <div className="text-xs font-bold text-slate-500 uppercase">Tổng số vụ việc</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600">41 vụ</span>
              <span className="text-xs text-slate-500 font-semibold">(2026)</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
              <span>Năm 2025: <strong>153 vụ</strong> (Giảm 73.2%)</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
            <div className="text-xs font-bold text-slate-500 uppercase">Tổng diện tích bị phá</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-sky-600">7.82 ha</span>
              <span className="text-xs text-slate-500 font-semibold">(2026)</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
              <span>Năm 2025: <strong>36.48 ha</strong> (Giảm 78.6%)</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
            <div className="text-xs font-bold text-slate-500 uppercase">Xác định đối tượng</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-purple-600">4 đối tượng</span>
              <span className="text-xs text-slate-500 font-semibold">(2026)</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
              <span>Năm 2025: <strong>2 đối tượng</strong> (Tăng 100%)</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
            <div className="text-xs font-bold text-slate-500 uppercase">Số tiền phạt thu nộp</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-600">36.000.000 đ</span>
              <span className="text-xs text-slate-500 font-semibold">(2026)</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
              <span>Năm 2025: <strong>10.000.000 đ</strong> (+260%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary Panel: Violator & Fine Collection Status */}
      <div className="glass-panel rounded-2xl p-5 border shadow-lg">
        <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${isLight ? 'bg-purple-100 text-purple-800' : 'bg-purple-500/20 text-purple-400'}`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Chi Tiết Đối Tượng Vi Pham & Tiền Phạt ({data[0]?.nam ? `Năm ${data[0].nam}` : 'Hiện tại'})
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Đối soát {violatorItems.length} vụ việc có đối tượng vs {ownerlessCount} vụ phá rừng vô chủ
              </p>
            </div>
          </div>

          <span className="bg-purple-100 text-purple-900 border border-purple-300 text-xs font-extrabold px-3 py-1 rounded-full">
            Tổng thu phạt: {totalFinesPaid.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart of Fine Amounts */}
          <div className="lg:col-span-2">
            <h4 className={`text-xs font-extrabold uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Biểu đồ số tiền nộp phạt theo từng đối tượng (Triệu đồng)
            </h4>
            <div className="h-56 w-full">
              {violatorChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={violatorChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
                    <YAxis stroke={axisColor} fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="Số tiền (triệu đ)" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
                  Không có vụ việc nào có đối tượng trong bộ lọc này
                </div>
              )}
            </div>
          </div>

          {/* Cards List of Violators */}
          <div className="space-y-2.5">
            <h4 className={`text-xs font-extrabold uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Danh sách chi tiết đối tượng & tình trạng nộp phạt
            </h4>
            
            {violatorChartData.length > 0 ? (
              violatorChartData.map((v, i) => (
                <div key={i} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  v.status === 'Đã nộp phạt'
                    ? (isLight ? 'bg-emerald-50/80 border-emerald-300 text-slate-900' : 'bg-emerald-950/30 border-emerald-800 text-slate-200')
                    : (isLight ? 'bg-rose-50/80 border-rose-300 text-slate-900' : 'bg-rose-950/30 border-rose-800 text-slate-200')
                }`}>
                  <div>
                    <div className="font-extrabold flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{v.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">(TK {v.tk} - {v.area}ha)</span>
                    </div>
                    <div className="text-[11px] mt-0.5 font-medium text-slate-600">
                      Trạng thái: <strong className={v.status === 'Đã nộp phạt' ? 'text-emerald-700' : 'text-rose-700'}>{v.status}</strong>
                    </div>
                  </div>
                  <div className="font-mono font-extrabold text-sm text-purple-700">
                    {v['Số tiền (triệu đ)'] > 0 ? `${v['Số tiền (triệu đ)']} tr` : '0 đ'}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-xs text-center text-slate-500 font-bold">Tất cả vụ việc đều chưa xác định đối tượng (vô chủ)</div>
            )}

            <div className={`p-2.5 rounded-xl border text-center text-xs font-extrabold ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              ⚪ {ownerlessCount} vụ việc còn lại: <strong>Phá rừng vô chủ</strong> (Chưa có đối tượng)
            </div>
          </div>

        </div>
      </div>

      {/* Top Row: Monthly Trend & Commune Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5">
          <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Diễn Biến Phá Rừng Theo Tháng
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Diện tích bị phá (ha) và số lượng vụ việc phát hiện
                </p>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Diện tích (ha)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorArea)" />
                <Area type="monotone" dataKey="Số vụ việc" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deforestation by Commune */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col">
          <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className={`p-2 rounded-xl ${isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/10 text-sky-400'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Địa Giới Hành Chính
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Diện tích phá rừng theo xã (ha)
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="Diện tích (ha)" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row: Forest Types & Forest Owners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Forest Types Pie Chart */}
        <div className="glass-panel rounded-2xl p-5">
          <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className={`p-2 rounded-xl ${isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/10 text-amber-400'}`}>
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Loại Rừng Bị Phá
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Tỉ lệ diện tích rừng bị thiệt hại theo chức năng
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={forestTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {forestTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={isLight ? '#fff' : '#0f172a'} strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value} ha`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forest Owners Bar Chart */}
        <div className="glass-panel rounded-2xl p-5">
          <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className={`p-2 rounded-xl ${isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/10 text-indigo-400'}`}>
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Chủ Rừng Bị Thiệt Hại
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Diện tích bị phá theo từng chủ rừng quản lý
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ownerData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" stroke={axisColor} fontSize={11} />
                <YAxis dataKey="name" type="category" stroke={axisColor} fontSize={11} width={100} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value} ha`} />
                <Bar dataKey="Diện tích (ha)" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
