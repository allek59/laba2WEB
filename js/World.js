import {GardenDecor} from './GardenDecor.js';
import {Atmosphere} from './Atmosphere.js';
import {StainedGlass} from './StainedGlass.js';
import {Greenhouse} from './Greenhouse.js';
import * as THREE from 'three';import{CONFIG}from './config.js';import{Collision}from './Collision.js';
export class World{
 constructor(mount){this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#101c36');this.scene.fog=new THREE.FogExp2('#172337',.009);this.camera=new THREE.PerspectiveCamera(72,1,.1,80);this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,CONFIG.maxDpr));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;mount.appendChild(this.renderer.domElement);this.collision=new Collision(CONFIG.size,CONFIG.playerRadius);this.build();this.greenhouse=new Greenhouse(this.scene,this.collision);this.atmosphere=new Atmosphere(this.scene);this.stainedGlass=new StainedGlass(this.scene);this.decor=new GardenDecor(this.scene,this.greenhouse);this.resize();window.addEventListener('resize',()=>this.resize());}
 material(color,roughness=1){return new THREE.MeshStandardMaterial({color,roughness});}
 mesh(geo,mat,x,y,z,shadow=true){const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;this.scene.add(o);return o;}
 build(){const stone=this.material('#c4a184'),wall=this.material('#94735a'),wood=this.material('#50392b'),brass=new THREE.MeshStandardMaterial({color:'#b08a4a',metalness:.65,roughness:.35});
 this.scene.add(new THREE.HemisphereLight('#f7d9ae','#65503d',1.65));const moon=new THREE.DirectionalLight('#e8c9a7',1.15);moon.position.set(-5,13,-7);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-13;moon.shadow.camera.right=13;moon.shadow.camera.top=13;moon.shadow.camera.bottom=-13;this.scene.add(moon);
 this.mesh(new THREE.PlaneGeometry(20,20),stone,0,0,0,false).rotation.x=-Math.PI/2;

 for(const [x,z,w,d]of [[0,-10,20,.5],[0,10,20,.5],[-10,0,.5,20],[10,0,.5,20]])this.mesh(new THREE.BoxGeometry(w,.85,d),wall,x,.425,z);
 for(let i=-8;i<=8;i+=4){for(const z of [-9.65,9.65]){this.mesh(new THREE.CylinderGeometry(.19,.24,5.7,8),brass,i,2.85,z);this.mesh(new THREE.SphereGeometry(.26,10,8),brass,i,5.75,z);}for(const x of [-9.65,9.65])this.mesh(new THREE.CylinderGeometry(.19,.24,5.7,8),brass,x,2.85,i);}
 const glow=new THREE.PointLight('#708da4',2.2,8);glow.position.set(0,3,0);this.scene.add(glow);const heart=this.mesh(new THREE.OctahedronGeometry(.48),new THREE.MeshStandardMaterial({color:'#667f92',emissive:'#233849',emissiveIntensity:.6,metalness:.2}),0,3,0);this.heartVisual={heart,glow};
 }
 awakenHeart(){const {heart,glow}=this.heartVisual;heart.material.color.set('#f8ce84');heart.material.emissive.set('#f5a44d');heart.material.emissiveIntensity=2.8;glow.color.set('#ffd18d');glow.intensity=7.5;this.scene.fog.color.set('#192c35');}
 resetHeart(){const {heart,glow}=this.heartVisual;heart.material.color.set('#667f92');heart.material.emissive.set('#233849');heart.material.emissiveIntensity=.6;glow.color.set('#708da4');glow.intensity=2.2;this.scene.fog.color.set('#172337');}
 resize(){const w=window.innerWidth,h=window.innerHeight;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);}
 update(dt){this.atmosphere.update(dt);this.stainedGlass.update(dt);this.decor.update(dt);}
 render(){this.renderer.render(this.scene,this.camera);}
}
