import { createContext, useRef, useState, useEffect } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    })

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true)
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }


    const playWithId = async (id) => {
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = async () => {
        const currentIndex = songsData.findIndex(song => song.id === track.id);
        if (currentIndex > 0) {
            setTrack(songsData[currentIndex - 1]);
            setPlayStatus(true);
            setTimeout(() => {
                audioRef.current.play();
            }, 0);
        }
    };

    const next = async () => {
        const currentIndex = songsData.findIndex(song => song.id === track.id);
        if (currentIndex < songsData.length - 1) {
            setTrack(songsData[currentIndex + 1]);
            setPlayStatus(true);
            setTimeout(() => {
                audioRef.current.play();
            }, 0);
        }
    };


    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)

    }

    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }

        }, 1000);


    }, [audioRef])

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous, next,
        seekSong
    }
    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;