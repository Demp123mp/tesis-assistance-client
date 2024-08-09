import { AssistanceCheck } from './components/assistance-check';
import { LiveHour } from './components/live-hour';
import { NavBar } from './components/nav-bar';

export default function Home() {
  return (
    <div className="flex flex-col gap-2 items-center justify-end w-full h-screen bg-background">
      <div className="flex w-full h-fit items-center">
        <NavBar />
      </div>
      <div className='flex flex-col items-center justify-start gap-24 mt-10 h-full w-full'>
        <div className='flex items-center justify-center w-full h-fit'>
          <LiveHour />
        </div>
        <div className='flex items-center justify-center w-full h-fit'>
          <AssistanceCheck />
        </div>
      </div>
    </div>
  );
}
