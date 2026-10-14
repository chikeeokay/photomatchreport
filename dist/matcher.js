/* Local feature matching. OpenCV runs in a worker; no images leave the browser. */
(function(root){
const MODES={strict:{n:35,ratio:.65,coverage:.18,margin:12},balanced:{n:24,ratio:.50,coverage:.12,margin:10},flexible:{n:16,ratio:.40,coverage:.08,margin:8},lenient:{n:12,ratio:.32,coverage:.05,margin:6}};
function extract(cv,rgba,width,height){
 const src=cv.matFromArray(height,width,cv.CV_8UC4,rgba),gray=new cv.Mat(),small=new cv.Mat(),keys=new cv.KeyPointVector(),desc=new cv.Mat(),mask=new cv.Mat();let orb;
 try{cv.cvtColor(src,gray,cv.COLOR_RGBA2GRAY);cv.resize(gray,small,new cv.Size(32,32),0,0,cv.INTER_AREA);const signature=Array.from(small.data);orb=new cv.ORB(1100,1.2,8,25,0,2,cv.ORB_HARRIS_SCORE,31,12);orb.detectAndCompute(gray,mask,keys,desc);const points=[];for(let i=0;i<keys.size();i++){const p=keys.get(i).pt;points.push([p.x,p.y])}return {width,height,points,descriptors:new Uint8Array(desc.data),cols:desc.cols,signature};}
 finally{for(const x of [src,gray,small,keys,desc,mask,orb])if(x)x.delete()}
}
function signature(a,b){let ma=0,mb=0;for(let i=0;i<1024;i++){ma+=a[i];mb+=b[i]}ma/=1024;mb/=1024;let va=0,vb=0,cov=0,err=0;for(let i=0;i<1024;i++){const x=a[i]-ma,y=b[i]-mb;va+=x*x;vb+=y*y;cov+=x*y;err+=(a[i]-b[i])**2}return {correlation:cov/Math.sqrt(va*vb||1),rmse:Math.sqrt(err/1024)/255,texture:Math.min(Math.sqrt(va/1024),Math.sqrt(vb/1024))}}
function coverage(points,w,h){if(points.length<3)return 0;const cells=new Set(points.map(p=>Math.min(3,Math.floor(4*p[0]/w))+4*Math.min(3,Math.floor(4*p[1]/h))));let xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);let area=(Math.max(...xs)-Math.min(...xs))*(Math.max(...ys)-Math.min(...ys))/(w*h);return Math.min(area,cells.size/16)}
function compare(cv,a,b){
 const sig=signature(a.signature,b.signature);let result={inliers:0,ratio:0,coverage:0,score:0,nearExact:false,correlation:sig.correlation};
 if(a.points.length<4||b.points.length<4)return result;
 const da=cv.matFromArray(a.points.length,a.cols,cv.CV_8U,a.descriptors),db=cv.matFromArray(b.points.length,b.cols,cv.CV_8U,b.descriptors),bf=new cv.BFMatcher(cv.NORM_HAMMING,false),forward=new cv.DMatchVectorVector(),reverse=new cv.DMatchVectorVector();let ps,pt,H,mask;
 try{
 bf.knnMatch(da,db,forward,2);bf.knnMatch(db,da,reverse,2);
 const rev=new Map();for(let i=0;i<reverse.size();i++){let ms=reverse.get(i);try{if(ms.size()>=2){const x=ms.get(0),y=ms.get(1);if(x.distance<.80*y.distance&&x.distance<65)rev.set(x.queryIdx,x.trainIdx)}}finally{ms.delete()}}
 const pairs=[];for(let i=0;i<forward.size();i++){let ms=forward.get(i);try{if(ms.size()>=2){const x=ms.get(0),y=ms.get(1);if(x.distance<.80*y.distance&&x.distance<65&&rev.get(x.trainIdx)===x.queryIdx)pairs.push([a.points[x.queryIdx],b.points[x.trainIdx]])}}finally{ms.delete()}}
 if(pairs.length<8)return result;
 ps=cv.matFromArray(pairs.length,1,cv.CV_32FC2,pairs.flatMap(p=>p[0]));pt=cv.matFromArray(pairs.length,1,cv.CV_32FC2,pairs.flatMap(p=>p[1]));mask=new cv.Mat();H=cv.findHomography(ps,pt,cv.RANSAC,3.5,mask,1500,.995);if(H.empty())return result;
 const pa=[],pb=[];for(let i=0;i<pairs.length;i++)if(mask.data[i]){pa.push(pairs[i][0]);pb.push(pairs[i][1])}
 const inliers=pa.length,ratio=inliers/pairs.length,cover=Math.min(coverage(pa,a.width,a.height),coverage(pb,b.width,b.height));
 // Reject folded or almost singular mappings; a repeated texture must not collapse to a line.
 const h=H.data64F;const project=(x,y)=>{let d=h[6]*x+h[7]*y+h[8];return [(h[0]*x+h[1]*y+h[2])/d,(h[3]*x+h[4]*y+h[5])/d]};const corners=[[0,0],[a.width,0],[a.width,a.height],[0,a.height]].map(p=>project(...p));let crosses=corners.map((p,i)=>{let q=corners[(i+1)%4],r=corners[(i+2)%4];return (q[0]-p[0])*(r[1]-q[1])-(q[1]-p[1])*(r[0]-q[0])});if(!crosses.every(x=>Number.isFinite(x)&&x>0))return result;
 const nearExact=inliers>=25&&ratio>=.7&&cover>=.2&&sig.correlation>.975&&sig.texture>12;
 const score=Math.min(100,Math.log2(1+inliers)*9+ratio*18+cover*22+(nearExact?18:0));
 return {...result,inliers,ratio,coverage:cover,score,nearExact};
 }finally{for(const x of [da,db,bf,forward,reverse,ps,pt,H,mask])if(x)x.delete()}
}
function qualifies(r,m){return r.nearExact||r.inliers>=m.n&&r.ratio>=m.ratio&&r.coverage>=m.coverage}
function decide(ranks,mode='balanced'){
 const m=MODES[mode]||MODES.balanced;const eligible=ranks.filter(r=>qualifies(r,m)).sort((a,b)=>b.score-a.score);let best=eligible[0];
 if(!best){let possible=ranks.find(r=>r.inliers>=8&&r.ratio>=.25&&r.coverage>=.035);return {status:possible?'review':'missing',index:null,reason:possible?'Some shared details; please check the suggested photos.':'No geometrically verified match found.'}}
 const rival=ranks.find(r=>r.index!==best.index&&r.inliers>=10&&r.ratio>=.3&&r.coverage>=.04);
 if(rival&&best.score-rival.score<m.margin&&!(best.nearExact&&!rival.nearExact))return {status:'review',index:null,reason:'Two uploads share strong matching details. Choose the correct photo.'};
 return {status:'matched',index:best.index,reason:best.nearExact?'Near-identical photo with verified matching details.':`${best.inliers} aligned details across both photos.`};
}
root.RobustMatcher={MODES,extract,compare,decide,qualifies};if(typeof module!=='undefined')module.exports=root.RobustMatcher;
})(typeof self!=='undefined'?self:globalThis);
