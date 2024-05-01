interface Props {
  text: string;
}

export function GraphFooter(props: Props) {
  const { text } = props;

  return (
    <p
      className='undp-typography margin-bottom-00 margin-top-03 italics'
      style={{
        color: 'var(--gray-600)',
        fontSize: '0.875rem',
      }}
    >
      *{text}
    </p>
  );
}
