const links = [
  { href: '/', label: 'ダッシュボード' },
  { href: '/reviews', label: '口コミ管理' },
  { href: '/locations', label: '店舗管理' },
  { href: '/templates', label: 'テンプレート' },
  { href: '/settings', label: '設定' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Smart MEO Manager</h1>
      <nav>
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
