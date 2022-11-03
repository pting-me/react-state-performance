import { createContext, FC, useContext } from "react";
import { createMachine, assign, InterpreterFrom } from "xstate";
import { useActor, useInterpret } from "@xstate/react";

// Infinite loop protection needs to be turned off for this to work
function sleep(time: number) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
}

interface DogMachineContext {
  dog: string;
}

interface TimeMachineContext {
  time: number;
}

const dogMachine = createMachine<DogMachineContext>({
  id: "dog",
  initial: "idle",
  predictableActionArguments: true,
  context: {
    dog: "",
  },
  states: {
    idle: {
      on: {
        inputChange: {
          actions: assign({
            dog: (_, event) => {
              return event.value;
            },
          }),
        },
      },
    },
  },
});

const timeMachine = createMachine<TimeMachineContext>({
  id: "time",
  initial: "idle",
  predictableActionArguments: true,
  context: {
    time: 200,
  },
  states: {
    idle: {
      on: {
        inputChange: {
          actions: assign({
            time: (_, event) => {
              return event.value;
            },
          }),
        },
      },
    },
  },
});

const GlobalContext = createContext({
  dogService: {} as InterpreterFrom<typeof dogMachine>,
  timeService: {} as InterpreterFrom<typeof timeMachine>,
});

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).
const SlowComponent: FC = () => {
  const { timeService } = useContext(GlobalContext);
  const [state] = useActor(timeService);
  const { time } = state.context;
  const { send } = timeService;

  sleep(time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={time}
        type="text"
        onChange={(e) =>
          send("inputChange", { value: Number(e.currentTarget.value) })
        }
      />
      ms slow
    </div>
  );
};

const DogName: FC = () => {
  const { dogService, timeService } = useContext(GlobalContext);
  const [dogState] = useActor(dogService);
  const [timeState] = useActor(timeService);
  const { dog } = dogState.context;
  const { time } = timeState.context;
  const { send } = dogService;

  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input
        id="dog"
        value={dog}
        onChange={(e) => send("inputChange", { value: e.currentTarget.value })}
      />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : "enter a dog name"}</p>
    </div>
  );
};

const SampleForm: FC = () => {
  const dogService = useInterpret(dogMachine);
  const timeService = useInterpret(timeMachine);

  return (
    <div>
      <GlobalContext.Provider value={{ dogService, timeService }}>
        <DogName />
        <SlowComponent />
      </GlobalContext.Provider>
    </div>
  );
};

const WithXstateMultiple: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      When placed into different machines, <code>dog</code> and{" "}
      <code>time</code> become independent of each other again. This sort of
      feature separation is similar to the best practices encouraged by Redux
      Toolkit (using slices).
    </p>
    <p>
      Notice that this separation is necessary to avoid performance problems,
      since we are still using React Context. In Redux it's more matter of code
      organization.
    </p>
    <SampleForm />
  </div>
);

export default WithXstateMultiple;
