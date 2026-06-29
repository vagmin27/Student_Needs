import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import study2 from "../../assets/images/study2.jpg";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { Search, X } from "lucide-react";

/** * This module handles the search query for tutors
 * @param {function} handleQuery prop passed in from parent component in SearchTutor.jsx
 * @returns JSX of search tutor rendering
 */
function SearchTutor({ notFound, search, handleSubmit, page }) {
  const [searchword, setSearchword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");

  /**
   * function that handles change on search input
   * @param {*} evt
   */
  const handleChange = (evt) => {
    evt.preventDefault();
    setSearchword(evt.target.value);
    setSearchParams({ query: evt.target.value, page: page });
  };

  /**
   * This function clears searchParams when search is false
   */
  useEffect(() => {
    if (!search) {
      setSearchParams("");
    }
  }, [search, setSearchParams]);

  /**
   * This function allows users to search with keypress "enter"
   */
  useEffect(() => {
    const keyDownHandler = (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        handleSubmit(searchword, 0);
      }
    };
    window.addEventListener("keydown", keyDownHandler);
    
    // cleanup (unmount)
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [searchword, handleSubmit]); // Updated dependencies for accuracy

  // function for when search button is clicked
  const handleClick = (evt) => {
    evt.preventDefault();
    handleSubmit(searchword, 0);
  };

  // renders no result
  const noRes = () => {
    return (
      <Alert variant="warning" className="max-w-md mx-auto mb-6 flex justify-between items-center">
        <AlertDescription className="text-sm font-medium">
          No results. Please try another keyword.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 w-full max-w-lg mx-auto">
      <div className="w-full text-center mb-8" role="main">
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] mb-6">Find a tutor</h1>
        <div className="flex gap-2 w-full">
          <Input
            type="text"
            value={searchword}
            onChange={handleChange}
            placeholder="What would you like to work on?"
            className="flex-grow h-11"
          />
          <Button
            type="button"
            aria-label="search"
            onClick={handleClick}
            className="h-11 px-5"
          >
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </div>
      </div>
      <div className="w-full" role="complementary">
        {notFound ? noRes() : null}
        <div className="max-w-md mx-auto rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-color)] shadow-[var(--shadow-sm)]">
          <img src={study2} className="w-full h-auto object-cover" alt="study picture" />
        </div>
      </div>
    </div>
  );
}

SearchTutor.propTypes = {
  notFound: PropTypes.bool,
  search: PropTypes.bool,
  page: PropTypes.number,
  handleSubmit: PropTypes.func,
};

export default SearchTutor;