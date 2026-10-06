export function qualityLimits(quality) {
  return quality==='high'?{particles:1200,dpr:1.5,textures:8,bloom:true}:quality==='low'?{particles:350,dpr:1,textures:4,bloom:false}:{particles:0,dpr:1,textures:0,bloom:false};
}
export function createFrameMonitor(initial) {
  let quality=initial,start=null,last=null,count=0,sum=0,slow=0;
  function reset(timeMs){start=timeMs;last=null;count=0;sum=0;slow=0;}
  return {reset,record({timeMs,visible}) {
    if(!visible){reset(timeMs);return quality;}
    if(start===null)reset(timeMs);
    if(last!==null && timeMs<=last)return quality;
    if(timeMs-start<2000 || last===null || last<start+2000){last=timeMs;return quality;}
    sum+=timeMs-last;last=timeMs;count++;
    if(count===120){
      slow=sum/count>32+1e-7?slow+1:0;count=0;sum=0;
      if(quality==='high'&&slow){quality='low';slow=0;}
      else if(quality==='low'&&slow>=2){quality='off';slow=0;}
    }
    return quality;
  }};
}
