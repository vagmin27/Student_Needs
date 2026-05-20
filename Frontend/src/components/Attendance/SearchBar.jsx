import { MdSearch } from "react-icons/md";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrap">
      <MdSearch />
      <input
        type="text"
        className="search-input"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;