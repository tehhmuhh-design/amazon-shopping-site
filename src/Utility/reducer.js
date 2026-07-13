import { Type } from "./action.type";

// Load basket from local storage when the application starts
const savedBasket = JSON.parse(localStorage.getItem('basket')) || [];

// Initial state with the saved basket from local storage and a default null user
export const initialState = {
  basket: savedBasket,
  user: null
};

// Reducer function that handles various action types
export const reducer = (state, action) => {
  switch (action.type) {
    case Type.ADD_TO_BASKET:
      {
        // Find if the item is already in the basket
        const existingItem = state.basket.find(
          (item) => item.id === action.item.id
        );
        
        // If the item is not in the basket, add it with an amount of 1
        if (!existingItem) {
          const updatedBasket = [...state.basket, { ...action.item, amount: 1 }];
          
          // Save the updated basket to local storage
          localStorage.setItem('basket', JSON.stringify(updatedBasket));
          
          return {
            ...state,
            basket: updatedBasket, // Update the state with the new basket
          };
        } else {
          // If the item exists, increase its amount
          const updatedBasket = state.basket.map((item) => {
            return item.id === action.item.id
              ? { ...item, amount: item.amount + 1 } // Increase amount by 1
              : item;
          });
          
          // Save the updated basket to local storage
          localStorage.setItem('basket', JSON.stringify(updatedBasket));
          
          return {
            ...state,
            basket: updatedBasket, // Update the state with the new basket
          };
        }
      }

    case Type.REMOVE_FROM_BASKET:
      {
        // Find the index of the item in the basket
        const index = state.basket.findIndex((item) => item.id === action.id);
        let newBasket = [...state.basket];

        if (index >= 0) {
          if (newBasket[index].amount > 1) {
            // If the item amount is more than 1, decrease it by 1
            newBasket[index] = {
              ...newBasket[index],
              amount: newBasket[index].amount - 1,
            };
          } else {
            // If the amount is 1, remove the item from the basket
            newBasket.splice(index, 1);
          }
        }

        // Save the updated basket to local storage
        localStorage.setItem('basket', JSON.stringify(newBasket));
        
        return {
          ...state,
          basket: newBasket, // Update the state with the new basket
        };
      }

    case Type.SET_USER:
      return {
        ...state,
        user: action.user // Update the user in the state when a user logs in or out
      }

    case Type.EMPTY_BASKET:
      // Empty the basket and clear it from local storage
      localStorage.setItem('basket', JSON.stringify([]));
      return {
        ...state,
        basket: [] // Set the basket to an empty array
      }

    default:
      return state; // Return the current state by default if no case matches
  }
}
