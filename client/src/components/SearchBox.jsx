import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SearchBox() {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form className="search-box" onSubmit={submitHandler}>
      <input
        type="text"
        name="q"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
      />
      <button type="submit" aria-label="Search">
        🔍
      </button>
    </form>
  );
}

export default SearchBox;
