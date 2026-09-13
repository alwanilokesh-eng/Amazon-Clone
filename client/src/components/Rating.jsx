function Rating({ value, text }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating">
      {stars.map((star) => (
        <span key={star}>
          {value >= star ? '★' : value >= star - 0.5 ? '⯨' : '☆'}
        </span>
      ))}
      {text && <span className="rating-text">{text}</span>}
    </div>
  );
}

export default Rating;
