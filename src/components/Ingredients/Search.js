import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm === inputRef.current.value) {
        const query =
          searchTerm.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${searchTerm}"`;

        fetch("https://react-update.firebaseio.com/ingredients.json" + query)
          .then(res => res.json())
          .then(data => {
            const loadedIngredients = [];
            for (let key in data) {
              loadedIngredients.push({
                id: key,
                title: data[key].title,
                amount: data[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer); //cleanup work
    };
  }, [searchTerm, onLoadIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
