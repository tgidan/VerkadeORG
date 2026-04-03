
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { RequestPage } from "./app/pages/RequestPage.tsx";
  import "./styles/index.css";

  const isRequestPage = new URLSearchParams(window.location.search).get('page') === 'request';

  createRoot(document.getElementById("root")!).render(
    isRequestPage ? <RequestPage /> : <App />
  );
