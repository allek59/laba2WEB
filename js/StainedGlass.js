import * as THREE from 'three';

// Seeded, entirely procedural leaded-glass rosettes and geometric panes.
const palettes=[['#527787','#81728e','#b6a17e','#71938f'],['#956f78','#b69b83','#c2b495','#777b91'],['#658d82','#a1b6a2','#a99db2','#68818f'],['#837c9a','#b48e9e','#c1aa87','#718d9b']];
function makeTexture(variant){
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=384;
 const c=canvas.getContext('2d'),colors=palettes[variant%palettes.length];
 c.fillStyle='#142b33';c.fillRect(0,0,256,384);
 // Irregular diamond lattice, with thick dark leading and thin brass glints.
 for(let row=-1;row<9;row++)for(let col=-2;col<6;col++){
  const x=col*64+(row%2)*32,y=row*56;
  c.beginPath();c.moveTo(x,y-40);c.lineTo(x+34,y);c.lineTo(x,y+40);c.lineTo(x-34,y);c.closePath();
  c.fillStyle=colors[(row*3+col*7+1000)%colors.length];c.fill();c.lineWidth=7;c.strokeStyle='#1a252b';c.stroke();
  c.lineWidth=1.4;c.strokeStyle='rgba(231,189,103,.65)';c.stroke();
  c.beginPath();c.moveTo(x-8,y-12);c.lineTo(x,y-25);c.lineTo(x+7,y-10);c.strokeStyle='rgba(255,250,222,.27)';c.lineWidth=3;c.stroke();
 }
 // Subtle handmade glass variation: fine bubbles, irregular translucency and patina.
 let seed=variant*7919+17;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<2200;i++){const x=rnd()*256,y=rnd()*384,r=.3+rnd()*2.4;c.beginPath();c.ellipse(x,y,r,r*(.4+rnd()),rnd()*3.14,0,Math.PI*2);c.fillStyle=rnd()>.45?'rgba(255,242,208,.10)':'rgba(14,20,24,.12)';c.fill();}
 for(let i=0;i<11;i++){const x=12+i*23;c.beginPath();c.moveTo(x,0);c.bezierCurveTo(x+7,130,x-10,230,x+3,384);c.strokeStyle='rgba(255,235,196,.08)';c.lineWidth=1.5;c.stroke();}
 // Rose window: radial petals and a bright jewel centre.
 c.save();c.translate(128,198);c.fillStyle='#172a2e';c.beginPath();c.arc(0,0,83,0,Math.PI*2);c.fill();
 for(let i=0;i<12;i++){c.save();c.rotate(i*Math.PI/6);c.beginPath();c.moveTo(0,-14);c.bezierCurveTo(-28,-36,-25,-75,0,-79);c.bezierCurveTo(25,-75,28,-36,0,-14);c.fillStyle=colors[(i+variant)%4];c.fill();c.lineWidth=5;c.strokeStyle='#20292a';c.stroke();c.restore();}
 c.beginPath();c.arc(0,0,21,0,Math.PI*2);c.fillStyle='#f1db9d';c.fill();c.lineWidth=6;c.strokeStyle='#20292a';c.stroke();c.restore();
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
}
export class StainedGlass{
 constructor(scene){this.scene=scene;this.pools=[];this.clock=0;this.textures=palettes.map((_,i)=>makeTexture(i));this.create();}
 create(){
  // Inset slightly towards the interior of the existing perimeter windows.
  for(let side=0;side<4;side++)for(let i=0;i<5;i++){
   const variant=(i+side*2)%4;
   const material=new THREE.MeshBasicMaterial({map:this.textures[variant],transparent:true,opacity:.77,side:THREE.DoubleSide,depthWrite:false});
   const pane=new THREE.Mesh(new THREE.PlaneGeometry(3.18,4.72),material);
   const along=-8+i*4;
   if(side<2){pane.position.set(along,2.85,side===0?-9.57:9.57);}else{pane.position.set(side===2?-9.57:9.57,2.85,along);pane.rotation.y=Math.PI/2;}
   this.scene.add(pane);
  }
  // Diffuse coloured patches on the floor, not real-time shadow projection.
  // This deliberately avoids costly coloured shadow maps.
  const colors=['#7d9aa6','#b894a1','#9caf9b','#c4ae87'];
  const geometry=new THREE.PlaneGeometry(2.5,3.6);
  for(let side=0;side<4;side++)for(let i=0;i<4;i++){
   const mat=new THREE.MeshBasicMaterial({color:colors[(side+i)%4],transparent:true,opacity:.055,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
   const patch=new THREE.Mesh(geometry,mat);patch.rotation.x=-Math.PI/2;
   const t=-6+i*4;
   if(side===0)patch.position.set(t,.077,-6.8);
   if(side===1)patch.position.set(t,.079,6.8);
   if(side===2){patch.position.set(-6.8,.081,t);patch.rotation.z=Math.PI/2;}
   if(side===3){patch.position.set(6.8,.083,t);patch.rotation.z=Math.PI/2;}
   this.scene.add(patch);this.pools.push({mesh:patch,phase:side*1.6+i*.83});
  }
  // Decorative jewel lanterns create localized coloured accents.
  for(const [x,z,color] of [[-6,-6,0x8ac9e8],[6,-6,0xb487ed],[-6,6,0xe7a46b],[6,6,0x75c5a6]]){
   const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.22),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.7,metalness:.1,roughness:.25}));gem.position.set(x,4.15,z);this.scene.add(gem);
  }
 }
 update(dt){this.clock+=dt;for(const {mesh,phase} of this.pools){mesh.material.opacity=.085+.028*Math.sin(this.clock*.45+phase);}}
}
