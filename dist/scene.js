(function(root){
const MODES={strict:{scene:.88,gap:.06},balanced:{scene:.80,gap:.04},flexible:{scene:.72,gap:.025},lenient:{scene:.67,gap:.015}};
function similarity(a,b){let best=-1;for(const x of a)for(const y of b){let s=0;for(let k=0;k<x.length;k++)s+=x[k]*y[k];best=Math.max(best,s)}return best}
function rank(matrix,ids){
 // A candidate must also prefer this document image. Repeated media share an identity.
 const unique=[...new Set(ids)].map(id=>ids.indexOf(id));
 return matrix.map((row,d)=>row.map((r,index)=>{let competitors=unique.filter(j=>ids[j]!==ids[d]).map(j=>matrix[j][index].scene);const other=competitors.length?Math.max(...competitors):-1;return {...r,index,reverseGap:r.scene-other,reciprocal:r.scene>=other-1e-6}}).sort((a,b)=>Number(b.nearExact)-Number(a.nearExact)||Number(b.reciprocal)-Number(a.reciprocal)||b.scene-a.scene));
}
// Pool local patch descriptors already produced by the full-image model pass.
function regions(tokens){const out=[];for(const size of [4,8])for(let y=0;y<=16-size;y+=4)for(let x=0;x<=16-size;x+=4){const v=new Float32Array(384);for(let yy=y;yy<y+size;yy++)for(let xx=x;xx<x+size;xx++){const offset=(1+yy*16+xx)*384;for(let k=0;k<384;k++)v[k]+=tokens[offset+k]}let norm=Math.sqrt(v.reduce((sum,n)=>sum+n*n,0));for(let k=0;k<384;k++)v[k]/=norm||1;out.push(v)}return out}
function suggestions(ranks,mode){return mode==='object'?ranks.slice().sort((a,b)=>b.objectScore-a.objectScore||b.scene-a.scene):ranks}
function decide(ranks,mode='balanced'){
 if(mode==='object')return {status:ranks.length?'review':'missing',index:null,reason:ranks.length?'Possible shared objects or image regions. These are suggestions only: compare the photos and choose a replacement, or mark not found. Similar backgrounds can also score highly.':'No uploaded photos available.'};
 const m=MODES[mode]||MODES.balanced;
 const geometric=RobustMatcher.decide(ranks.slice().sort((a,b)=>b.score-a.score),mode);
 if(geometric.status==='matched')return geometric;
 const candidates=ranks.filter(r=>r.reciprocal).sort((a,b)=>b.scene-a.scene);const best=candidates[0];
 if(best){const rival=candidates[1];const gap=rival?best.scene-rival.scene:1;
  if(best.scene>=m.scene&&best.reverseGap>=m.gap&&gap>=m.gap)return {status:'matched',index:best.index,reason:`Scene match across whole-image and crop comparisons (${best.scene.toFixed(3)}). Best location in both directions; check before export.`};
 }
 const possible=ranks.some(r=>r.scene>=.62&&r.reverseGap>=-.06)||geometric.status==='review';
 return {status:possible?'review':'missing',index:null,reason:possible?'Possible location match, but not enough separation from other photos. Check the suggestions.':'No sufficiently strong location match. You can still choose a photo manually.'};
}
root.SceneMatcher={MODES,similarity,rank,decide,regions,suggestions};if(typeof module!=='undefined')module.exports=root.SceneMatcher;
})(typeof self!=='undefined'?self:globalThis);
