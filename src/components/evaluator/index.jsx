import React, { useState } from "react";
import { ErrorText } from "../error";

export function Evaluator({ criteria, onSubmit, onCancel }) {
  /* States */
  const [model, setModel] = useState(criteria);
  const [page, setPage] = useState(0);

  /* Variables */
  const isNotSaveable = model?.tasks[page]?.aspects.filter(x => x.required).some(y => y.value === undefined);

  const handleSubmit = () => {
    const results = model?.tasks?.reduce((acc, curr) => {
      const currentAspectsResults = curr.aspects.map(x => ({ id: x.id, value: x.value || 0 }));

      return [...acc, ...currentAspectsResults];
    }, []);

    return onSubmit({ results });
  };

  const handleCancel = () => {
    const results = model?.tasks?.reduce((acc, curr) => {
      const currentAspectsResults = curr.aspects.filter(y => y.value !== undefined).map(x => ({ id: x.id, value: x.value }));

      return [...acc, ...currentAspectsResults];
    }, []);

    return onCancel({ results });
  };

  const onPrevTask = () => setPage(prev => prev - 1);

  const onNextTask = () => setPage(prev => prev + 1);

  const onChangeTask = task => {
    setModel(prev => ({
      ...prev,
      tasks: prev.tasks.map(x => (x.name === task.name ? task : x)),
    }));
  };

  return model?.tasks?.length ? (
    <div id="wrapper">
      <div id="pages">
        {model.tasks.map((task, i) => (
          <div key={i} onClick={() => setPage(i)} className="page" style={{ border: i === page ? "1px solid #c3c3c3" : "none" }}>
            {task.name}
          </div>
        ))}
      </div>

      <div id="tasks">
        <Task key={model.tasks[page].name} task={model.tasks[page]} onChangeTask={onChangeTask} />
      </div>

      <div id="navigation">
        <button onClick={onPrevTask} disabled={page === 0}>
          Előző feladat
        </button>
        <button onClick={handleSubmit} id="success" disabled={isNotSaveable}>
          Mentés
        </button>
        <button onClick={handleCancel} id="error">
          Mégse
        </button>
        <button onClick={onNextTask} disabled={page === model.tasks.length - 1}>
          Következő feladat
        </button>
      </div>
    </div>
  ) : (
    <ErrorText text="Nincsen megjeleníthető task" />
  );
}

const Task = ({ task, onChangeTask }) => {
  /* Variables */
  const sumOfPoints = task?.aspects?.reduce((acc, curr) => acc + (curr?.value || 0), 0);
  const minimumPoints = task?.aspects?.reduce((acc, curr) => acc + ((curr.required && curr.maxValue) || 0), 0);
  const maximumPoints = task?.aspects?.reduce((acc, curr) => acc + (curr.maxValue || 0), 0);

  const onChangeAspect = aspect => {
    onChangeTask({
      ...task,
      aspects: task.aspects.map(x => (x.id === aspect.id ? aspect : x)),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {task?.aspects?.length ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px solid black",
            }}>
            <span>#</span>
            <span>Szempont megnevezése</span>
            <span>Elért pontszám / Maximális pontszám</span>
            <span>Szempont leírása</span>
          </div>

          {task.aspects.map((aspect, i) => (
            <Aspect key={aspect.id} aspect={aspect} order={i + 1} onChangeAspect={onChangeAspect} />
          ))}

          <span id="sumOfPoints">Minimum pontszám:{minimumPoints}</span>
          <span id="sumOfPoints">Maximum pontszám:{maximumPoints}</span>
          <span id="sumOfPoints">Pontszám: {sumOfPoints}</span>

          <div id="progressbar">
            <div id="progress" style={{ width: `${(sumOfPoints / maximumPoints || 1) * 100}%` }} />
          </div>
        </>
      ) : (
        <ErrorText text="Nincsen megjeleníthető aspektus" />
      )}
    </div>
  );
};

const Aspect = ({ aspect, order, onChangeAspect }) => {
  const onChangeValue = e => {
    switch (e.target.type) {
      case "number":
      case "radio":
      case "select-one":
        onChangeAspect({ ...aspect, value: Number(e.target.value) });
        break;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1em",
        borderBottom: "1px solid grey",
      }}>
      <span>{order}</span>
      <span>{aspect.name}</span>

      {aspect.type === "number" ? (
        <div style={{ flexDirection: "row" }}>
          <input type="number" min={0} max={aspect.maxValue} required={aspect.required} value={aspect.value} onChange={onChangeValue} />

          <span>/{aspect.maxValue}</span>
        </div>
      ) : aspect.type === "list" ? (
        <select value={aspect.value} onChange={onChangeValue} required={aspect.required}>
          {Object.keys(aspect.values).map(key => (
            <option key={key} value={aspect.values[key]}>
              {key}
            </option>
          ))}
        </select>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>
            Igaz
            <input type="radio" value={1} name={aspect.name} checked={aspect.value !== 0} onChange={onChangeValue} />
          </label>

          <label>
            Hamis
            <input type="radio" value={0} name={aspect.name} checked={aspect.value === 0} onChange={onChangeValue} />
          </label>
        </div>
      )}

      <span>{aspect.description}</span>
    </div>
  );
};
