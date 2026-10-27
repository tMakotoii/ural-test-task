import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchGoods } from './api.js'

export const searchBrands = createAsyncThunk('parts/searchBrands', (number) =>
  fetchGoods({ number })
)

export const searchOffers = createAsyncThunk('parts/searchOffers', async ({ number, brand }) => {
  const goods = await fetchGoods({ number, brand, analogues: 'on' })
  return goods.flatMap(({ analogues = [], ...item }) => [item, ...analogues])
})

const idle = { items: [], status: 'idle', error: null, requestId: null }

// игнорим ответ, если уже ушел новый запрос
const handle = (builder, thunk, key, onPending = () => {}) =>
  builder
    .addCase(thunk.pending, (state, action) => {
      state[key] = { ...idle, status: 'loading', requestId: action.meta.requestId }
      onPending(state, action)
    })
    .addCase(thunk.fulfilled, (state, { payload, meta }) => {
      if (state[key].requestId === meta.requestId) state[key] = { ...idle, items: payload, status: 'done' }
    })
    .addCase(thunk.rejected, (state, { error, meta }) => {
      if (state[key].requestId === meta.requestId) state[key] = { ...idle, status: 'error', error: error.message }
    })

const initialState = { brands: idle, offers: idle, selected: null }

const parts = createSlice({
  name: 'parts',
  initialState,
  reducers: { reset: () => initialState },
  extraReducers: (builder) => {
    handle(builder, searchBrands, 'brands', (state) => {
      state.offers = idle
      state.selected = null
    })
    handle(builder, searchOffers, 'offers', (state, { meta }) => {
      state.selected = meta.arg.brand
    })
  },
})

export const { reset } = parts.actions

export const store = configureStore({ reducer: { parts: parts.reducer } })
