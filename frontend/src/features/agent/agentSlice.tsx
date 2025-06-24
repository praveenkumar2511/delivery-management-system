// src/features/agent/agentSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import agentService from './agentService';
import { toast } from 'sonner';

// ✅ Agent request/response type
interface Agent {
  name: string;
  warehouseId: string;
  checkInTime: string;
  hoursWorked: number;
  kmCovered: number;
  _id?: string; // optional if your backend returns _id
}

// ✅ State type
interface AgentState {
  data: Agent[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

// ✅ Initial state
const initialState: AgentState = {
  data: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// ✅ Async thunk for agent creation
export const createAgent = createAsyncThunk<
  Agent,
  Agent,
  { rejectValue: string }
>(
  'agent/create',
  async (agent, thunkAPI) => {
    try {
      const response = await agentService.createAgent(agent);
      toast.success('Agent created successfully');
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAgents = createAsyncThunk<
  Agent[],
  void,
  { rejectValue: string }
>('agent/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await agentService.fetchAgent();
    return response;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const checkIn = createAsyncThunk<
  any, 
  string,
  { rejectValue: string }
>("agent/checkIn", async (id, thunkAPI) => {
  try {
    const res = await agentService.checkInAgent(id);
    return res;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});

export const checkOut = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("agent/checkOut", async (id, thunkAPI) => {
  try {
    const res = await agentService.checkOutAgent(id);
    return res;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});
// ✅ Slice
export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAgent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(createAgent.fulfilled, (state, action: PayloadAction<Agent>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data.push(action.payload);
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? 'Failed to create agent';
      })


            .addCase(fetchAgents.pending, (state) => {
              state.isLoading = true;
            })
            .addCase(fetchAgents.fulfilled, (state, action: PayloadAction<Agent[]>) => {
              state.isLoading = false;
              state.data = action.payload;
            })
            .addCase(fetchAgents.rejected, (state, action) => {
              state.isLoading = false;
              state.isError = true;
              state.message = action.payload ?? 'Failed to fetch warehouses';
            });
  },
});

export const { reset } = agentSlice.actions;

export default agentSlice.reducer;
