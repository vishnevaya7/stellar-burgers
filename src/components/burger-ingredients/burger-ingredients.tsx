import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';

import { useSelector, useDispatch } from '../../services/store';
import {
  fetchIngredients,
  selectBuns,
  selectMains,
  selectSauces,
  selectIngredientsLoading,
  selectIngredients
} from '../../services/slices/ingredientsSlice';
import { BurgerIngredientsUI } from '@ui';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const buns = useSelector(selectBuns);
  const mains = useSelector(selectMains);
  const sauces = useSelector(selectSauces);
  const isLoading = useSelector(selectIngredientsLoading);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });
  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
