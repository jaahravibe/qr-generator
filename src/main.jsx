import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="wrap">
          <div className="card">
            <h1>Something went wrong</h1>
            <p>
              The renderer hit an error. Details:{" "}
              <code>{String(this.state.error?.message || this.state.error)}</code>
            </p>
            <button className="btn btn--primary" type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);