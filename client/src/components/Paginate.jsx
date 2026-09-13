import { Link } from 'react-router-dom';

function Paginate({ pages, page, keyword = '', category = '', baseUrl = '/' }) {
  if (pages <= 1) return null;

  const buildLink = (pageNumber) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    params.set('pageNumber', pageNumber);
    const query = params.toString();
    const path = keyword ? `/search/${encodeURIComponent(keyword)}` : baseUrl;
    return `${path}?${query}`;
  };

  return (
    <div className="pagination">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={buildLink(x + 1)}
          className={x + 1 === page ? 'page-link active' : 'page-link'}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
}

export default Paginate;
