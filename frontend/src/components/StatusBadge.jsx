const colors = {
  PENDING:   { bg: '#FEF3C7', text: '#92400E' },
  APPROVED:  { bg: '#D1FAE5', text: '#065F46' },
  REJECTED:  { bg: '#FEE2E2', text: '#991B1B' },
  CANCELLED: { bg: '#F3F4F6', text: '#374151' },
};

export default function StatusBadge({ status }) {
  const c = colors[status] || colors.PENDING;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600
    }}>
      {status}
    </span>
  );
}