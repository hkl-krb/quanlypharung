import React, { useState } from 'react';
import { 
  TreePine, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { DEMO_USERS } from '../data/usersData';

export default function LoginModal({ isOpen, onLogin, demoUsers = DEMO_USERS }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    const foundUser = demoUsers.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (foundUser) {
      onLogin(foundUser);
      setUsername('');
      setPassword('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header Branding */}
        <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border-b border-slate-800 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-emerald-600/30 ring-4 ring-emerald-500/20">
            <TreePine className="w-8 h-8 text-white" />
          </div>

          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Hạt Kiểm Lâm Krông Bông
          </span>

          <h2 className="text-xl font-extrabold text-white mt-2 tracking-tight">
            Đăng Nhập Hệ Thống Quản Lý
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Vui lòng nhập Tên đăng nhập và Mật khẩu để xác thực tài khoản
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Secure Form - Manual credentials input required */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tên đăng nhập <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập của bạn"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu xác thực"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition active:scale-98 mt-2"
            >
              <span>Xác Nhận Đăng Nhập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Help toggle if user forgets demo accounts */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1 mx-auto transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHelp ? 'Ẩn thông tin trợ giúp' : 'Trợ giúp danh sách tài khoản quản lý'}</span>
            </button>

            {showHelp && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-[11px] text-slate-300 space-y-1.5 animate-in fade-in">
                <div className="font-bold text-emerald-400 mb-1">Danh sách tài khoản hệ thống:</div>
                <div>• Hạt Trưởng: User <code className="text-sky-300">lanhdao</code> | Mật khẩu: <code className="text-purple-300">123</code></div>
                <div>• Phó Hạt Trưởng: User <code className="text-sky-300">hatpho</code> | Mật khẩu: <code className="text-purple-300">123</code></div>
                <div>• Cán bộ Kiểm lâm: User <code className="text-sky-300">kiemlam</code> | Mật khẩu: <code className="text-purple-300">123</code></div>
                <div>• Quản trị viên: User <code className="text-sky-300">admin</code> | Mật khẩu: <code className="text-purple-300">123</code></div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 text-center border-t border-slate-800 text-[11px] text-slate-500">
          Hệ thống quản lý sử dụng nội bộ - Hạt Kiểm Lâm Krông Bông
        </div>

      </div>
    </div>
  );
}
