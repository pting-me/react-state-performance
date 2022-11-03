import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { FC } from "react";

interface DogState {
  value: string;
}

const initDogState: DogState = {
  value: "",
};

const dogSlice = createSlice({
  name: "dog",
  initialState: initDogState,
  reducers: {
    inputChange: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

const selectDog = (state: RootState) => state.dog.value;

interface TimeState {
  value: number;
}

const initTimeState: TimeState = {
  value: 200,
};

const timeSlice = createSlice({
  name: "time",
  initialState: initTimeState,
  reducers: {
    inputChange: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

const selectTime = (state: RootState) => state.time.value;

const store = configureStore({
  reducer: {
    dog: dogSlice.reducer,
    time: timeSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Infinite loop protection needs to be turned off for this to work
function sleep(time: number) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
}

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).
const SlowComponent: FC = () => {
  const time = useAppSelector(selectTime);
  const dispatch = useAppDispatch();

  sleep(time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={time}
        type="text"
        onChange={(e) =>
          dispatch({
            type: "time/inputChange",
            payload: Number(e.currentTarget.value),
          })
        }
      />
      ms slow
    </div>
  );
};

const DogName: FC = () => {
  const dog = useAppSelector(selectDog);
  const time = useAppSelector(selectTime);
  const dispatch = useAppDispatch();
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input
        id="dog"
        value={dog}
        onChange={(e) =>
          dispatch({ type: "dog/inputChange", payload: e.currentTarget.value })
        }
      />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : "enter a dog name"}</p>
    </div>
  );
};

const SampleForm: FC = () => {
  return (
    <div>
      <Provider store={store}>
        <DogName />
        <SlowComponent />
      </Provider>
    </div>
  );
};

const WithRtk: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      This example uses the tools that are recommended by Redux Toolkit (
      <code>createSlice</code> and <code>configureStore</code>).
    </p>
    <SampleForm />
  </div>
);

export default WithRtk;
