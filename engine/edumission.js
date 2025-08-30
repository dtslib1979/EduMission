function parseCSV(t){
  const r=t.trim().split(/\r?\n/); const h=r.shift().split(',').map(s=>s.trim());
  return r.filter(x=>x).map(line=>{const a=line.split(','); const o={}; h.forEach((k,i)=>o[k]=a[i]); return o;});
}
function pct(a,b){a=+a; b=+b; if(!a||!b) return 0; return (b-a)/a*100;}
window.runEduMission = (ctx)=>{
  const pop = parseCSV(ctx.csv_population);
  const quota = parseCSV(ctx.csv_quota);
  const cut = parseCSV(ctx.csv_cutline);
  const yearsPop = pop.map(x=>+x.year).sort((a,b)=>a-b); const y2 = yearsPop.at(-1), y1=y2-1;
  const p2=pop.find(x=>+x.year===y2)?.cohort18, p1=pop.find(x=>+x.year===y1)?.cohort18;
  const dp=pct(p1,p2);
  const quotaSum={}; quota.forEach(q=>quotaSum[q.year]=(quotaSum[q.year]||0)+(+q.quota||0));
  const dq=pct(quotaSum[y1]||0, quotaSum[y2]||0);
  const alpha=0.67, beta=-0.50, gamma=0.25; const comp = alpha*dp + beta*dq + gamma*0;
  const lastCut = cut.filter(r=>+r.year===y1 && r.univ===ctx.target_univ && r.dept===ctx.target_dept && r.scheme==='수능')
                     .map(r=>parseFloat(r.cut_pct)).sort((a,b)=>a-b);
  const cutLast = lastCut.length? lastCut[Math.floor(lastCut.length/2)] : NaN;
  const shift = comp*0.3; const stability = Math.max(0, 100-Math.min(100, Math.abs(shift)*12));
  const expected = isNaN(cutLast)? NaN : (cutLast+shift);
  const score = ctx.score_pct||0;
  let decision='판정 불가';
  if(!isNaN(expected)){ if(score>=expected+1) decision='안정'; else if(score>=expected-1) decision='적정'; else decision='상향'; }
  const out = [
    `인구 증감률: ${dp.toFixed(2)}%`,
    `정원 증감률: ${dq.toFixed(2)}%`,
    `경쟁강도(ΔComp): ${comp.toFixed(2)} %p`,
    `작년 컷라인: ${isNaN(cutLast)?'-':cutLast.toFixed(2)}`,
    `올해 컷 예상 변화: ${shift.toFixed(2)} 점`,
    `안정성 지수: ${stability.toFixed(0)} / 100`,
    `판정: ${decision}`
  ].join('\n');
  ctx.outEl.textContent = out;
}