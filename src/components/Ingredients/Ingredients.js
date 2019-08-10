import React, { useState, useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList.js";
import ErrorModal from "../UI/ErrorModal";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredients];
    case "DELETE":
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error("Should not get here");
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error:null}
    case 'RESPONSE':
      return {...httpState, loading:false}
    case 'ERROR':
      return{ loading:false, error: action.errorData}
    case 'CLEAR':
      return { loading: false, error: null}
    default:
      throw Error('should no be reached');
  }
}

function Ingredients() {
  // const [userIngredients, setUserIngredients] = useState([]);
  //const [isLoading, setIsLoading] = useState(false);
 //const [error, setError] = useState("");

  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading:false, error: null})

  console.log(userIngredients);
  useEffect(() => {
    console.log("render ingredients", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'})
    fetch("https://react-update.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        dispatchHttp({type:'RESPONSE'})

        return response.json();
      })
      .then(responseData => {
        // setUserIngredients(prevState => [
        //   ...prevState,
        //   {
        //     id: responseData.name,
        //     ...ingredient
        //   }
        // ]);
        dispatch({
          type: "ADD",
          ingredients: {
            id: responseData.name,
            ...ingredient
          }
        });
      })
      .catch(err =>  dispatchHttp({type: 'ERROR', errorData: 'Something went wront'}));
  };

  const removeIngredientHandler = ingredientId => {
    dispatchHttp({type: 'SEND'})
    fetch(
      `https://react-update.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE"
      }
    )
      .then(res => {
        dispatchHttp({type: 'RESPONSE'})
        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch(err =>  dispatchHttp({type: 'ERROR', errorData: 'Something went wront'}));
  };

  const onCloseHandler = () => {
    dispatchHttp({type: 'CLEAR'})
    dispatchHttp({type: 'RESPONSE'})
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={onCloseHandler}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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
