
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { RequestPage } from "./app/pages/RequestPage.tsx";
  import { GEWISPage } from "./app/pages/GEWISPage.tsx";
  import "./styles/index.css";

  const page = new URLSearchParams(window.location.search).get('page');

  function Root() {
    if (page === 'request') return <RequestPage />;
    if (page === 'GEWIS') return <GEWISPage />;
    return <App />;
  }

  createRoot(document.getElementById("root")!).render(<Root />);
