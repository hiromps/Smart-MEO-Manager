import { locations } from '../../lib/mock-data';

export default function LocationsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>店舗管理</h2>
          <p>Googleビジネスプロフィールとの紐付けを含めて、複数店舗を管理します。</p>
        </div>
        <button className="button">店舗を追加</button>
      </div>

      <div className="grid cols-3">
        {locations.map((location) => (
          <section className="card" key={location.googleId}>
            <h3>{location.name}</h3>
            <p>{location.address}</p>
            <p><strong>Google Location ID:</strong> {location.googleId}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
