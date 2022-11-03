// Example adapted from: https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster

import { FC, useState } from "react";

// Infinite loop protection needs to be turned off for this to work
function sleep(time: number) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
}

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).

interface SlowComponentProps {
  time: number;
  onChange(n: number): void;
}

const SlowComponent: FC<SlowComponentProps> = (props) => {
  const { time, onChange } = props;

  sleep(time);
  return (
    <div>
      Wow, that was{" "}
      <input
        value={time}
        type="text"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      ms slow
    </div>
  );
};

interface DogNameProps {
  time: number;
  dog: string;
  onChange(s: string): void;
}

const DogName: FC<DogNameProps> = (props) => {
  const { time, dog, onChange } = props;
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input id="dog" value={dog} onChange={(e) => onChange(e.target.value)} />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : "enter a dog name"}</p>
    </div>
  );
};

const SampleForm: FC = () => {
  // this is "global state"
  const [dog, setDog] = useState("");
  const [time, setTime] = useState(200);
  return (
    <div>
      <DogName time={time} dog={dog} onChange={setDog} />
      <SlowComponent time={time} onChange={setTime} />
    </div>
  );
};

const WithGlobalState: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      This is our base example, taken from{" "}
      <a
        href="https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster"
        target="_blank"
        rel="noreferrer"
      >
        Kent Dodds' blog
      </a>
      . We have a parent component that holds the <code>dog</code> and{" "}
      <code>time</code> state variables. We have made <code>time</code> very
      expensive to calculate (on purpose).
    </p>
    <p>
      Notice how slow the component loads when you enter a Dog Name, even though{" "}
      <code>time</code> has not changed.
    </p>
    <SampleForm />
  </div>
);

export default WithGlobalState;
