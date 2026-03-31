import { templates } from '../../lib/mock-data';

export default function TemplatesPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>返信テンプレート</h2>
          <p>星評価別のテンプレートを管理し、AI返信の土台として再利用します。</p>
        </div>
        <button className="button">テンプレを追加</button>
      </div>

      <div className="panel-list">
        {templates.map((template) => (
          <section className="panel-item" key={template.name}>
            <strong>{template.name}</strong>
            <div style={{ color: '#6b7280', margin: '6px 0' }}>対象評価: ★{template.star}</div>
            <div>{template.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
