import { useSelector } from '../../services/store';
import { selectIngredientsLoading } from '../../services/slices/ingredientsSlice';

import styles from './constructor-page.module.css';

import { FC } from 'react';
import { Preloader } from '@ui';
import { BurgerConstructor, BurgerIngredients } from '@components';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
