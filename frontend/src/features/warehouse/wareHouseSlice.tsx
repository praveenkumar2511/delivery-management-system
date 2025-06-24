import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import wareHouseService from './warehouseService';
import { toast } from 'sonner';

interface Warehouse {
  name: string;
  latitude?: number;
  longitude?: number;
  _id?: string;
  
}

interface WarehouseState {
  data: Warehouse[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: WarehouseState = {
  data: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// ✅ Create warehouse thunk
export const newWarehouse = createAsyncThunk<
  Warehouse,
  Warehouse,
  { rejectValue: string }
>('warehouse/create', async (warehouse, thunkAPI) => {
  try {
    const response = await wareHouseService.createWarehouse(warehouse);
    toast.success('Warehouse created successfully');
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Fetch all warehouses thunk
export const fetchWarehouse = createAsyncThunk<
  Warehouse[],
  void,
  { rejectValue: string }
>('warehouse/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await wareHouseService.fetchWarehouse();
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const wareHouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(newWarehouse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(newWarehouse.fulfilled, (state, action: PayloadAction<Warehouse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data.push(action.payload);
      })
      .addCase(newWarehouse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? 'Failed to create warehouse';
      })

      // ✅ Fix for fetchWarehouse
      .addCase(fetchWarehouse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWarehouse.fulfilled, (state, action: PayloadAction<Warehouse[]>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchWarehouse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? 'Failed to fetch warehouses';
      });
  },
});

export const { reset } = wareHouseSlice.actions;
export default wareHouseSlice.reducer;
