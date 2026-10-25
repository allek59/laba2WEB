export class Collision{
 constructor(size,radius){this.size=size;this.radius=radius;this.boxes=[];}
 add(x,z,w,d){this.boxes.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});}
 blocked(x,z){const r=this.radius,h=this.size/2-r;if(x< -h||x>h||z< -h||z>h)return true;for(const b of this.boxes){const nx=Math.max(b.minX,Math.min(x,b.maxX)),nz=Math.max(b.minZ,Math.min(z,b.maxZ));if((x-nx)**2+(z-nz)**2<r*r)return true;}return false;}
 move(position,dx,dz){if(!this.blocked(position.x+dx,position.z))position.x+=dx;if(!this.blocked(position.x,position.z+dz))position.z+=dz;}
}
