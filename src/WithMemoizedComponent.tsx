import { FC, memo, useState } from "react";

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

const MemoizedSlowComponent = memo(SlowComponent);

const SampleForm: FC = () => {
  // this is "global state"
  const [dog, setDog] = useState("");
  const [time, setTime] = useState(200);

  return (
    <div>
      <DogName time={time} dog={dog} onChange={setDog} />
      <MemoizedSlowComponent time={time} onChange={setTime} />
    </div>
  );
};

const WithMemoizedComponent: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      This approach creates a memoized component using the <code>memo</code>{" "}
      function. Use with caution, as this has a tendency to become overused.
    </p>
    <SampleForm />
  </div>
);

export default WithMemoizedComponent;
