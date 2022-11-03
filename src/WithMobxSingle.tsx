import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { createContext, FC, useContext } from "react";

class FormStore {
  dog: string;
  time: number;
  constructor(options: { dog: string; time: number }) {
    const { dog, time } = options;
    this.dog = dog;
    this.time = time;
    makeAutoObservable(this);
  }

  setDog(dog: string) {
    if (!this) {
      console.error("`this` is undefined!");
    } else {
      this.dog = dog;
    }
  }

  setTime(time: number) {
    this.time = time;
  }
}

const FormContext = createContext<FormStore>({} as FormStore);

// Infinite loop protection needs to be turned off for this to work
function sleep(time: number) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
}

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).

const SlowComponent: FC = observer(() => {
  const form = useContext(FormContext);
  sleep(form.time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={form.time}
        type="text"
        onChange={(e) => form.setTime(Number(e.target.value))}
      />
      ms slow
    </div>
  );
});

const DogName: FC = observer(() => {
  const form = useContext(FormContext);
  const { dog, setDog } = form;
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input
        id="dog"
        value={form.dog}
        onChange={(e) => form.setDog(e.target.value)}
      />
      <br />
      <label htmlFor="dog">
        <code>#dog-destructured</code> (should cause error)
      </label>
      <br />
      <input
        id="dog-destructured"
        value={dog}
        onChange={(e) => setDog(e.target.value)}
      />
      <p>
        {form.dog
          ? `${form.dog}'s favorite number is ${form.time}.`
          : "enter a dog name"}
      </p>
    </div>
  );
});

const SampleForm: FC = () => {
  const formStore = new FormStore({ dog: "", time: 200 });
  return (
    <FormContext.Provider value={formStore}>
      <DogName />
      <SlowComponent />
    </FormContext.Provider>
  );
};

const WithMobxSingle: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      MobX creates an observable store, which can be placed into React Context.
      All components using the store must be wrapped with the HOC{" "}
      <code>observer</code>. Unlike XState, we don't need to separate state into
      different stores for performance reasons (although it's still best
      practice).
    </p>
    <p>
      Also of note is the fact that we can't destructure the functions coming
      from the store. Take a look at the <code>#dog-destructured</code> input
      for example.
    </p>
    <SampleForm />
  </div>
);

export default WithMobxSingle;
