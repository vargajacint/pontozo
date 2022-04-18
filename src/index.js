import ReactDOM from "react-dom/client";
import React from "react";

/* Style */
import style from "./style/index.css";

/* Data */
import data from "./data/dummy.json";

/* Components */
import { Evaluator } from "./components/evaluator";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Evaluator
      criteria={data}
      onCancel={(data) => console.log(data)}
      onSubmit={(data) => console.log(data)}
    />
  </React.StrictMode>
);
