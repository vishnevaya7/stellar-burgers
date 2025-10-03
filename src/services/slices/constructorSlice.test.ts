import { configureStore } from '@reduxjs/toolkit';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructorSlice';

describe('constructorSlice', () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        burgerConstructor: constructorReducer
      }
    });

  type TestStore = ReturnType<typeof createTestStore>;
  let store: TestStore;

  const mockBun = {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun' as const,
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_mobile: 'bun_mobile.png',
    image_large: 'bun_large.png'
  };

  const mockIngredient = {
    _id: '2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main' as const,
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'main.png',
    image_mobile: 'main_mobile.png',
    image_large: 'main_large.png'
  };

  beforeEach(() => {
    store = createTestStore();
  });

  describe('обработка экшена добавления ингредиента', () => {
    it('должно добавлять булку и заменять существующую', () => {
      // Добавляем первую булку
      store.dispatch(addIngredient(mockBun));
      let state = store.getState().burgerConstructor;
      expect(state.bun).toMatchObject(mockBun);

      // Добавляем вторую булку - должна заменить первую
      const anotherBun = { ...mockBun, _id: '3', name: 'Другая булка' };
      store.dispatch(addIngredient(anotherBun));

      state = store.getState().burgerConstructor;
      expect(state.bun).toMatchObject(anotherBun);
      expect(state.bun?._id).toBe('3');
    });

    it('должно добавлять ингредиент в массив ingredients', () => {
      // Добавляем ингредиент
      store.dispatch(addIngredient(mockIngredient));

      const state = store.getState().burgerConstructor;
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.any(String) // Проверяем, что добавился уникальный id
      });
    });
  });

  describe('обработка экшена удаления ингредиента', () => {
    it('должно удалять ингредиент по id', () => {
      // Сначала добавляем ингредиенты
      store.dispatch(addIngredient(mockIngredient));
      store.dispatch(addIngredient({ ...mockIngredient, _id: '3' }));

      let state = store.getState().burgerConstructor;
      expect(state.ingredients).toHaveLength(2);

      // Получаем id первого ингредиента
      const firstIngredientId = state.ingredients[0].id;

      // Удаляем первый ингредиент
      store.dispatch(removeIngredient(firstIngredientId));

      state = store.getState().burgerConstructor;
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).not.toBe(firstIngredientId);
    });
  });

  describe('обработка экшена изменения порядка ингредиентов в начинке', () => {
    it('должно перемещать ингредиенты в массиве', () => {
      // Добавляем несколько ингредиентов
      const ingredient1 = { ...mockIngredient, _id: '1', name: 'Ингредиент 1' };
      const ingredient2 = { ...mockIngredient, _id: '2', name: 'Ингредиент 2' };
      const ingredient3 = { ...mockIngredient, _id: '3', name: 'Ингредиент 3' };

      store.dispatch(addIngredient(ingredient1));
      store.dispatch(addIngredient(ingredient2));
      store.dispatch(addIngredient(ingredient3));

      let state = store.getState().burgerConstructor;
      expect(state.ingredients[0].name).toBe('Ингредиент 1');
      expect(state.ingredients[1].name).toBe('Ингредиент 2');
      expect(state.ingredients[2].name).toBe('Ингредиент 3');

      // Перемещаем первый элемент на последнее место (0 -> 2)
      store.dispatch(moveIngredient({ dragIndex: 0, hoverIndex: 2 }));

      state = store.getState().burgerConstructor;
      expect(state.ingredients[0].name).toBe('Ингредиент 2');
      expect(state.ingredients[1].name).toBe('Ингредиент 3');
      expect(state.ingredients[2].name).toBe('Ингредиент 1');
    });

    it('должно перемещать ингредиенты с конца в начало', () => {
      // Добавляем ингредиенты
      const ingredient1 = { ...mockIngredient, _id: '1', name: 'Первый' };
      const ingredient2 = { ...mockIngredient, _id: '2', name: 'Второй' };
      const ingredient3 = { ...mockIngredient, _id: '3', name: 'Третий' };

      store.dispatch(addIngredient(ingredient1));
      store.dispatch(addIngredient(ingredient2));
      store.dispatch(addIngredient(ingredient3));

      // Перемещаем последний элемент в начало (2 -> 0)
      store.dispatch(moveIngredient({ dragIndex: 2, hoverIndex: 0 }));

      const state = store.getState().burgerConstructor;
      expect(state.ingredients[0].name).toBe('Третий');
      expect(state.ingredients[1].name).toBe('Первый');
      expect(state.ingredients[2].name).toBe('Второй');
    });
  });
});
