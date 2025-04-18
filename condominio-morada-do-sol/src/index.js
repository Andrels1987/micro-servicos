import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store_repo/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from "./features/api/context/AuthProvider";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>

      {/*  <ApiProvider api={apiSliceMoradores}> </ApiProvider> */}
      <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>

    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

