import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KPISummary from './components/KPISummary';
import FilterBar from './components/FilterBar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import IncidentTable from './components/IncidentTable';
import IncidentModal from './components/IncidentModal';
import MapVisualizer from './components/MapVisualizer';
import PrintableReport from './components/PrintableReport';
import PredictiveAnalyticsPanel from './components/PredictiveAnalyticsPanel';
import LoginModal from './components/LoginModal';
import UserManagementModal from './components/UserManagementModal';
import { INITIAL_DEFORESTATION_DATA_2026, INITIAL_DEFORESTATION_DATA_2025 } from './data/initialData';
import { DEMO_USERS } from './data/usersData';
import { exportToExcel } from './utils/exportExcel';
import { getWGS84Location } from './utils/coordinateConverter';
import { CheckCircle, AlertCircle, X, Shield, Eye, UserCheck, Banknote, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';

import { 
  subscribeToIncidents, 
  saveIncidentToFirebase, 
  deleteIncidentFromFirebase, 
  seedInitialIncidents, 
  subscribeToUsers, 
  saveUserToFirebase, 
  deleteUserFromFirebase 
} from './services/firebaseService';

const ALL_INITIAL_DATA = [...INITIAL_DEFORESTATION_DATA_2026, ...INITIAL_DEFORESTATION_DATA_2025];

export default function App() {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  // Theme State (Default to 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('krongbong_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('krongbong_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Persistent Incident Data in localStorage & Firebase Realtime Cloud Sync
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('krongbong_incidents_v10_full');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 150 && parsed.every(d => d && typeof d === 'object')) {
          return parsed.filter(Boolean);
        }
      }
      localStorage.setItem('krongbong_incidents_v10_full', JSON.stringify(ALL_INITIAL_DATA));
      return ALL_INITIAL_DATA;
    } catch (e) {
      return ALL_INITIAL_DATA;
    }
  });

  useEffect(() => {
    try {
      if (Array.isArray(data)) {
        localStorage.setItem('krongbong_incidents_v10_full', JSON.stringify(data));
      }
    } catch (e) {
      console.error('Error saving incidents data to localStorage', e);
    }
  }, [data]);

  // Persistent Dynamic Users List State in localStorage & Firebase Sync
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('krongbong_users_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(u => u && typeof u === 'object')) {
          return parsed.filter(Boolean);
        }
      }
      return DEMO_USERS;
    } catch (e) {
      return DEMO_USERS;
    }
  });

  useEffect(() => {
    try {
      if (Array.isArray(usersList)) {
        localStorage.setItem('krongbong_users_v3', JSON.stringify(usersList));
      }
    } catch (e) {
      console.error('Error saving users list to localStorage', e);
    }
  }, [usersList]);

  // Realtime Firebase Firestore Subscriptions (Syncs all mobile & desktop browsers)
  useEffect(() => {
    const unsubIncidents = subscribeToIncidents(
      (realtimeIncidents) => {
        if (Array.isArray(realtimeIncidents) && realtimeIncidents.length > 0) {
          setData(realtimeIncidents);
          setIsFirebaseConnected(true);
        }
      },
      (err) => {
        console.warn('Firebase error on subscribeToIncidents:', err);
      }
    );

    const unsubUsers = subscribeToUsers(
      (realtimeUsers) => {
        if (Array.isArray(realtimeUsers) && realtimeUsers.length > 0) {
          setUsersList(realtimeUsers);
        }
      },
      (err) => {
        console.warn('Firebase error on subscribeToUsers:', err);
      }
    );

    return () => {
      unsubIncidents();
      unsubUsers();
    };
  }, []);

  // Sync All Current Data to Firebase Cloud Firestore
  const handleSyncAllToFirebase = async () => {
    try {
      showToast('⏳ Đang đẩy dữ liệu lên Firebase Cloud...', 'warning');
      await seedInitialIncidents(data);
      setIsFirebaseConnected(true);
      showToast(`🔥 Đã đồng bộ thành công ${data.length} vụ việc lên Google Firebase Cloud!`);
    } catch (err) {
      console.error('Lỗi nạp Firebase:', err);
      if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
        alert('⚠️ Firebase chưa mở Quyền Đọc/Ghi (Permission Denied)!\n\nĐể đồng bộ dữ liệu giữa các máy, hãy vào Firebase Console (quanlypharung) > Firestore Database > Rules và cập nhật:\n\nrules_version = \'2\';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}');
      } else {
        showToast(`❌ Lỗi đồng bộ Firebase: ${err.message}`, 'error');
      }
    }
  };

  // Force reset data function (Revert strictly to initial dataset & sync Firebase)
  const handleResetToInitialData = async () => {
    if (window.confirm('Bạn có muốn khôi phục và đồng bộ toàn bộ 194 vụ việc gốc (Năm 2026: 41 vụ, Năm 2025: 153 vụ) lên Cloud Firebase?')) {
      setData(ALL_INITIAL_DATA);
      localStorage.setItem('krongbong_incidents_v10_full', JSON.stringify(ALL_INITIAL_DATA));
      try {
        await seedInitialIncidents(ALL_INITIAL_DATA);
        setIsFirebaseConnected(true);
        showToast('🔥 Đã khôi phục và đồng bộ 194 vụ việc gốc lên Google Firebase Cloud!');
      } catch (err) {
        showToast('Đã khôi phục dữ liệu gốc trên máy cục bộ!', 'warning');
      }
    }
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState(() => {
    return (Array.isArray(usersList) && usersList.length > 0 && usersList[0]) ? usersList[0] : DEMO_USERS[0];
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  // Filter States
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedQuarter, setSelectedQuarter] = useState(0);
  const [selectedCommune, setSelectedCommune] = useState('Tất cả');
  const [selectedForestOwner, setSelectedForestOwner] = useState('Tất cả');
  const [selectedForestType, setSelectedForestType] = useState('Tất cả');
  const [selectedViolatorFilter, setSelectedViolatorFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    showToast(`Đăng nhập thành công với vai trò: ${user.roleName}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
    showToast('Đã đăng xuất khỏi hệ thống', 'warning');
  };

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    showToast(`Đã chuyển sang tài khoản: ${user.fullName} (${user.roleName})`);
  };

  // Admin User Management Handlers (Synced to Firebase)
  const handleUpdateUser = (updatedUser) => {
    setUsersList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    saveUserToFirebase(updatedUser);
    showToast(`🔥 Đã lưu thay đổi tài khoản ${updatedUser.fullName} lên Google Cloud!`);
  };

  const handleAddUser = (newUser) => {
    const userWithId = { ...newUser, id: Date.now() };
    setUsersList(prev => [...prev, userWithId]);
    saveUserToFirebase(userWithId);
    showToast(`🔥 Đã tạo thành công tài khoản mới: ${newUser.fullName} trên Google Cloud!`);
  };

  const handleDeleteUser = (userId) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;
    if (user.username === 'admin' && usersList.filter(u => u.role === 'ADMIN').length <= 1) {
      showToast('Không thể xóa tài khoản Quản trị viên hệ thống cuối cùng!', 'error');
      return;
    }
    setUsersList(prev => prev.filter(u => u.id !== userId));
    deleteUserFromFirebase(userId);
    showToast(`🔥 Đã xóa tài khoản ${user.fullName} khỏi Google Cloud!`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedYear(2026);
    setSelectedMonth(0);
    setSelectedQuarter(0);
    setSelectedCommune('Tất cả');
    setSelectedForestOwner('Tất cả');
    setSelectedForestType('Tất cả');
    setSelectedViolatorFilter('ALL');
    setSearchTerm('');
  };

  // Filtered Data Computation
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Year Filter
      if (selectedYear !== 0 && item.nam !== selectedYear) {
        return false;
      }

      // Month Filter
      if (selectedMonth !== 0 && item.thang !== selectedMonth) {
        return false;
      }

      // Quarter Filter
      if (selectedQuarter !== 0 && item.quy !== selectedQuarter) {
        return false;
      }

      // Commune Filter
      if (selectedCommune !== 'Tất cả' && item.diaGioiHanhChinh !== selectedCommune) {
        return false;
      }

      // Forest Owner Filter
      if (selectedForestOwner !== 'Tất cả' && item.chuRung !== selectedForestOwner) {
        return false;
      }

      // Violator Filter
      const hasViolator = item.doiTuongViPham && item.doiTuongViPham.trim() !== "";
      const isUnpaid = hasViolator && (item.ghiChu?.toLowerCase().includes("chưa nộp") || item.soTienPhatDaThuStr?.toLowerCase().includes("chưa nộp") || Number(item.tienPhat || 0) === 0);
      
      if (selectedViolatorFilter === 'HAS_VIOLATOR' && !hasViolator) {
        return false;
      }
      if (selectedViolatorFilter === 'OWNERLESS' && hasViolator) {
        return false;
      }
      if (selectedViolatorFilter === 'PAID' && (isUnpaid || !hasViolator)) {
        return false;
      }
      if (selectedViolatorFilter === 'UNPAID' && !isUnpaid) {
        return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchBB = (item.bbvphc || '').toLowerCase().includes(term);
        const matchTK = (item.tieuKhu || '').toLowerCase().includes(term);
        const matchLo = (item.lo || '').toLowerCase().includes(term);
        const matchCR = (item.chuRung || '').toLowerCase().includes(term);
        const matchDT = (item.bcCty_bbXa_doiTuong || '').toLowerCase().includes(term);
        const matchVio = (item.doiTuongViPham || '').toLowerCase().includes(term);
        const matchXa = (item.diaGioiHanhChinh || '').toLowerCase().includes(term);
        if (!matchBB && !matchTK && !matchLo && !matchCR && !matchDT && !matchVio && !matchXa) {
          return false;
        }
      }

      return true;
    });
  }, [data, selectedYear, selectedMonth, selectedQuarter, selectedCommune, selectedForestOwner, selectedForestType, selectedViolatorFilter, searchTerm]);

  // Total Area Calculation
  const totalArea = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + Number(curr.tongDienTichBiPha || 0), 0);
  }, [filteredData]);

  // Incident Item Handlers (Synced Realtime to Firebase Cloud Firestore)
  const handleSaveItem = async (itemData) => {
    const itemYear = Number(itemData.nam) || (selectedYear !== 0 ? selectedYear : 2026);
    let finalItem;
    if (editingItem) {
      finalItem = { ...itemData, nam: itemYear, id: editingItem.id, docId: editingItem.docId || String(editingItem.id) };
      setData(prev => prev.map(item => item.id === editingItem.id ? finalItem : item));
    } else {
      finalItem = {
        ...itemData,
        id: Date.now(),
        stt: data.length + 1,
        nam: itemYear
      };
      setData(prev => [finalItem, ...prev]);
    }

    try {
      await saveIncidentToFirebase(finalItem);
      showToast(`🔥 Đã lưu thành công vụ việc Năm ${itemYear} lên Google Firebase Cloud!`);
    } catch (err) {
      console.error('Lỗi khi lưu lên Firebase:', err);
      if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
        alert('⚠️ Firebase chưa mở Quyền Đọc/Ghi (Permission Denied)!\n\nVui lòng vào Firebase Console > Firestore Database > Rules và cập nhật:\n\nallow read, write: if true;');
      } else {
        showToast(`⚠️ Đã lưu trên máy. Chưa thể ghi lên Cloud: ${err.message}`, 'warning');
      }
    }
  };

  const handleDeleteItem = async (id) => {
    const targetItem = data.find(item => item.id === id);
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi vụ vi phạm này khỏi hệ thống & Cloud Firebase?')) {
      setData(prev => prev.filter(item => item.id !== id));
      try {
        await deleteIncidentFromFirebase(id, targetItem?.docId);
        showToast('🔥 Đã xóa vụ việc khỏi Google Cloud Firebase', 'warning');
      } catch (err) {
        showToast('Đã xóa khỏi máy cục bộ (chưa xóa trên Cloud)', 'warning');
      }
    }
  };

  const handleOpenAddModal = () => {
    if (!currentUser?.permissions?.canAddIncident) {
      showToast('Tài khoản Lãnh đạo chỉ có quyền xem & xuất báo cáo!', 'error');
      return;
    }
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    if (!currentUser?.permissions?.canEditIncident) {
      showToast('Tài khoản của bạn không có quyền sửa dữ liệu thô!', 'error');
      return;
    }
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Import Excel File
  const handleImportExcel = (e) => {
    if (!currentUser?.permissions?.canImportExcel) {
      showToast('Bạn cần tài khoản Cán bộ nhập liệu để tải file Excel vào hệ thống!', 'error');
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const importedJson = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const parsedItems = [];
        for (let i = 4; i < importedJson.length; i++) {
          const row = importedJson[i];
          if (!row || !row[1]) continue;

          const violatorName = String(row[15] || row[14] || '');
          const fineStr = String(row[16] || row[18] || '');
          const isUnpaidStr = fineStr.toLowerCase().includes('chưa nộp');
          const fineNum = parseFloat(fineStr.replace(/[^0-9]/g, '')) || 0;

          parsedItems.push({
            id: Date.now() + i,
            stt: parsedItems.length + 1,
            nam: 2026,
            bbvphc: String(row[1] || ''),
            keHoachXacMinh: String(row[2] || ''),
            tieuKhu: String(row[3] || ''),
            khoanh: String(row[4] || ''),
            lo: String(row[5] || ''),
            tongDienTichBiPha: parseFloat(row[6]) || 0,
            hienTrangRung: String(row[7] || 'txg'),
            rungSanXuat: parseFloat(row[8]) || 0,
            rungPhongHo: parseFloat(row[9]) || 0,
            qdKPHQ_XPHC: String(row[10] || ''),
            diaGioiHanhChinh: String(row[11] || 'Cư Pui'),
            chuRung: String(row[12] || 'Công ty Lâm nghiệp Krông Bông'),
            bcCty_bbXa_doiTuong: String(row[13] || ''),
            doiTuongViPham: violatorName,
            soTienPhatDaThuStr: fineStr,
            tienPhat: fineNum,
            bcPC: String(row[16] || 'BC PC tháng 01'),
            thang: 1,
            quy: 1,
            viTriX: parseFloat(row[17]) || 0,
            viTriY: parseFloat(row[18]) || 0,
            ghiChu: String(row[19] || ''),
            trangThaiNopPhat: violatorName ? (isUnpaidStr ? 'Chưa nộp phạt' : 'Đã nộp phạt') : 'Vô chủ'
          });
        }

        if (parsedItems.length > 0) {
          setData(parsedItems);
          try {
            await seedInitialIncidents(parsedItems);
            showToast(`🔥 Đã nhập ${parsedItems.length} vụ việc từ Excel & đồng bộ lên Google Cloud Firebase!`);
          } catch (err) {
            showToast(`Đã nhập ${parsedItems.length} vụ việc từ Excel vào máy cục bộ!`, 'warning');
          }
        } else {
          showToast('Không tìm thấy bản ghi dữ liệu hợp lệ trong tập tin', 'warning');
        }
      } catch (err) {
        console.error(err);
        showToast('Lỗi khi đọc file Excel, vui lòng kiểm tra lại định dạng', 'error');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-white ${
      isLight ? 'theme-light' : 'theme-dark'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border ${
          toastMessage.type === 'error' 
            ? 'bg-rose-900/90 text-rose-200 border-rose-700' 
            : toastMessage.type === 'warning'
            ? 'bg-amber-900/90 text-amber-200 border-amber-700'
            : 'bg-emerald-900/90 text-emerald-200 border-emerald-700'
        }`}>
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage.msg}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        onOpenAddModal={handleOpenAddModal}
        onExportExcel={() => exportToExcel(filteredData)}
        onImportExcel={handleImportExcel}
        onPrintReport={() => setActiveTab('report')}
        totalRecords={filteredData.length}
        totalArea={totalArea}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        isFirebaseConnected={isFirebaseConnected}
      />

      {/* Main Application Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1700px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenUserManagement={() => setIsUserManagementOpen(true)}
          theme={theme} 
        />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          
          {/* Top KPI Cards */}
          {activeTab !== 'report' && (
            <KPISummary data={filteredData} theme={theme} />
          )}

          {/* Data Reset Banner helper */}
          {activeTab !== 'report' && (
            <div className="mb-4 flex items-center justify-between bg-emerald-900/10 border border-emerald-500/30 p-2.5 px-4 rounded-xl text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>
                  Đang xem dữ liệu: <strong className="text-emerald-700 dark:text-emerald-400 uppercase">{selectedYear === 0 ? 'Tất cả các năm (194 vụ)' : `Năm ${selectedYear} (${filteredData.length} vụ)`}</strong>. Đã phân tách dữ liệu 2025 & 2026 độc lập theo chỉ đạo.
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleSyncAllToFirebase}
                  className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-3 py-1 rounded-lg text-[11px] transition shadow-sm"
                  title="Đẩy và đồng bộ tất cả bản ghi hiện tại lên Google Firebase Cloud"
                >
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>🔥 Nạp & Đồng Bộ Cloud Firebase</span>
                </button>

                <button
                  onClick={handleResetToInitialData}
                  className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-lg text-[11px] transition shadow-sm"
                  title="Khôi phục lại dữ liệu 194 vụ việc gốc (2025 & 2026)"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Khôi Phục Dữ Liệu Gốc</span>
                </button>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          {activeTab !== 'report' && (
            <FilterBar
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedQuarter={selectedQuarter}
              setSelectedQuarter={setSelectedQuarter}
              selectedCommune={selectedCommune}
              setSelectedCommune={setSelectedCommune}
              selectedForestOwner={selectedForestOwner}
              setSelectedForestOwner={setSelectedForestOwner}
              selectedViolatorFilter={selectedViolatorFilter}
              setSelectedViolatorFilter={setSelectedViolatorFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onResetFilters={handleResetFilters}
              filteredCount={filteredData.length}
              totalCount={data.length}
              theme={theme}
            />
          )}

          {/* Tab 1: Executive Analytics Dashboard */}
          {activeTab === 'dashboard' && (
            <AnalyticsDashboard data={filteredData} theme={theme} />
          )}

          {/* Tab 2: Predictive Hotspot Analytics & Risk Forecast */}
          {activeTab === 'prediction' && (
            <PredictiveAnalyticsPanel data={filteredData} theme={theme} />
          )}

          {/* Tab 3: Detailed Incident Table */}
          {activeTab === 'table' && (
            <IncidentTable
              data={filteredData}
              userPermissions={currentUser?.permissions}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onViewItemDetail={(item) => setViewingItem(item)}
              theme={theme}
            />
          )}

          {/* Tab 4: GIS Coordinates Map Visualizer */}
          {activeTab === 'map' && (
            <MapVisualizer data={filteredData} theme={theme} />
          )}

          {/* Tab 5: Standard Printable Report */}
          {activeTab === 'report' && (
            <PrintableReport
              data={filteredData}
              onExportExcel={() => exportToExcel(filteredData)}
              onBack={() => setActiveTab('dashboard')}
            />
          )}

        </main>

      </div>

      {/* Official Compact Footer with Firebase Cloud Badge */}
      <footer className={`border-t py-3 px-4 mt-auto transition-colors duration-200 ${
        isLight 
          ? 'bg-slate-50/90 border-slate-200/80 text-slate-600' 
          : 'bg-slate-950/90 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          
          {/* Left: Copyright 2026 */}
          <div className="flex items-center gap-2 font-extrabold text-emerald-800 dark:text-emerald-400 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm inline-block animate-pulse shrink-0"></span>
            <span>Copyright © 2026 Bản quyền thuộc về Hạt Kiểm lâm khu vực Krông Bông</span>
          </div>

          {/* Right: Usage Notice & Firebase Sync Status Badge */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">
              Hệ thống lưu trữ & quản lý sử dụng nội bộ.
            </span>

            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 transition ${
              isFirebaseConnected 
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400' 
                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`} title={isFirebaseConnected ? "Đã kết nối Firebase Cloud Realtime Sync" : "Đang kết nối Cloud..."}>
              <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{isFirebaseConnected ? '🔥 Firebase Cloud Sync' : 'Offline'}</span>
            </span>
          </div>

        </div>
      </footer>

      {/* Login Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen || !currentUser}
        demoUsers={usersList}
        onLogin={handleLogin}
      />

      {/* User Management & Permissions Modal */}
      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        currentUser={currentUser}
        usersList={usersList}
        onUpdateUser={handleUpdateUser}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        onSwitchUser={handleSwitchUser}
      />

      {/* Add / Edit Incident Form Modal */}
      <IncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
        selectedYear={selectedYear}
      />

      {/* Detail View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`border rounded-2xl w-full max-w-lg shadow-2xl p-6 relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <button 
              onClick={() => setViewingItem(null)}
              className={`absolute top-4 right-4 p-1 rounded-lg transition ${
                isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase mb-1">
              <Shield className="w-4 h-4" />
              <span>Hồ Sơ Chi Tiết Vụ Phá Rừng 2026</span>
            </div>

            <h3 className={`text-xl font-extrabold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Biên Bản Số: {viewingItem.bbvphc}
            </h3>

            <div className={`space-y-2 text-xs divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Tiểu khu - Khoảnh - Lô:</span>
                <span className="font-bold font-mono">TK {viewingItem.tieuKhu} - K.{viewingItem.khoanh} - Lô {viewingItem.lo}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Tổng diện tích rừng bị phá:</span>
                <span className="font-extrabold text-emerald-600 text-sm">{viewingItem.tongDienTichBiPha} ha</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Đối tượng vi phạm (Cột 15):</span>
                <span className="font-extrabold text-purple-700">
                  {viewingItem.doiTuongViPham ? (
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-purple-600 inline" />
                      {viewingItem.doiTuongViPham}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">⚪ Phá rừng vô chủ</span>
                  )}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Số tiền phạt đã thu (Cột 16):</span>
                <span className="font-extrabold">
                  {viewingItem.doiTuongViPham ? (
                    viewingItem.soTienPhatDaThuStr?.toLowerCase().includes("chưa nộp") || Number(viewingItem.tienPhat || 0) === 0 ? (
                      <span className="text-rose-600">🔴 chưa nộp phạt</span>
                    ) : (
                      <span className="text-emerald-600">🟢 {viewingItem.soTienPhatDaThuStr || `${viewingItem.tienPhat.toLocaleString('vi-VN')} đ`}</span>
                    )
                  ) : (
                    <span className="text-slate-400 font-normal">-</span>
                  )}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Hiện trạng rừng:</span>
                <span className="font-mono text-amber-600 font-bold">{viewingItem.hienTrangRung}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Địa giới hành chính:</span>
                <span className="font-bold">{viewingItem.diaGioiHanhChinh}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Chủ rừng:</span>
                <span className="font-bold">{viewingItem.chuRung}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Báo cáo số (Cột 14):</span>
                <span className="font-medium">{viewingItem.bcCty_bbXa_doiTuong || '-'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>QĐ xử phạt / KPHQ:</span>
                <span className="font-bold text-emerald-600">{viewingItem.qdKPHQ_XPHC || 'Chưa ra QĐ'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Tọa độ VN-2000 Đắk Lắk (X, Y):</span>
                <span className="font-mono text-sky-600 font-bold">{viewingItem.viTriX}, {viewingItem.viTriY}</span>
              </div>
              {(() => {
                const wgs = getWGS84Location(viewingItem);
                if (!wgs) return null;
                return (
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Chuyển đổi EPSG:4326 (WGS84):</span>
                      <span className="font-mono">{wgs.formatted}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${wgs.lat},${wgs.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition shadow-md shadow-sky-600/30"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem Vị Trí Phá Rừng Trên Google Maps Vệ Tinh 🛰️</span>
                    </a>
                  </div>
                );
              })()}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
