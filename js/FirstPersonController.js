import * as THREE from 'three';import{CONFIG}from './config.js';
export class FirstPersonController{
 constructor(camera,input,collision){this.camera=camera;this.input=input;this.collision=collision;this.velocity=new THREE.Vector2();this.yaw=0;this.pitch=0;this.walkTime=0;this.reset();}
 reset(){this.camera.position.set(0,CONFIG.eyeHeight,7.5);this.yaw=0;this.pitch=0;this.velocity.set(0,0);this.walkTime=0;this.camera.rotation.order='YXZ';this.camera.rotation.set(0,0,0);}
 update(dt){const m=this.input.consumeMouse();this.yaw-=m.x*CONFIG.mouseSensitivity;this.pitch=THREE.MathUtils.clamp(this.pitch-m.y*CONFIG.mouseSensitivity,-Math.PI*.47,Math.PI*.47);this.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');
 const x=Number(this.input.keys.has('KeyD'))-Number(this.input.keys.has('KeyA'));const z=Number(this.input.keys.has('KeyS'))-Number(this.input.keys.has('KeyW'));const mag=Math.hypot(x,z)||1;const tx=x/mag*CONFIG.speed,tz=z/mag*CONFIG.speed;const blend=1-Math.exp(-CONFIG.acceleration*dt);this.velocity.x+=(tx-this.velocity.x)*blend;this.velocity.y+=(tz-this.velocity.y)*blend;
 const sin=Math.sin(this.yaw),cos=Math.cos(this.yaw);const dx=(this.velocity.x*cos+this.velocity.y*sin)*dt,dz=(-this.velocity.x*sin+this.velocity.y*cos)*dt;this.collision.move(this.camera.position,dx,dz);const moving=Math.hypot(this.velocity.x,this.velocity.y);this.walkTime+=moving*dt;this.camera.position.y=CONFIG.eyeHeight+(moving>.2?Math.sin(this.walkTime*2.4)*.018:0);
 }
}
