import "./styles.css";
import WithGlobalState from "./WithGlobalState";
import WithColocation from "./WithColocation";
import WithReactContext from "./WithReactContext";
import WithMemoizedComponent from "./WithMemoizedComponent";
import WithMemoizedFn from "./WithMemoizedFn";
import WithRedux from "./WithRedux";
import WithRtk from "./WithRtk";
import WithXstateSingle from "./WithXstateSingle";
import WithXstateMultiple from "./WithXstateMultiple";
import WithMobxSingle from "./WithMobxSingle";
import WithMobxMultiple from "./WithMobxMultiple";
import { ChangeEvent, FC, useState } from "react";

const exampleTitles = [
  "Global State (slow)",
  "Colocation",
  "memo",
  "useMemo",
  "React Context (slow)",
  "Redux - Single Store",
  "Redux Toolkit - Slices",
  "XState - Single Machine (slow)",
  "XState - Multiple Machines",
  "MobX - Single Store",
  "MobX - Multiple Stores",
];

interface SwitchComponentProps {
  exampleId: number;
}

const SwitchComponent: FC<SwitchComponentProps> = (props) => {
  const { exampleId } = props;
  const title = exampleTitles[exampleId];
  switch (title) {
    case "Global State (slow)":
      return <WithGlobalState title={title} />;
    case "Colocation":
      return <WithColocation title={title} />;
    case "memo":
      return <WithMemoizedComponent title={title} />;
    case "useMemo":
      return <WithMemoizedFn title={title} />;
    case "React Context (slow)":
      return <WithReactContext title={title} />;
    case "Redux - Single Store":
      return <WithRedux title={title} />;
    case "Redux Toolkit - Slices":
      return <WithRtk title={title} />;
    case "XState - Single Machine (slow)":
      return <WithXstateSingle title={title} />;
    case "XState - Multiple Machines":
      return <WithXstateMultiple title={title} />;
    case "MobX - Single Store":
      return <WithMobxSingle title={title} />;
    case "MobX - Multiple Stores":
      return <WithMobxMultiple title={title} />;
    default:
      return null;
  }
};

export default function App() {
  const [currentExample, setCurrentExample] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentExample(Number(e.currentTarget.value));
  };

  return (
    <div className="app">
      <div>
        <h1>React State Performance</h1>
        <p>
          These are various examples to showcase how easily React performance is
          affected by state management choices.
        </p>
        <form>
          <fieldset>
            <legend>Select an example:</legend>
            {exampleTitles.map((name, id) => {
              return (
                <div key={name}>
                  <input
                    type="radio"
                    id={name}
                    name="example"
                    value={id}
                    checked={id === currentExample}
                    onChange={handleChange}
                  />
                  <label htmlFor={name}>{name}</label>
                </div>
              );
            })}
          </fieldset>
        </form>
      </div>
      <SwitchComponent exampleId={currentExample} />
    </div>
  );
}
