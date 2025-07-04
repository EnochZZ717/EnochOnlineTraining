import React, { useState, useEffect } from 'react'

let timer : any = null;
export default function ExamTimer(props: {time: number}) {
    const { time } = {...props};
    const getFormatTime = (time: number) => {
        if(time < 60){
            if(time > 0){
                return `00:00:${showFormat(time)}`
                
            }else{
                return '00:00:00'
            }
        }else{
            let minute = Math.floor(time / 60);
            let leftSecond = Math.floor(time % 60);
            if(minute < 60){
                return `00:${showFormat(minute)}:${showFormat(leftSecond)}`;
            }else{
                let hour = Math.floor(minute / 60);
                let leftMinute = Math.floor(hour % 60);
                return `${showFormat(hour)}:${showFormat(leftMinute)}:${showFormat(leftSecond)}`;
            }
        }
    }

    const showFormat = (time: number) => {
        if(time > 9){
            return time;
        }else{
            return `0${time}`
        }
    }

    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        timer = setInterval(()=> setCurrentTime(currentTime => ++currentTime), 1000);
        return () => timer && clearInterval(timer);
    }, [currentTime])

    return (
        <div>
            {getFormatTime(currentTime)}
        </div>
    )
}
