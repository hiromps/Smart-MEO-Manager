export default function SettingsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>設定</h2>
          <p>組織設定、通知、Googleビジネスプロフィール連携、将来的な課金設定を管理します。</p>
        </div>
      </div>

      <div className="grid cols-2">
        <section className="card">
          <h3>組織設定</h3>
          <ul>
            <li>組織名</li>
            <li>メンバー招待</li>
            <li>ロール管理</li>
          </ul>
        </section>
        <section className="card">
          <h3>外部連携</h3>
          <ul>
            <li>Googleビジネスプロフィール</li>
            <li>Clerk Webhook</li>
            <li>通知設定</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
