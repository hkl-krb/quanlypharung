import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Shield, 
  Check, 
  Lock, 
  Edit3, 
  RotateCcw, 
  UserPlus, 
  Save, 
  Trash2,
  Key,
  ShieldCheck,
  UserCheck,
  Zap,
  Briefcase
} from 'lucide-react';
import { ROLES } from '../data/usersData';

export default function UserManagementModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  usersList = [], 
  onUpdateUser,
  onAddUser,
  onDeleteUser,
  onSwitchUser 
}) {
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    username: '',
    password: '',
    role: ROLES.STAFF,
    permissions: {
      canAddIncident: true,
      canEditIncident: true,
      canDeleteIncident: true,
      canImportExcel: true,
      canExportExcel: true,
      canPrintReport: true,
      canManageUsers: false
    }
  });

  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === ROLES.ADMIN;

  // Start editing existing member
  const handleStartEdit = (user) => {
    setIsAddingNew(false);
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      title: user.title || '',
      username: user.username || '',
      password: user.password || '',
      role: user.role || ROLES.STAFF,
      permissions: {
        canAddIncident: user.permissions?.canAddIncident ?? true,
        canEditIncident: user.permissions?.canEditIncident ?? true,
        canDeleteIncident: user.permissions?.canDeleteIncident ?? true,
        canImportExcel: user.permissions?.canImportExcel ?? true,
        canExportExcel: user.permissions?.canExportExcel ?? true,
        canPrintReport: user.permissions?.canPrintReport ?? true,
        canManageUsers: user.permissions?.canManageUsers ?? (user.role === ROLES.ADMIN)
      }
    });
    setSuccessMsg('');
  };

  // Start adding new member
  const handleStartAdd = () => {
    setEditingUser(null);
    setIsAddingNew(true);
    setFormData({
      fullName: '',
      title: 'Bộ Phận Xử Lý Vi Phạm',
      username: `kiemlam_${Math.floor(Math.random() * 89 + 10)}`,
      password: '123',
      role: ROLES.STAFF,
      permissions: {
        canAddIncident: true,
        canEditIncident: true,
        canDeleteIncident: true,
        canImportExcel: true,
        canExportExcel: true,
        canPrintReport: true,
        canManageUsers: false
      }
    });
    setSuccessMsg('');
  };

  // Reset password to '123'
  const handleResetPassword = (userId) => {
    const targetUser = usersList.find(u => u.id === userId);
    if (!targetUser) return;
    
    const updatedUser = {
      ...targetUser,
      password: '123'
    };
    onUpdateUser(updatedUser);
    setSuccessMsg(`Đã cấp lại mật khẩu mặc định (123) cho tài khoản ${targetUser.fullName}`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Delete user
  const handleDelete = (userId, userName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${userName}" khỏi hệ thống?`)) {
      onDeleteUser(userId);
      if (editingUser?.id === userId) {
        setEditingUser(null);
      }
      setSuccessMsg(`Đã xóa thành công tài khoản ${userName}`);
      setTimeout(() => setSuccessMsg(''), 3500);
    }
  };

  // Handle Role preset changes
  const handleRoleChange = (newRole) => {
    let roleName = 'Cán Bộ Nhập Liệu';
    let avatarBg = 'bg-sky-600';
    let defaultPerms = {
      canAddIncident: true,
      canEditIncident: true,
      canDeleteIncident: true,
      canImportExcel: true,
      canExportExcel: true,
      canPrintReport: true,
      canManageUsers: false
    };

    if (newRole === ROLES.LEADER) {
      roleName = 'Lãnh Đạo Hạt';
      avatarBg = 'bg-emerald-600';
      defaultPerms = {
        canAddIncident: false,
        canEditIncident: false,
        canDeleteIncident: false,
        canImportExcel: false,
        canExportExcel: true,
        canPrintReport: true,
        canManageUsers: false
      };
    } else if (newRole === ROLES.ADMIN) {
      roleName = 'Quản Trị Hệ Thống';
      avatarBg = 'bg-purple-600';
      defaultPerms = {
        canAddIncident: true,
        canEditIncident: true,
        canDeleteIncident: true,
        canImportExcel: true,
        canExportExcel: true,
        canPrintReport: true,
        canManageUsers: true
      };
    }

    setFormData(prev => ({
      ...prev,
      role: newRole,
      roleName,
      avatarBg,
      permissions: defaultPerms
    }));
  };

  // Toggle individual permission
  const handleTogglePermission = (permKey) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey]
      }
    }));
  };

  // Save changes (Update or Add)
  const handleFormSubmit = (e) => {
    e.preventDefault();

    let roleName = 'Cán Bộ Nhập Liệu';
    let avatarBg = 'bg-sky-600';

    if (formData.role === ROLES.LEADER) {
      roleName = 'Lãnh Đạo Hạt';
      avatarBg = formData.title.includes('Phó') ? 'bg-teal-600' : 'bg-emerald-600';
    } else if (formData.role === ROLES.ADMIN) {
      roleName = 'Quản Trị Hệ Thống';
      avatarBg = 'bg-purple-600';
    }

    const payload = {
      fullName: formData.fullName,
      title: formData.title,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      roleName,
      avatarBg,
      permissions: {
        canViewDashboard: true,
        canViewTable: true,
        canViewMap: true,
        canViewReport: true,
        ...formData.permissions
      }
    };

    if (isAddingNew) {
      onAddUser(payload);
      setIsAddingNew(false);
      setSuccessMsg(`Đã tạo mới thành công tài khoản: ${formData.fullName}`);
    } else if (editingUser) {
      const updatedUser = {
        ...editingUser,
        ...payload
      };
      onUpdateUser(updatedUser);
      setEditingUser(null);
      setSuccessMsg(`Đã lưu thay đổi thông tin cho tài khoản: ${formData.fullName}`);
    }

    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Quick switch to admin
  const handleQuickSwitchToAdmin = () => {
    const adminAccount = usersList.find(u => u.role === ROLES.ADMIN) || {
      id: 3,
      username: 'admin',
      password: '123',
      fullName: 'Lê Hoàng Minh',
      title: 'Quản Trị Viên Hệ Thống',
      role: ROLES.ADMIN,
      roleName: 'Quản Trị Hệ Thống',
      avatarBg: 'bg-purple-600'
    };
    onSwitchUser(adminAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                Quản Lý Tài Khoản Thành Viên & Phân Quyền
              </h3>
              <p className="text-xs text-slate-400">
                {isAdmin 
                  ? 'Quyền Admin: Cho phép chỉnh sửa thông tin, đổi tên, đổi mật khẩu và phân quyền tất cả thành viên' 
                  : 'Danh sách nhân sự công tác tại Hạt Kiểm lâm Krông Bông'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && !isAddingNew && !editingUser && (
              <button
                onClick={handleStartAdd}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl transition shadow"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Thêm Thành Viên Mới</span>
              </button>
            )}

            <button 
              onClick={() => {
                setEditingUser(null);
                setIsAddingNew(false);
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Read-Only Notice Banner for Non-Admins */}
          {!isAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bạn đang xem danh sách nhân sự với vai trò <strong>{currentUser?.roleName || 'Người dùng'}</strong>. Chỉ tài khoản <strong>Quản trị viên hệ thống (Admin)</strong> mới có quyền thêm mới, sửa đổi thông tin hoặc phân quyền thành viên.</span>
              </div>
            </div>
          )}

          {/* Success Toast Banner */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* EDIT FORM or ADD FORM (Admin only) */}
          {(editingUser || isAddingNew) && isAdmin ? (
            <form onSubmit={handleFormSubmit} className="p-4 rounded-2xl bg-slate-950 border border-purple-800/50 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-extrabold text-xs text-purple-300 uppercase tracking-wide flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-purple-400" />
                  {isAddingNew ? 'Thêm Tài Khoản Thành Viên Mới' : `Chỉnh Sửa Thông Tin Thành Viên: ${editingUser.fullName}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setIsAddingNew(false);
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy chỉnh sửa
                </button>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Họ và Tên Cán Bộ / Lãnh Đạo <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="VD: Trần Văn Tùng"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Chức Danh / Vị Trí Công Tác
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Hạt Trưởng Hạt Kiểm Lâm"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Tên Đăng Nhập <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    placeholder="VD: lanhdao_tung"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-sky-300 font-mono font-bold focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1 flex items-center justify-between">
                    <span>Mật Khẩu Mới</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, password: '123' })}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Đặt: 123
                    </button>
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="VD: 123"
                    className="w-full bg-slate-900 border border-purple-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Vai Trò Hệ Thống
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-bold"
                  >
                    <option value={ROLES.LEADER}>👔 Lãnh Đạo Hạt (Chỉ xem & xuất BC)</option>
                    <option value={ROLES.STAFF}>👷 Cán Bộ Kiểm Lâm (Nhập & sửa vụ việc)</option>
                    <option value={ROLES.ADMIN}>⚙️ Quản Trị Hệ Thống (Toàn quyền)</option>
                  </select>
                </div>
              </div>

              {/* Detailed Custom Permission Switches */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wide">
                  Tùy Chọn Phân Quyền Chi Tiết Cho Thành Viên:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData.permissions.canAddIncident}
                      onChange={() => handleTogglePermission('canAddIncident')}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">Khai báo / Thêm vụ việc</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData.permissions.canEditIncident}
                      onChange={() => handleTogglePermission('canEditIncident')}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">Chỉnh sửa vụ việc</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData.permissions.canDeleteIncident}
                      onChange={() => handleTogglePermission('canDeleteIncident')}
                      className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-slate-200 font-medium">Xóa vụ việc</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData.permissions.canImportExcel}
                      onChange={() => handleTogglePermission('canImportExcel')}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">Nhập file Excel</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData.permissions.canExportExcel}
                      onChange={() => handleTogglePermission('canExportExcel')}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">Xuất Excel & In Báo Cáo</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData.permissions.canManageUsers}
                      onChange={() => handleTogglePermission('canManageUsers')}
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-purple-300 font-bold">Quản lý người dùng (Admin)</span>
                  </label>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-5 py-2 rounded-xl shadow-lg shadow-emerald-600/30 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAddingNew ? 'Tạo Tài Khoản Mới' : 'Lưu Thay Đổi Thông Tin'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* USER LIST DISPLAY (Filtered by security level) */
            <div className="space-y-3">
              {usersList
                .filter(user => {
                  // Hide Quản Trị Viên Hệ Thống (Admin) from Leaders and Staff
                  if (!isAdmin) {
                    return user.role !== ROLES.ADMIN && user.username !== 'admin';
                  }
                  return true;
                })
                .map((user) => {
                  const isCurrent = currentUser?.id === user.id;

                return (
                  <div 
                    key={user.id}
                    className={`p-4 rounded-2xl border transition ${
                      isCurrent 
                        ? 'bg-slate-800/90 border-emerald-500/50 ring-1 ring-emerald-500/30' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl ${user.avatarBg || 'bg-slate-700'} flex items-center justify-center text-white font-black text-lg shadow-md`}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-white">{user.fullName}</span>
                            {isCurrent && (
                              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                                Tài khoản hiện tại
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="font-semibold text-slate-300">{user.title}</span>
                            <span className="text-slate-600">•</span>
                            <span>User: <code className="text-sky-400 font-mono font-bold">{user.username}</code></span>
                            <span className="text-slate-600">•</span>
                            <span>Pass: <code className="text-purple-300 font-mono font-bold">{user.password}</code></span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          user.role === 'LEADER'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : user.role === 'STAFF'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}>
                          {user.roleName}
                        </span>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleStartEdit(user)}
                              className="flex items-center gap-1 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl transition"
                              title="Sửa họ tên, chức danh, username, password & phân quyền"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Sửa Thông Tin</span>
                            </button>

                            <button
                              onClick={() => handleResetPassword(user.id)}
                              className="flex items-center gap-1 text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1.5 rounded-xl transition"
                              title="Đặt lại mật khẩu mặc định thành 123"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset 123</span>
                            </button>

                            {user.username !== 'admin' && (
                              <button
                                onClick={() => handleDelete(user.id, user.fullName)}
                                className="flex items-center gap-1 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1.5 rounded-xl transition"
                                title="Xóa tài khoản thành viên"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Permissions Matrix */}
                    <div className="pt-2.5 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Xem Dashboard & Biểu đồ</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Xuất Excel & In Báo Cáo</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${user.permissions?.canAddIncident ? 'text-slate-300' : 'text-slate-500 opacity-60'}`}>
                        {user.permissions?.canAddIncident ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
                        <span>Khai báo / Nhập dữ liệu</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${user.permissions?.canDeleteIncident ? 'text-slate-300' : 'text-slate-500 opacity-60'}`}>
                        {user.permissions?.canDeleteIncident ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
                        <span>Chỉnh sửa & Xóa dữ liệu</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
          <span>{isAdmin ? '⚙️ Quyền Admin: Bạn có thể sửa tên, mật khẩu, phân quyền hoặc thêm/xóa bất kỳ thành viên nào.' : 'Quyền bảo mật: Chỉ Quản trị viên mới được phép thay đổi thông tin thành viên.'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-200 font-extrabold rounded-xl hover:bg-slate-700 transition"
          >
            Đóng Trình Quản Lý
          </button>
        </div>

      </div>
    </div>
  );
}
