import { useEffect, useState } from "react";

const Search = ({ handelSearchResult, placeholder }) => {
  const [searchInput, setSearchInput] = useState("");
  const [debounceSearchInput, setDebounceSearchInput] = useState("");

  const handelChangeSeach = async (e) => {
    setSearchInput(e.target.value);
  };

  const searchResult = async () => {
    handelSearchResult({ debounceSearchInput });
  };
  useEffect(() => {
    searchResult();
  }, [debounceSearchInput]);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounceSearchInput(searchInput);
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [searchInput, 500]);

  return (
    <div className="search__area">
      <form action="#">
        <button type="button" className="search_btn">
          <i className="far fa-search" />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => {
            handelChangeSeach(e);
          }}
          value={searchInput}
        />
      </form>
    </div>
  );
};

export default Search;
