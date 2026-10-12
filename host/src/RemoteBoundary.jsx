import { Component, Suspense } from "react";

// Menangkap error saat remote gagal dimuat (server mati, network error, dll)
// sehingga host tetap berjalan dan hanya bagian remote itu yang menampilkan fallback.
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="remote-error">
          <strong>⚠️ Remote "{this.props.name}" tidak tersedia.</strong>
          <p>Pastikan server remote berjalan, lalu muat ulang halaman.</p>
          <code>{String(this.state.error.message || this.state.error)}</code>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RemoteBoundary({ name, children, fallback }) {
  return (
    <ErrorBoundary name={name}>
      <Suspense fallback={fallback ?? <div className="remote-loading">Memuat remote "{name}"…</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
