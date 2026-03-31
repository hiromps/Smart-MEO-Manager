import { reviews } from '../../lib/mock-data';

const badgeClass: Record<string, string> = {
  REPLIED: 'badge green',
  DRAFT: 'badge yellow',
  UNHANDLED: 'badge red',
};

export default function ReviewsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>口コミ管理</h2>
          <p>店舗・評価・返信状態で絞り込みながら、返信フローを管理します。</p>
        </div>
      </div>

      <section className="card">
        <table className="table">
          <thead>
            <tr>
              <th>投稿者</th>
              <th>評価</th>
              <th>コメント</th>
              <th>店舗</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={`${review.reviewer}-${review.store}`}>
                <td>{review.reviewer}</td>
                <td>{'★'.repeat(review.rating)}</td>
                <td>{review.comment}</td>
                <td>{review.store}</td>
                <td><span className={badgeClass[review.status]}>{review.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
