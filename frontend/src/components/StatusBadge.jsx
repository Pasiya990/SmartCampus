const colors = {
  PENDING:   { bg: 'var(--yellow-bg)', text: 'var(--yellow-text)' },
  APPROVED:  { bg: 'var(--green-bg)',  text: 'var(--green-text)'  },
  REJECTED:  { bg: 'var(--red-bg)',    text: 'var(--red-text)'    },
  CANCELLED: { bg: 'var(--gray-bg)',   text: 'var(--gray-text)'   },
};

export default function StatusBadge({ status }) {
  const c = colors[status] || colors.PENDING;
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      padding: '4px 12px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}