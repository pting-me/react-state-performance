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

interface FormMachineContext {
  dog: string;
  time: number;
}

const formMachine = createMachine<FormMachineContext>({
  id: "form",
  predictableActionArguments: true,
  initial: "idle",
  context: {
    dog: "",
    time: 200,
  },
  states: {
    idle: {
      on: {
        "dog/inputChange": {
          actions: assign({
            dog: (_, event) => {
              return event.value;
            },
          }),
        },
        "time/inputChange": {
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
  formService: {} as InterpreterFrom<typeof formMachine>,
});

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).
const SlowComponent: FC = () => {
  const { formService } = useContext(GlobalContext);
  const [state] = useActor(formService);
  const { time } = state.context;
  const { send } = formService;

  sleep(time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={time}
        type="text"
        onChange={(e) =>
          send("time/inputChange", { value: Number(e.currentTarget.value) })
        }
      />
      ms slow
    </div>
  );
};

const DogName: FC = () => {
  const { formService } = useContext(GlobalContext);
  const [state] = useActor(formService);
  const { dog, time } = state.context;
  const { send } = formService;

  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input
        id="dog"
        value={dog}
        onChange={(e) =>
          send("dog/inputChange", { value: e.currentTarget.value })
        }
      />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : "enter a dog name"}</p>
    </div>
  );
};

const SampleForm: FC = () => {
  const formService = useInterpret(formMachine);

  return (
    <div>
      <GlobalContext.Provider value={{ formService }}>
        <DogName />
        <SlowComponent />
      </GlobalContext.Provider>
    </div>
  );
};

const WithXstateSingle: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      XState creates state machines that can be placed into React Context. When
      the <code>dog</code> and <code>time</code> variables are placed into the
      same machine, we get the slow behavior again.
    </p>
    <SampleForm />
  </div>
);

export default WithXstateSingle;
