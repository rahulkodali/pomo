import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import PlayButton from './PlayButton';
import { useContext, useState, useEffect, useRef} from 'react';
import SettingsContext from './SettingsContext';

const red = '#B22222';
const green = '#8A2BE2';

function Timer() {
    const settingsInfo = useContext(SettingsContext);
    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work');
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function switchMode() {
        if (modeRef.current === 'work') {
            setMode('break');
            modeRef.current = 'break';
        } else {
            setMode('work');
            modeRef.current = 'work';
        }
        setSecondsLeft (modeRef.current === 'work' ? settingsInfo.workMinutes * 60: settingsInfo.breakMinutes * 60);
        secondsLeftRef.current = modeRef.current === 'work' ? settingsInfo.workMinutes * 60: settingsInfo.breakMinutes * 60;


    }
    function initTimer() {
        secondsLeftRef.current = settingsInfo.workMinutes * 60;
        setSecondsLeft(settingsInfo.workMinutes * 60)
    }
    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current - 1);

    }
    useEffect(() => {
        initTimer();

        const interval = setInterval(() => {
            if (isPausedRef.current) {
                return;
            }
            if (secondsLeftRef.current === 0) {
                return switchMode();
            }
            tick();
    }
        ,1000);
        return () => clearInterval(interval);
    }, [settingsInfo]);

    const totalSeconds = mode === 'work' ? settingsInfo.workMinutes * 60: settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft * 100/ totalSeconds);
    const minutes = Math.floor(secondsLeft / 60);
    var seconds = secondsLeft % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    

    return(
        <div>
  <CircularProgressbarWithChildren value={percentage}
  text={minutes + ":" + seconds}
  styles={buildStyles({
    rotation: 1,
    strokeLinecap: 'round',
    pathColor: mode === 'work' ? red : green,
    textColor: '#ffff',
    trailColor: '#FFF5EE',
    backgroundColor: '#3e98c7',
  })}>
  <label style={{ fontSize: 20, marginTop: 90 }}>
  {mode}
  </label>
</CircularProgressbarWithChildren>
  <div style={{marginTop: '20px'}}>
    {isPaused ? <PlayButton onClick = {() => {setIsPaused(false); isPausedRef.current = false}}/> : <PauseButton onClick = {() => {setIsPaused(true); isPausedRef.current = true}}/>}
  </div>
  <div style={{marginTop: '1px'}}>
    <SettingsButton onClick = {() => settingsInfo.setShowSettings(true)}/>
  </div>
        </div>
    );
}

export default Timer;