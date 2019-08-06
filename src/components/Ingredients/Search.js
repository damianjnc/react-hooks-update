import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const query =
      searchTerm.length === 0 ? "" : `?orderBy="title"&equalTo="${searchTerm}"`;

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
  }, [searchTerm, onLoadIngredients]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
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
