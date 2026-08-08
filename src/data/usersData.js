// Danh sách tài khoản người dùng & phân quyền hệ thống

export const ROLES = {
  LEADER: 'LEADER',     // Lãnh đạo Hạt (Xem Dashboard, Biểu đồ, Báo cáo PDF/Excel)
  STAFF: 'STAFF',       // Cán bộ Kiểm lâm / Nhập liệu (Khai báo, Sửa, Xóa, Import Excel)
  ADMIN: 'ADMIN'        // Quản trị viên (Toàn quyền hệ thống + Quản lý người dùng)
};

export const DEMO_USERS = [
  {
    id: 1,
    username: 'lanhdao',
    password: '123',
    fullName: 'Nguyễn Văn Hùng',
    title: 'Hạt Trưởng Hạt Kiểm Lâm',
    role: ROLES.LEADER,
    roleName: 'Lãnh Đạo Hạt',
    avatarBg: 'bg-emerald-600',
    permissions: {
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
    }
  },
  {
    id: 4,
    username: 'hatpho',
    password: '123',
    fullName: 'Hoàng Quốc Thư',
    title: 'Phó Hạt Trưởng Hạt Kiểm Lâm',
    role: ROLES.LEADER,
    roleName: 'Lãnh Đạo Hạt',
    avatarBg: 'bg-teal-600',
    permissions: {
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
    }
  },
  {
    id: 2,
    username: 'kiemlam',
    password: '123',
    fullName: 'Trần Quốc Tuấn',
    title: 'Bộ Phận Xử Lý Vi Phạm',
    role: ROLES.STAFF,
    roleName: 'Cán Bộ Nhập Liệu',
    avatarBg: 'bg-sky-600',
    permissions: {
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
    }
  },
  {
    id: 3,
    username: 'admin',
    password: '123',
    fullName: 'Lê Hoàng Minh',
    title: 'Quản Trị Viên Hệ Thống',
    role: ROLES.ADMIN,
    roleName: 'Quản Trị Hệ Thống',
    avatarBg: 'bg-purple-600',
    permissions: {
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
    }
  }
];
