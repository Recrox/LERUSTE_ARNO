import Sidebar from './components/Sidebar.jsx';
import Hero from './components/Hero.jsx';
import WorkCard from './components/WorkCard.jsx';
import TrainingCard from './components/TrainingCard.jsx';
import PortfolioCard from './components/PortfolioCard.jsx';
import CalendarCard from './components/CalendarCard.jsx';
import ActivityCard from './components/ActivityCard.jsx';

export default function App() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 p-4 lg:flex-row">
      <Sidebar />
      <main className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_minmax(300px,0.9fr)] xl:items-start">
        <Hero />
        <CalendarCard />
        <WorkCard />
        <PortfolioCard />
        <ActivityCard />
        <TrainingCard />
      </main>
    </div>
  );
}
