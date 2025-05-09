import ContributionsList from "./components/ContributionsList/ContributionsList";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Overview of Video Contributions</h1>
        <p className="app-subtitle">
          Explore and discover our video contributions
        </p>
      </header>

      <ContributionsList />
    </div>
  );
};

export default App;
