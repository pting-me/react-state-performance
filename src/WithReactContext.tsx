import { createContext, Dispatch, FC, useContext, useReducer } from "react";

// https://stackoverflow.com/questions/59741558/implement-useselector-equivalent-for-react-context

// Infinite loop protection needs to be turned off for this to work
function sleep(time: number) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
}

interface Action {
  type: string;
  payload: any;
}

interface State {
  dog: string;
  time: number;
  dispatch: Dispatch<Action>;
}

const initContext = {
  dog: "",
  time: 200,
  dispatch: () => {
    /* do nothing */
  },
};

const reducer = (state: State, action: Action) => {
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

const FormContext = createContext<State>(initContext);

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).
const SlowComponent: FC = () => {
  const { time, dispatch } = useContext(FormContext);

  sleep(time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={time}
        type="text"
        onChange={(e) =>
          dispatch({ type: "setTime", payload: Number(e.target.value) })
        }
      />
      ms slow
    </div>
  );
};

const DogName: FC = () => {
  const { time, dog, dispatch } = useContext(FormContext);
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input
        id="dog"
        value={dog}
        onChange={(e) => dispatch({ type: "setDog", payload: e.target.value })}
      />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : "enter a dog name"}</p>
    </div>
  );
};

const SampleForm: FC = () => {
  const [state, dispatch] = useReducer(reducer, initContext);

  return (
    <div>
      <FormContext.Provider value={{ ...state, dispatch }}>
        <DogName />
        <SlowComponent />
      </FormContext.Provider>
    </div>
  );
};

const WithReactContext: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      React <code>Context</code> (and its use in conjunction with{" "}
      <code>useReducer</code>) is not able to solve our performance problems.
      Changes to <code>Context</code> causes full rerender to trigger, you will
      still need to memoize like in the previous examples.
    </p>
    <p>
      See{" "}
      <a
        href="https://stackoverflow.com/questions/59741558/implement-useselector-equivalent-for-react-context"
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>{" "}
      for more context. Get it? Context? Okay I'll leave.
    </p>
    <SampleForm />
  </div>
);

export default WithReactContext;
