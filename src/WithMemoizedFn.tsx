import { FC, useMemo, useState } from "react";

// Infinite loop protection needs to be turned off for this to work
function sleep(time: number) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
  return "sleep finished";
}

const expensiveCalculation = (time: number) => {
  sleep(time);
  return time;
};

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).

interface SlowComponentProps {
  time: number;
  onChange(n: number): void;
}

const SlowComponentWithMemoizedFn: FC<SlowComponentProps> = (props) => {
  const { time, onChange } = props;

  const calculatedTime = useMemo(() => expensiveCalculation(time), [time]);

  return (
    <div>
      Wow, that was{" "}
      <input
        value={calculatedTime}
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
      <SlowComponentWithMemoizedFn time={time} onChange={setTime} />
    </div>
  );
};

const WithMemoizedFn: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      Same concept as <code>memo</code>, but with a <code>useMemo</code> wrapped
      around the expensive <code>sleep</code> function.
    </p>
    <p>There are several things to note here:</p>
    <ul>
      <li>
        <code>useMemo</code> is meant to memoize the result of some calculation.{" "}
        <code>sleep</code> has been written to be more of a side effect, so
        we've rewritten an example that includes an{" "}
        <code>expensiveCalculation</code> function.
      </li>
      <li>
        If you need to memoize a side effect you should be using{" "}
        <code>useEffect</code>.
      </li>
      <li>
        This approach does not work with <code>useCallback</code> (or similarly,
        a <code>useMemo</code> that returns a function). This is because we need
        to memoize the <em>result</em> of the function, rather than the function
        itself.
      </li>
    </ul>
    <SampleForm />
  </div>
);

export default WithMemoizedFn;
