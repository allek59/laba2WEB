import * as THREE from 'three';

// Procedural, individually textured cats; no external texture files are required.
const COATS={
 catWhite:{base:'#eee9dc',patch:'#d9d5ca',type:'solid',eyes:0x83a5b1},
 catBlack:{base:'#24262b',patch:'#3e4148',type:'solid',eyes:0xd6b765},
 catGinger:{base:'#c67c3c',patch:'#8f4b27',type:'tabby',eyes:0x9fc078},
 catTabby:{base:'#96938b',patch:'#45494a',type:'tabby',eyes:0xc5bb75},
 catCalico:{base:'#f0e6d5',patch:'#a95832',type:'calico',eyes:0x9dbb7b}
};
function furTexture(coat){
 const c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');g.fillStyle=coat.base;g.fillRect(0,0,256,256);
 let seed=1973;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 if(coat.type==='tabby'){
  g.strokeStyle=coat.patch;g.lineWidth=13;g.lineCap='round';
  for(let i=-4;i<16;i++){const x=i*25;g.beginPath();g.moveTo(x,-8);g.bezierCurveTo(x+33,58,x-32,119,x+24,181);g.bezierCurveTo(x+40,217,x+6,245,x+25,270);g.stroke();}
 }else if(coat.type==='calico'){
  for(let i=0;i<21;i++){const x=random()*256,y=random()*256,r=13+random()*39;g.fillStyle=i%3===0?'#303039':coat.patch;g.beginPath();g.ellipse(x,y,r,r*(.6+random()),random()*Math.PI,0,Math.PI*2);g.fill();}
 }else{
  g.fillStyle=coat.patch;g.globalAlpha=.13;for(let i=0;i<80;i++){g.beginPath();g.ellipse(random()*256,random()*256,2+random()*14,1+random()*6,random()*6,0,Math.PI*2);g.fill();}g.globalAlpha=1;
 }
 for(let i=0;i<3500;i++){g.strokeStyle=random()>.5?'rgba(255,255,255,.085)':'rgba(25,19,16,.06)';g.lineWidth=.6;const x=random()*256,y=random()*256;g.beginPath();g.moveTo(x,y);g.lineTo(x+random()*5-2,y+random()*6-3);g.stroke();}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
function makeCat(coatId){
 const coat=COATS[coatId],root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const fur=new THREE.MeshStandardMaterial({map:furTexture(coat),roughness:.92});
 const base=new THREE.MeshStandardMaterial({color:coat.base,roughness:.9});
 const cream=new THREE.MeshStandardMaterial({color:coatId==='catBlack'?0x42444b:0xf4ede1,roughness:.92});
 const pink=new THREE.MeshStandardMaterial({color:coatId==='catBlack'?0x966b7b:0xe5a1a8,roughness:.8});
 const iris=new THREE.MeshStandardMaterial({color:coat.eyes,roughness:.27});
 const black=new THREE.MeshStandardMaterial({color:0x14171a,roughness:.22});
 const shine=new THREE.MeshBasicMaterial({color:0xffffff});
 const whisker=new THREE.MeshStandardMaterial({color:coatId==='catBlack'?0xa8a6a6:0x796965,roughness:1});
 const oval=(parent,x,y,z,rx,ry,rz,material=fur)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),material);m.position.set(x,y,z);m.scale.set(rx,ry,rz);parent.add(m);return m;};
 const tube=(parent,pts,r,material)=>{const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(q=>new THREE.Vector3(...q))),24,r,8,false),material);parent.add(mesh);return mesh;};
 // Distinctly feline silhouette: long horizontal torso, raised shoulders, haunches.
 oval(body,0,.57,-.13,.33,.31,.44);
 oval(body,0,.61,-.37,.33,.31,.28);
 oval(body,0,.64,.17,.31,.34,.30);
 oval(body,0,.49,.31,.22,.27,.19,cream);
 // Head and its unmistakable cheek/jowl silhouette.
 const head=new THREE.Group();head.position.set(0,1.00,.39);body.add(head);
 oval(head,0,0,0,.355,.325,.30,base);
 oval(head,-.275,-.12,.10,.14,.155,.16,base);
 oval(head,.275,-.12,.10,.14,.155,.16,base);
 // Pointed cat ears: tapered triangular extrusions with smaller pink inserts.
 function ear(side){
  // Crisp triangular ear silhouette (not a rounded or squared extrusion).
  const shape=new THREE.Shape();
  shape.moveTo(-.125,-.055);shape.lineTo(0,.305);shape.lineTo(.125,-.055);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:false,steps:1});
  const outer=new THREE.Mesh(geo,base);
  outer.position.set(side*.235,.215,-.025);outer.rotation.z=-side*.13;head.add(outer);
  const innerShape=new THREE.Shape();innerShape.moveTo(-.077,-.025);innerShape.lineTo(0,.195);innerShape.lineTo(.077,-.025);innerShape.closePath();
  const inner=new THREE.Mesh(new THREE.ShapeGeometry(innerShape),pink);
  inner.position.set(side*.235,.225,.037);inner.rotation.z=-side*.13;head.add(inner);
 }
 ear(-1);ear(1);
 // Almond eye sockets with large forward-facing green/amber/blue irises.
 for(const side of [-1,1]){
  oval(head,side*.158,.028,.266,.128,.114,.041,cream);
  oval(head,side*.158,.028,.301,.100,.097,.023,iris);
  oval(head,side*.158,.028,.320,.039,.087,.014,black);
  oval(head,side*.128,.068,.333,.026,.029,.009,shine);
  oval(head,side*.184,.002,.332,.011,.012,.007,shine);
  // Distinctive short muzzle, white whisker pads and freckle spots.
  oval(head,side*.085,-.178,.283,.137,.092,.105,cream);
  for(let k=0;k<3;k++)oval(head,side*(.095+.03*k),-.15-(k%2)*.03,.374,.005,.005,.004,whisker);
  for(let k=-1;k<=1;k++)tube(head,[[side*.16,-.17+k*.02,.345],[side*.32,-.15+k*.055,.35],[side*.52,-.15+k*.08,.31]],.0025,whisker);
 }
 // Small triangular nose and subtle feline smile: no split lower muzzle or tooth-like divider.
 const noseShape=new THREE.Shape();noseShape.moveTo(-.052,-.143);noseShape.lineTo(.052,-.143);noseShape.quadraticCurveTo(0,-.218,-.008,-.209);noseShape.closePath();
 const nose=new THREE.Mesh(new THREE.ShapeGeometry(noseShape),pink);nose.position.z=.391;head.add(nose);
 tube(head,[[-.047,-.242,.375],[0,-.255,.385],[.047,-.242,.375]],.0026,whisker);
 // Actual articulated legs attached below torso, with paws pointing forward.
 const legs=[];
 for(const side of [-1,1])for(const front of [false,true]){
  const z=front?.24:-.38;
  const pivot=new THREE.Group();pivot.position.set(side*.235,.53,z);body.add(pivot);
  pivot.userData={isLeg:true,phase:(side===1?0:Math.PI)+(front?0:Math.PI),front};
  // Smooth tapered feline legs with a single rounded paw, no separate toes.
  oval(pivot,0,-.19,0,.088,.24,.086,fur);
  oval(pivot,0,-.39,.06,.103,.11,.10,fur);
  oval(pivot,0,-.44,.115,.118,.063,.145,base);
  legs.push(pivot);
 }
 // Long thick cat tail, rising and curling forward with a rounded tip.
 const tail=new THREE.Group();tail.position.set(0,.68,-.55);body.add(tail);
 tube(tail,[[0,0,0],[.08,.15,-.17],[.16,.45,-.25],[.22,.72,-.15],[.19,.80,.02]],.066,fur);
 oval(tail,.19,.80,.02,.075,.079,.078,base);
 // Coat-specific facial markings ensure five recognisably different cats.
 if(coatId==='catCalico'){
  const orange=new THREE.MeshStandardMaterial({color:0xb76a38,roughness:.94}),dark=new THREE.MeshStandardMaterial({color:0x303036,roughness:.94});
  oval(head,-.235,.115,.205,.12,.12,.06,orange);oval(head,.245,.14,.18,.11,.14,.055,dark);
 }else if(coatId==='catTabby'||coatId==='catGinger'){
  const stripe=new THREE.MeshStandardMaterial({color:coat.patch,roughness:.94});
  for(let k=-1;k<=1;k++){const mark=oval(head,k*.083,.218-Math.abs(k)*.027,.236,.021,.07,.012,stripe);mark.rotation.z=k*.16;}
  for(const side of [-1,1]){const mark=oval(head,side*.296,-.10,.22,.025,.09,.012,stripe);mark.rotation.z=side*.5;}
 }
 root.userData={body,head,tail,legs};return root;
}
export class GardenCat{
 constructor(scene){this.scene=scene;this.cats=[];this.elapsed=0;}
 reset(){for(const cat of this.cats)this.scene.remove(cat.root);this.cats=[];this.elapsed=0;}
 adopt(id='catGinger'){if(!COATS[id]||this.cats.some(c=>c.id===id))return false;const root=makeCat(id);root.scale.setScalar(.5);const index=this.cats.length;root.position.set(3.3+index*.5,0,2.5+index*.5);this.scene.add(root);const cat={id,root,goal:new THREE.Vector3(),mode:'walk',timer:0,elapsed:Math.random()*9};this.cats.push(cat);this.pickGoal(cat);return true;}
 pickGoal(cat){const spots=[[3,3],[6,2],[7,5],[4,5],[2,-2],[5,-1],[2,7],[7,7]];const [x,z]=spots[Math.floor(Math.random()*spots.length)];cat.goal.set(x,0,z);}
 update(dt){for(const cat of this.cats){cat.elapsed+=dt;cat.timer-=dt;const {root}=cat;const {body,tail,legs}=root.userData;
  if(cat.mode==='walk'){const delta=cat.goal.clone().sub(root.position);if(delta.length()<.23||cat.timer< -12){cat.mode='sleep';cat.timer=4+Math.random()*8;}else{const target=Math.atan2(delta.x,delta.z);root.rotation.y+=Math.atan2(Math.sin(target-root.rotation.y),Math.cos(target-root.rotation.y))*Math.min(1,dt*5);root.position.addScaledVector(delta.normalize(),dt*.48);body.position.y=Math.sin(cat.elapsed*12)*.013;legs.forEach(l=>{const step=Math.sin(cat.elapsed*11+l.userData.phase);l.rotation.x=step*.43;l.position.y=.53+Math.max(0,step)*.035;});}}
  else{body.position.y=0;legs.forEach(l=>{l.rotation.x+=(0-l.rotation.x)*Math.min(1,dt*7);l.position.y+=(.53-l.position.y)*Math.min(1,dt*7);});if(cat.timer<=0){cat.mode='walk';cat.timer=12;this.pickGoal(cat);}}
  const sleeping=cat.mode==='sleep';body.scale.y+=( (sleeping?.73:1)-body.scale.y)*Math.min(1,dt*3);body.rotation.z+=( (sleeping?.12:0)-body.rotation.z)*Math.min(1,dt*2);tail.rotation.z=Math.sin(cat.elapsed*(sleeping?.7:2.2))*.18;
 }}
}
