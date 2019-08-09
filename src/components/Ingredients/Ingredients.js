import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList.js";
import ErrorModal from "../UI/ErrorModal";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("render ingredients", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch("https://react-update.fireeio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevState => [
          ...prevState,
          {
            id: responseData.name,
            ...ingredient
          }
        ]);
      })
      .catch(err => setError("Something went wrong "));
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(
      `https://react-update.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE"
      }
    )
      .then(res => {
        setIsLoading(false);
        setUserIngredients(prevIngredients =>
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        );
      })
      .catch(err => setError("Something went wrong "));
  };

  const onCloseHandler = () => {
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={onCloseHandler}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
