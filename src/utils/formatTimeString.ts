export function formatTimeString(time: string){
    let newTime = time.split('')

    if(Number(newTime[0]) >= 3 && Number(newTime[1]) >= 4){ newTime[0] = '0'; newTime[1] = '0';}
    if(Number(newTime[3]) >= 6) newTime[3] = '0';
    
    // TODO: Fix to work with backspace
    if(!newTime.includes(':')){
        if(newTime.length >= 2) newTime.splice(2, 0, ':')
    }
    return newTime.join('')
}