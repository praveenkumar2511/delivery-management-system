import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import orderService from './orderService';
import { toast } from 'sonner';

interface Order {
  warehouseId: string;
  agentId: string;
  address:string;
  latitude?: number;
  longitude?: number;
  deliveryDate:Date
}

interface OrderState {
  data: Order[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: OrderState = {
  data: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createOrder = createAsyncThunk<
  Order,
  any,
  { rejectValue: string }
>('warehouse/create', async (Order, thunkAPI) => {
  try {
    const response = await orderService.createOrder(Order);
    toast.success('Order created successfully');
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchOrder = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>('warehouse/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await orderService.fetchOrder();
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? 'Failed to create warehouse';
      })

      // ✅ Fix for fetchOrder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? 'Failed to fetch warehouses';
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
