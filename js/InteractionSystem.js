import * as THREE from 'three';
export class InteractionSystem {
 constructor(camera,collision,items){this.camera=camera;this.collision=collision;this.items=items;this.ray=new THREE.Raycaster();this.ray.far=3;this.center=new THREE.Vector2(0,0);this.temp=new THREE.Vector3();}
 visible(item){item.object.getWorldPosition(this.temp);const start=this.camera.position;const delta=this.temp.clone().sub(start);const distance=delta.length();if(distance>3.1)return false;
 // Sample the horizontal segment against the same collision geometry used by movement.
 // Ignore the final 0.8m around the target so an object mounted on a machine stays reachable.
 const steps=Math.max(1,Math.ceil(Math.max(0,distance-.8)/.12));for(let i=1;i<steps;i++){const t=(i/steps)*Math.max(0,(distance-.8)/distance);const x=start.x+delta.x*t,z=start.z+delta.z*t;for(const b of this.collision.boxes){if(x>b.minX+.04&&x<b.maxX-.04&&z>b.minZ+.04&&z<b.maxZ-.04)return false;}}return true;}
 target(){this.ray.setFromCamera(this.center,this.camera);const hits=this.ray.intersectObjects(this.items.map(i=>i.object),true);for(const hit of hits){const item=this.items.find(i=>{let obj=hit.object;while(obj){if(obj===i.object)return true;obj=obj.parent;}return false;});if(item&&this.visible(item))return item;}return null;}
}
