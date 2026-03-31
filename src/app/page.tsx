import { dashboardKpis } from '../lib/mock-data';

export default function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>ダッシュボード</h2>
          <p>店舗別の口コミ運用状況とMEO指標を俯瞰します。</p>
        </div>
        <a className="button" href="/reviews">未対応口コミを見る</a>
      </div>

      <div className="grid cols-4">
        {dashboardKpis.map((kpi) => (
          <section key={kpi.label} className="card kpi">
            <span className="label">{kpi.label}</span>
            <strong className="value">{kpi.value}</strong>
          </section>
        ))}
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <section className="card">
          <h3>口コミ推移</h3>
          <div className="chart-placeholder">口コミ推移チャート</div>
        </section>
        <section className="card">
          <h3>検索・閲覧数</h3>
          <div className="chart-placeholder">検索・閲覧数チャート</div>
        </section>
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <section className="card">
          <h3>未対応アラート</h3>
          <div className="panel-list">
            <div className="panel-item">新宿本店: 未対応口コミ 9 件</div>
            <div className="panel-item">梅田店: 未対応口コミ 6 件</div>
            <div className="panel-item">名古屋店: 未対応口コミ 4 件</div>
          </div>
        </section>
        <section className="card">
          <h3>AI返信承認待ち</h3>
          <div className="panel-list">
            <div className="panel-item">星1レビューへの返信案が2件承認待ち</div>
            <div className="panel-item">星4レビューへの返信案が5件承認待ち</div>
          </div>
        </section>
      </div>
    </div>
  );
}
