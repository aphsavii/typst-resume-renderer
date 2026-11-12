import { ResumeBuilderPage } from "./pages/ResumeBuilderPage";
import { ThemeProvider } from "./app/providers/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <ResumeBuilderPage />
    </ThemeProvider>
  );
}

export default App;
