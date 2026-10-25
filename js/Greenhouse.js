import * as THREE from 'three';
import {ProceduralModels} from './ProceduralModels.js';
export class Greenhouse {
 constructor(scene,collision){this.scene=scene;this.collision=collision;this.p=new ProceduralModels();this.animated=[];this.interactables=[];this.build();}
 add(g,x,y,z,rotation=0){g.position.set(x,y,z);g.rotation.y=rotation;this.scene.add(g);return g;}
 obstacle(g,x,z,w,d,rotation=0){this.add(g,x,0,z,rotation);this.collision.add(x,z,w,d);}
 beam(a,b,r,mat){const v=new THREE.Vector3().subVectors(b,a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),8),mat);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());o.castShadow=true;this.scene.add(o);return o;}
 build(){const p=this.p,m=p.m;
 // Uneven stone floor with individually shaded slabs and brass inlays.
 const slab=new THREE.BoxGeometry(.96,.10,.96),dummy=new THREE.Object3D();
 for(let variant=0;variant<3;variant++){
  const positions=[];for(let ix=0;ix<20;ix++)for(let iz=0;iz<20;iz++){const i=ix*20+iz;if((i*17+i*i)%3===variant)positions.push([ix-9.5,iz-9.5]);}
  const mesh=new THREE.InstancedMesh(slab,[m.stone,m.stoneLight,m.stoneDark][variant],positions.length);
  positions.forEach(([x,z],i)=>{dummy.position.set(x,-.035,z);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;this.scene.add(mesh);
 }
 // Aged brass floor seams form a navigational compass around the central heart.
 const compass=new THREE.Mesh(new THREE.TorusGeometry(2.65,.018,5,96),m.brass);compass.rotation.x=Math.PI/2;compass.position.y=.035;this.scene.add(compass);

 for(const z of [-9.72,9.72])for(let x=-8;x<=8;x+=4){this.add(p.window(3.75,5.5),x,0,z);this.add(p.column(6),x-2,0,z);}for(const x of [-9.72,9.72])for(let z=-8;z<=8;z+=4){this.add(p.window(3.75,5.5),x,0,z,Math.PI/2);this.add(p.column(6),x,0,z-2);}
 // A true pitched glazed roof: iron ribs, panes, ridge crest, hanging tracery.
 for(let x=-10;x<=10;x+=2){this.beam(new THREE.Vector3(x,5.7,-9.7),new THREE.Vector3(x,9.7,0),.075,m.iron);this.beam(new THREE.Vector3(x,9.7,0),new THREE.Vector3(x,5.7,9.7),.075,m.iron);if(x%4===0){this.beam(new THREE.Vector3(x,5.7,-9.7),new THREE.Vector3(x,5.7,9.7),.055,m.brass);}}
 for(const z of [-9.7,-7.25,-4.85,-2.42,0,2.42,4.85,7.25,9.7])this.beam(new THREE.Vector3(-10,5.7+4*(1-Math.abs(z)/9.7),z),new THREE.Vector3(10,5.7+4*(1-Math.abs(z)/9.7),z),.048,m.iron);
 for(const side of [-1,1]){const roof=new THREE.Mesh(new THREE.PlaneGeometry(20,10.5),m.glass);roof.position.set(0,7.7,side*4.85);roof.rotation.x=-side*.391;roof.receiveShadow=false;this.scene.add(roof);}this.beam(new THREE.Vector3(-10,9.78,0),new THREE.Vector3(10,9.78,0),.15,m.brass);
 for(let x=-9;x<=9;x+=3){this.add(p.gothicTruss(),x,5.6,0);}
 for(const [x,z] of [[-8,-8],[8,-8],[-8,8],[8,8],[0,-7],[0,7]]){const lantern=this.add(p.lantern(),x,4.65,z);this.beam(new THREE.Vector3(x,5.7,z),new THREE.Vector3(x,5.3,z),.026,m.brass);}
 // Entrance and botanist's study.
 this.add(p.door(),0,0,9.65,Math.PI);this.obstacle(p.shelf(),-7.4,7.3,2.3,.85);this.obstacle(p.shelf(),-9.05,5.1,.85,2.3,Math.PI/2);this.obstacle(p.table(),-4.3,7,2.6,1.2);this.add(p.chair(),-6.1,0,5.35,Math.PI); // chair moved away from journal approachconst book=this.add(p.openBook(),-4.4,1.27,7);this.interactables.push({id:"journal",name:"Прочитать дневник",object:book});this.add(p.candles(),-3.45,1.27,7.15);for(let i=0;i<5;i++)this.add(p.bottle(i%2?0x9d77ce:0x8ac9e8),-5.2+i*.38,1.26,7.36);
 // Water workshop, reservoir, pressure gauge, copper distribution network.
 const tank=this.add(p.waterTank(),-7,0,0);this.collision.add(-7,0,2.1,2.1);for(let i=0;i<3;i++){const valve=this.add(p.valve(),-7.8+i*.8,1.9,1.18);this.interactables.push({id:`valve${i}`,name:`Повернуть вентиль ${i+1}`,object:valve});}this.add(p.gauge(),-7,2.1,-.95);for(const [a,b]of [[[ -7,2.4,0],[-7,3.2,0]],[[-7,3.2,0],[-3,3.2,0]],[[-3,3.2,0],[-3,1.2,-3]]])this.beam(new THREE.Vector3(...a),new THREE.Vector3(...b),.075,m.copper);
 this.add(p.workbench(),-7.4,0,-3.3);this.collision.add(-7.4,-3.3,2.5,1.1);
 // Moon garden with raised planting beds and illuminated specimens.
 for(let i=0;i<5;i++){const x=-6.5+i*1.4;this.add(p.pot(),x,0,-6.3);this.add(p.flower(i%2?0x8ac9e8:0x9d77ce),x,.56,-6.3);}for(const x of [-7.8,-2.3])this.add(p.pedestal(),x,0,-7.8);
 // Mirror gallery: carved mirror frames and a magical focusing lens.
 for(let i=0;i<3;i++){this.add(p.mirror(),4.8+i*1.4,0,-4.4,.35+i*.35);this.collision.add(4.8+i*1.4,-4.4,.65,.65);}this.add(p.pedestal(),7.8,0,-7.5);this.add(p.crystal(),7.8,1.15,-7.5);
 // Central altar and radial runic ornaments.
 this.add(p.altar(),0,0,0);this.collision.add(0,0,2.2,2.2);this.add(p.crystal(),0,1.05,0);for(let i=0;i<12;i++){const a=i*Math.PI/6,marker=new THREE.Mesh(new THREE.BoxGeometry(.38,.018,.055),m.brass);marker.position.set(Math.cos(a)*2.05,.038,Math.sin(a)*2.05);marker.rotation.y=-a;this.scene.add(marker);}
 // Lived-in details: carpets, carved runners, book piles, terracotta seedlings and brass plaques.
 const rugMat=new THREE.MeshStandardMaterial({color:'#704335',roughness:.97}),trimMat=new THREE.MeshStandardMaterial({color:'#c6a36c',metalness:.35,roughness:.68});
 for(const [x,z,w,d] of [[-4.3,5.7,3.5,2.2],[5.4,5.1,3.1,1.8],[0,4.7,2.1,3.4]]){
  const rug=new THREE.Mesh(new THREE.BoxGeometry(w,.018,d),rugMat);rug.position.set(x,.064,z);this.scene.add(rug);
  for(const side of [-1,1]){const edge=new THREE.Mesh(new THREE.BoxGeometry(w,.021,.025),trimMat);edge.position.set(x,.081,z+side*(d/2-.12));this.scene.add(edge);}
 }
 const bookColors=['#4b654e','#804c3b','#705b83','#a07845'];
 for(const [x,y,z] of [[-5.05,1.29,6.9],[-3.85,1.29,7.36],[4.5,1.28,7.2]])for(let i=0;i<4;i++){
  const book=new THREE.Mesh(new THREE.BoxGeometry(.32,.065,.46),new THREE.MeshStandardMaterial({color:bookColors[i],roughness:.9}));book.position.set(x+i*.025,y+i*.07,z);book.rotation.y=i*.18;this.scene.add(book);
 }
 for(const [x,z] of [[-6.5,3.7],[-5.2,3.8],[6.5,3.4],[4.2,-7.4],[-2.5,6.1]]){
  this.add(p.pot(),x,0,z);const plant=this.add(p.flower(0xe3ac72),x,.55,z);plant.scale.setScalar(.62);
 }
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.cos(a)*3.2,z=Math.sin(a)*3.2;const foot=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,.17,8),m.brass);foot.position.set(x,.12,z);this.scene.add(foot);}
 // Display cabinets, plants, hanging foliage, small atmospheric details.
 this.obstacle(p.shelf(),7.5,7.5,2.3,.85);this.add(p.table(),5,0,7);this.collision.add(5,7,2.6,1.2);for(let i=0;i<7;i++)this.add(p.bottle([0x8ac9e8,0x9d77ce,0xe9a74d][i%3]),4+i*.32,1.26,7);
 for(const [x,z] of [[-8,-3],[-8,4],[8,3],[8,7],[-2,-8],[2,8],[3,-8],[-5,9]])this.add(p.vine(2.8),x,5.5,z);
 for(const [i,[x,z]] of [[-8.5,-7.5],[-4.5,-8.4],[8.5,1.5],[8.5,5.2],[-2.6,4.1],[2.8,4.2]].entries()){this.add(p.pot(),x,0,z);if(i%3===0)this.add(p.flower(0x9d77ce),x,.55,z);else this.add(i%3===1?p.fern():p.bamboo(),x,.54,z);}
 }
}
