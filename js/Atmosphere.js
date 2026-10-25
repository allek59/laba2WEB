import * as THREE from 'three';
export class Atmosphere{
 constructor(scene){this.time=0;this.scene=scene;this.lights=[];
 const positions=[[-8,4.6,-8],[8,4.6,-8],[-8,4.6,8],[8,4.6,8]];
 for(const [x,y,z] of positions){const l=new THREE.PointLight(0xe9aa64,1.6,5,2);l.position.set(x,y,z);scene.add(l);this.lights.push(l);}
 const count=850,geo=new THREE.BufferGeometry(),a=new Float32Array(count*3);this.seed=[];
 for(let i=0;i<count;i++){const x=Math.sin(i*127.1)*43758.5453,z=Math.sin(i*39.7)*13458.12;this.seed.push([((x%1)+1)%1,((z%1)+1)%1]);a[i*3]=(this.seed[i][0]-.5)*18;a[i*3+1]=.5+((i*17)%83)/12;a[i*3+2]=(this.seed[i][1]-.5)*18;}
 geo.setAttribute('position',new THREE.BufferAttribute(a,3));this.particles=new THREE.Points(geo,new THREE.PointsMaterial({color:0xf4a948,size:.036,transparent:true,opacity:.66,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(this.particles);
 const circle=new THREE.Mesh(new THREE.RingGeometry(2.7,2.74,96),new THREE.MeshBasicMaterial({color:0xb08a4a,transparent:true,opacity:.26,side:THREE.DoubleSide}));circle.rotation.x=-Math.PI/2;circle.position.y=.045;scene.add(circle);this.ring=circle;
 }
 update(dt){this.time+=dt;for(let i=0;i<this.lights.length;i++)this.lights[i].intensity=1.5+.18*Math.sin(this.time*1.7+i*2.1);const a=this.particles.geometry.attributes.position;for(let i=0;i<a.count;i++){a.array[i*3]+=Math.sin(this.time*.6+i)*dt*.045;a.array[i*3+1]+=.055*dt;if(a.array[i*3+1]>7.9)a.array[i*3+1]=.5;}a.needsUpdate=true;this.ring.material.opacity=.22+.1*Math.sin(this.time*.75);}
}
