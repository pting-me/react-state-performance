import { createStore, Dispatch, Reducer } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { FC } from "react";

// Infinite loop protection needs to be turned off for this to work
function sleep(time: number) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
}

interface Store {
  dog: string;
  time: number;
}

interface Action {
  type: string;
  payload?: any;
}

const initState = {
  dog: "",
  time: 200,
};

const reducer: Reducer<Store, Action> = (
  state: Store | undefined = initState,
  action: Action
) => {
  const { type, payload } = action;
  switch (type) {
    case "setDog":
      return { ...state, dog: payload };
    case "setTime":
      return { ...state, time: payload };
    default:
      return state;
  }
};

const store = createStore(reducer);

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).
const SlowComponent: FC = () => {
  const time = useSelector<Store, number>((state) => state.time);
  const dispatch = useDispatch<Dispatch<Action>>();

  sleep(time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={time}
        type="text"
        onChange={(e) =>
          dispatch({ type: "setTime", payload: Number(e.currentTarget.value) })
        }
      />
      ms slow
    </div>
  );
};

const DogName: FC = () => {
  const dog = useSelector<Store, string>((state) => state.dog);
  const time = useSelector<Store, number>((state) => state.time);
  const dispatch = useDispatch<Dispatch<Action>>();
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input
        id="dog"
        value={dog}
        onChange={(e) =>
          dispatch({ type: "setDog", payload: e.currentTarget.value })
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

const WithRedux: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      Changes to the Redux store do not cause all consumers to rerender. We can
      write code in the same exact way as the React Context, without having to
      do any memoization.
    </p>
    <p>
      This example was written to compare against the "React Context (slow)"
      example. For a more modern approach (as of October 2022), please refer to
      the Redux Toolkit example.
    </p>
    <SampleForm />
  </div>
);

export default WithRedux;
