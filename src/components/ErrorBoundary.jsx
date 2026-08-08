import React from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">
                Hệ Thống Đang Tự Động Khôi Phục
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Đã phát hiện xung đột dữ liệu trình duyệt cũ. Nhấp bên dưới để làm sạch bộ nhớ đệm và khôi phục Web App mượt mà.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-amber-300 border border-slate-800 break-words">
              {this.state.error?.toString() || 'Hệ thống khôi phục dữ liệu'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 transition active:scale-95 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khôi Phục Giao Diện Web App Ngay</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
