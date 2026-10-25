import * as THREE from 'three';
export class GardenDecor{
 constructor(scene,greenhouse){this.scene=scene;this.group=new THREE.Group();scene.add(this.group);this.make(greenhouse);}
 make(gh){const leafM=[0x345f3d,0x547e49,0x779a5d,0x365945].map(color=>new THREE.MeshStandardMaterial({color,side:THREE.DoubleSide,roughness:.96}));const vineM=new THREE.MeshStandardMaterial({color:0x4b6537,roughness:1});const leafGeo=new THREE.SphereGeometry(1,5,4);const curvePoints=(a,b,sag,phase)=>{const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push(new THREE.Vector3(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t-sag*Math.sin(Math.PI*t)+.09*Math.sin(t*15+phase),a.z+(b.z-a.z)*t));}return pts;};
 let count=0;const strand=(a,b,sag,seed)=>{const pts=curvePoints(a,b,sag,seed),curve=new THREE.CatmullRomCurve3(pts);const stem=new THREE.Mesh(new THREE.TubeGeometry(curve,24,.017,4,false),vineM);this.group.add(stem);for(let j=1;j<17;j++){const t=j/18,p=curve.getPoint(t),leaf=new THREE.Mesh(leafGeo,leafM[(j+seed)%leafM.length]);leaf.position.copy(p);leaf.position.x+=(j%2?.16:-.16);leaf.rotation.set(.3+j*.18,seed+j,Math.PI/4);leaf.scale.set(.075,.17,.035);this.group.add(leaf);count++;}};
 for(let x=-9;x<=9;x+=2.2){for(const z of [-8.7,8.7]){strand(new THREE.Vector3(x,5.7,z),new THREE.Vector3(x+.6,4.4,z+.25),.25,Math.floor(x+12));strand(new THREE.Vector3(x,6.5,z),new THREE.Vector3(x+1.8,6.35,z),.4,Math.floor(x+18));}}
 for(let x=-8;x<=8;x+=2){for(const z of [-4.8,0,4.8])strand(new THREE.Vector3(x,8.2-Math.abs(z)*.38,z),new THREE.Vector3(x+.95,7.35-Math.abs(z)*.32,z+.5),.75,Math.floor(x+z+50));}
 for(let z=-8;z<=8;z+=2.4){for(const x of [-9,9])strand(new THREE.Vector3(x,5.6,z),new THREE.Vector3(x,3.7,z+.3),.22,Math.floor(z+15));}
 // Warm specks floating below the ceiling, bounded mesh count.
 const dustGeo=new THREE.BufferGeometry(),positions=new Float32Array(1650*3);for(let i=0;i<1650;i++){positions[i*3]=(Math.random()-.5)*19;positions[i*3+1]=.5+Math.random()*8.6;positions[i*3+2]=(Math.random()-.5)*19;}dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));this.dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xf5a849,size:.044,transparent:true,opacity:.62,depthWrite:false}));this.group.add(this.dust);
 // Starfield high above the roof; points remain visible through translucent panes.
 const starGeo=new THREE.BufferGeometry(),stars=new Float32Array(1250*3);for(let i=0;i<1250;i++){stars[i*3]=(Math.random()-.5)*95;stars[i*3+1]=16+Math.random()*29;stars[i*3+2]=(Math.random()-.5)*95;}starGeo.setAttribute('position',new THREE.BufferAttribute(stars,3));this.stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xc9dcff,size:.12,sizeAttenuation:true,transparent:true,opacity:.9,depthWrite:false}));this.group.add(this.stars);
 }
 update(dt){this.dust.rotation.y+=dt*.002;this.stars.rotation.y+=dt*.00045;}
}
