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
}

const DogName: FC<DogNameProps> = (props) => {
  const { time } = props;
  const [dog, setDog] = useState("");
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input id="dog" value={dog} onChange={(e) => setDog(e.target.value)} />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : "enter a dog name"}</p>
    </div>
  );
};

const SampleForm: FC = () => {
  // this is "global state"
  const [time, setTime] = useState(200);
  return (
    <div>
      <DogName time={time} />
      <SlowComponent time={time} onChange={setTime} />
    </div>
  );
};

const WithColocation: FC<{ title: string }> = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>
      This is Kent's suggested solution, which puts the <code>dog</code>{" "}
      variable down to where it is needed. It is a correct approach, but it can
      be difficult to detect or refactor.
    </p>
    <SampleForm />
  </div>
);

export default WithColocation;
