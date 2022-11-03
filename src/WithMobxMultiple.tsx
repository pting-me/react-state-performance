import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { createContext, FC, useContext } from "react";

class DogStore {
  rootStore: RootStore;
  dog: string;
  constructor(options: { rootStore: RootStore; dog: string }) {
    const { rootStore, dog } = options;
    this.rootStore = rootStore;
    this.dog = dog;
    makeAutoObservable(this, { rootStore: false });
  }

  setDog(dog: string) {
    if (this) {
      this.dog = dog;
    }
  }
}

class TimeStore {
  rootStore: RootStore;
  time: number;
  constructor(options: { rootStore: RootStore; time: number }) {
    const { rootStore, time } = options;
    this.rootStore = rootStore;
    this.time = time;
    makeAutoObservable(this, { rootStore: false });
  }

  setTime(time: number) {
    if (this) {
      this.time = time;
    }
  }
}

class RootStore {
  dogStore: DogStore;
  timeStore: TimeStore;
  constructor() {
    this.dogStore = new DogStore({ rootStore: this, dog: "" });
    this.timeStore = new TimeStore({ rootStore: this, time: 200 });
  }
}

const RootContext = createContext<RootStore>({} as RootStore);

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
  const { timeStore } = useContext(RootContext);
  const { time } = timeStore;
  sleep(time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={time}
        type="text"
        onChange={(e) => timeStore.setTime(Number(e.target.value))}
      />
      ms slow
    </div>
  );
});

const DogName: FC = observer(() => {
  const { dogStore, timeStore } = useContext(RootContext);
  const { dog } = dogStore;
  const { time } = timeStore;
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input
        id="dog"
        value={dog}
        onChange={(e) => dogStore.setDog(e.target.value)}
      />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : "enter a dog name"}</p>
    </div>
  );
});

const SampleForm: FC = () => {
  const rootStore = new RootStore();
  return (
    <RootContext.Provider value={rootStore}>
      <DogName />
      <SlowComponent />
    </RootContext.Provider>
  );
};

const WithMobxMultiple: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>MobX with multiple stores, combined into a single root store.</p>
    <SampleForm />
  </div>
);

export default WithMobxMultiple;
