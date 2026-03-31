export const dashboardKpis = [
  { label: '総口コミ数', value: '1,284' },
  { label: '平均評価', value: '4.32' },
  { label: '返信率', value: '81%' },
  { label: '未対応件数', value: '37' },
];

export const reviews = [
  {
    reviewer: '佐藤さん',
    rating: 5,
    comment: 'スタッフ対応が丁寧でまた来たいです。',
    store: '新宿本店',
    status: 'REPLIED',
  },
  {
    reviewer: '田中さん',
    rating: 2,
    comment: '提供が少し遅かったです。',
    store: '梅田店',
    status: 'DRAFT',
  },
  {
    reviewer: '山本さん',
    rating: 1,
    comment: '接客が残念でした。',
    store: '名古屋店',
    status: 'UNHANDLED',
  },
];

export const locations = [
  { name: '新宿本店', address: '東京都新宿区...', googleId: 'GBP-001' },
  { name: '梅田店', address: '大阪府大阪市...', googleId: 'GBP-002' },
  { name: '名古屋店', address: '愛知県名古屋市...', googleId: 'GBP-003' },
];

export const templates = [
  { name: '星5向け標準返信', star: 5, body: 'ご来店ありがとうございます。嬉しいお言葉を励みに、今後もより良いサービスを提供してまいります。' },
  { name: '星3向け改善返信', star: 3, body: '貴重なご意見ありがとうございます。いただいたご意見をもとに改善に努めます。' },
  { name: '低評価向け謝意返信', star: 1, body: 'このたびはご期待に沿えず申し訳ありません。ご指摘を真摯に受け止め改善いたします。' },
];
