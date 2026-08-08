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
  EyeOff,
  Briefcase
} from 'lucide-react';
import { ROLES } from '../data/usersData';

export default function UserManagementModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  usersList, 
  onUpdateUser,
  onAddUser,
  onSwitchUser 
}) {
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    username: '',
    password: '',
    role: ROLES.STAFF
  });
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === ROLES.ADMIN;

  const handleStartEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      title: user.title,
      username: user.username,
      password: user.password,
      role: user.role
    });
    setSuccessMsg('');
  };

  const handleResetPassword = (userId) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;
    
    const updatedUser = {
      ...user,
      password: '123'
    };
    onUpdateUser(updatedUser);
    setSuccessMsg(`Đã cấp lại mật khẩu mặc định (123) cho ${user.fullName}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    let updatedPermissions = { ...editingUser.permissions };
    let roleName = editingUser.roleName;
    let avatarBg = editingUser.avatarBg;

    if (formData.role === ROLES.LEADER) {
      roleName = 'Lãnh Đạo Hạt';
      avatarBg = formData.title.includes('Phó') ? 'bg-teal-600' : 'bg-emerald-600';
      updatedPermissions = {
        canViewDashboard: true,
        canViewTable: true,
        canViewMap: true,
        canViewReport: true,
        canExportExcel: true,
        canPrintReport: true,
        canAddIncident: false,
        canEditIncident: false,
        canDeleteIncident: false,
        canImportExcel: false,
        canManageUsers: false
      };
    } else if (formData.role === ROLES.STAFF) {
      roleName = 'Cán Bộ Nhập Liệu';
      avatarBg = 'bg-sky-600';
      updatedPermissions = {
        canViewDashboard: true,
        canViewTable: true,
        canViewMap: true,
        canViewReport: true,
        canExportExcel: true,
        canPrintReport: true,
        canAddIncident: true,
        canEditIncident: true,
        canDeleteIncident: true,
        canImportExcel: true,
        canManageUsers: false
      };
    } else if (formData.role === ROLES.ADMIN) {
      roleName = 'Quản Trị Hệ Thống';
      avatarBg = 'bg-purple-600';
      updatedPermissions = {
        canViewDashboard: true,
        canViewTable: true,
        canViewMap: true,
        canViewReport: true,
        canExportExcel: true,
        canPrintReport: true,
        canAddIncident: true,
        canEditIncident: true,
        canDeleteIncident: true,
        canImportExcel: true,
        canManageUsers: true
      };
    }

    const updatedUser = {
      ...editingUser,
      fullName: formData.fullName,
      title: formData.title,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      roleName: roleName,
      avatarBg: avatarBg,
      permissions: updatedPermissions
    };

    onUpdateUser(updatedUser);
    setEditingUser(null);
    setSuccessMsg(`Đã cập nhật thành công thông tin tài khoản ${formData.fullName}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Danh Sách Tài Khoản & Phân Quyền</h3>
              <p className="text-xs text-slate-400">
                {isAdmin 
                  ? 'Quyền Admin: Bạn có toàn quyền đổi tên Lãnh đạo, thay đổi mật khẩu và cấp lại mật khẩu' 
                  : 'Danh sách nhân sự & quyền hạn công tác trên hệ thống'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              setEditingUser(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Modal for Editing User (Admin Only) */}
          {editingUser && isAdmin ? (
            <form onSubmit={handleFormSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4" />
                  Chỉnh Sửa Tài Khoản: {editingUser.fullName}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Hủy chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Họ và Tên Lãnh Đạo / Nhân Viên <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="VD: Hoàng Quốc Thư"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Chức Danh / Vị Trí Công Tác
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Phó Hạt Trưởng Hạt Kiểm Lâm"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Tên Đăng Nhập <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-purple-400 mb-1 flex items-center justify-between">
                    <span>Mật Khẩu Mới</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, password: '123' })}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Đặt lại: 123
                    </button>
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Mật khẩu"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Phân Quyền Vai Trò
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={ROLES.LEADER}>Lãnh Đạo Hạt (Chỉ xem & xuất BC)</option>
                    <option value={ROLES.STAFF}>Cán Bộ Kiểm Lâm (Khai báo & sửa)</option>
                    <option value={ROLES.ADMIN}>Quản Trị Viên (Toàn quyền)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Vào Cơ Sở Dữ Liệu</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {usersList.map((user) => {
                const isCurrent = currentUser?.id === user.id;

                return (
                  <div 
                    key={user.id}
                    className={`p-4 rounded-xl border transition ${
                      isCurrent 
                        ? 'bg-slate-800/90 border-emerald-500/50 ring-1 ring-emerald-500/30' 
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2.5 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${user.avatarBg} flex items-center justify-center text-white font-extrabold text-base shadow-md`}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{user.fullName}</span>
                            {isCurrent && (
                              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                                Tài khoản đang đăng nhập
                              </span>
                            )}
                          </div>
                          
                          {/* PRIVACY PROTECTION: Show password & username ONLY to Admin */}
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{user.title}</span>
                            {isAdmin ? (
                              <>
                                <span className="text-slate-600">•</span>
                                <span>User: <code className="text-sky-400 font-mono font-bold">{user.username}</code></span>
                                <span className="text-slate-600">•</span>
                                <span>Pass: <code className="text-purple-300 font-mono">{user.password}</code></span>
                              </>
                            ) : (
                              <>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-500 italic flex items-center gap-1">
                                  <EyeOff className="w-3 h-3 text-slate-600" />
                                  Mật khẩu bảo mật
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Admin Controls */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
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
                              className="flex items-center gap-1 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition"
                              title="Đổi tên Lãnh đạo / sửa thông tin"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>

                            <button
                              onClick={() => handleResetPassword(user.id)}
                              className="flex items-center gap-1 text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1.5 rounded-lg transition"
                              title="Cấp lại mật khẩu mặc định (123)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset Mật Khẩu</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Permissions matrix tags */}
                    <div className="pt-2.5 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Xem Dashboard & Biểu đồ</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Xuất Excel & In Báo Cáo</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${user.permissions.canAddIncident ? 'text-slate-300' : 'text-slate-500 opacity-60'}`}>
                        {user.permissions.canAddIncident ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
                        <span>Khai báo / Nhập dữ liệu mới</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${user.permissions.canDeleteIncident ? 'text-slate-300' : 'text-slate-500 opacity-60'}`}>
                        {user.permissions.canDeleteIncident ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
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
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{isAdmin ? 'Quản trị viên có toàn quyền lưu đổi tên, mật khẩu và phân quyền.' : 'Quyền riêng tư: Mật khẩu người dùng khác được bảo mật tuyệt đối.'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition"
          >
            Đóng Trình Quản Lý
          </button>
        </div>

      </div>
    </div>
  );
}
