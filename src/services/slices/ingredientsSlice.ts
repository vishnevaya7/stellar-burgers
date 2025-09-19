import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export interface IngredientsState {
  ingredients: TIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.error = null;
          state.ingredients = action.payload;
          state.buns = action.payload.filter(
            (ingredient) => ingredient.type === 'bun'
          );
          state.mains = action.payload.filter(
            (ingredient) => ingredient.type === 'main'
          );
          state.sauces = action.payload.filter(
            (ingredient) => ingredient.type === 'sauce'
          );
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке ингредиентов';
        state.ingredients = [];
        state.buns = [];
        state.mains = [];
        state.sauces = [];
      });
  }
});

export const selectIngredients = (state: { ingredients: IngredientsState }) =>
  state.ingredients.ingredients;

export const selectBuns = (state: { ingredients: IngredientsState }) =>
  state.ingredients.buns;

export const selectMains = (state: { ingredients: IngredientsState }) =>
  state.ingredients.mains;

export const selectSauces = (state: { ingredients: IngredientsState }) =>
  state.ingredients.sauces;

export const selectIngredientsLoading = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.isLoading;

export default ingredientsSlice.reducer;
