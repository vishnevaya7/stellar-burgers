import { FC } from 'react';
import { useSelector } from '../../services/store';
import {
  selectFeeds,
  selectFeedsTotal,
  selectFeedsTotalToday
} from '../../services/slices/ordersSlice';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeeds);
  const total = useSelector(selectFeedsTotal);
  const totalToday = useSelector(selectFeedsTotalToday);
  const feed = {
    total,
    totalToday
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
