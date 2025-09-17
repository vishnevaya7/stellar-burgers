import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

export interface OrdersState {
  feeds: TOrder[];
  feedsTotal: number;
  feedsTotalToday: number;
  feedsLoading: boolean;
  feedsError: string | null;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
  newOrder: TOrder | null;
  orderRequest: boolean;
  orderError: string | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  currentOrderError: string | null;
}

const initialState: OrdersState = {
  feeds: [],
  feedsTotal: 0,
  feedsTotalToday: 0,
  feedsLoading: false,
  feedsError: null,

  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null,

  newOrder: null,
  orderRequest: false,
  orderError: null,

  currentOrder: null,
  currentOrderLoading: false,
  currentOrderError: null
};

export const fetchFeeds = createAsyncThunk(
  'orders/fetchFeeds',
  async () => await getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => await getOrdersApi()
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearNewOrder: (state) => {
      state.newOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.feedsLoading = true;
        state.feedsError = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.feedsLoading = false;
        state.feeds = action.payload.orders;
        state.feedsTotal = action.payload.total;
        state.feedsTotalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.feedsLoading = false;
        state.feedsError = action.error.message || 'Failed to fetch feeds';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError =
          action.error.message || 'Failed to fetch user orders';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.newOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || 'Failed to create order';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrderError =
          action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearNewOrder } = ordersSlice.actions;

export const selectFeeds = (state: { orders: OrdersState }) =>
  state.orders.feeds;
export const selectFeedsTotal = (state: { orders: OrdersState }) =>
  state.orders.feedsTotal;
export const selectFeedsTotalToday = (state: { orders: OrdersState }) =>
  state.orders.feedsTotalToday;
export const selectFeedsLoading = (state: { orders: OrdersState }) =>
  state.orders.feedsLoading;

export const selectUserOrders = (state: { orders: OrdersState }) =>
  state.orders.userOrders;
export const selectUserOrdersLoading = (state: { orders: OrdersState }) =>
  state.orders.userOrdersLoading;
export const selectUserOrdersError = (state: { orders: OrdersState }) =>
  state.orders.userOrdersError;

export const selectNewOrder = (state: { orders: OrdersState }) =>
  state.orders.newOrder;
export const selectOrderRequest = (state: { orders: OrdersState }) =>
  state.orders.orderRequest;

export const selectCurrentOrder = (state: { orders: OrdersState }) =>
  state.orders.currentOrder;
export const selectCurrentOrderLoading = (state: { orders: OrdersState }) =>
  state.orders.currentOrderLoading;

export default ordersSlice.reducer;
