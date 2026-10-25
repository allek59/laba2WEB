export class Input{
 constructor(element,onPause){this.element=element;this.keys=new Set();this.dx=0;this.dy=0;this.dragging=false;this.lastX=0;this.lastY=0;this.active=false;this.onPause=onPause;
 window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','Escape'].includes(e.code))e.preventDefault();if(e.code==='Escape'&&this.active){this.onPause();return;}this.keys.add(e.code);});
 window.addEventListener('keyup',e=>this.keys.delete(e.code));window.addEventListener('blur',()=>this.clear());
 document.addEventListener('pointerlockchange',()=>{if(this.active&&!document.pointerLockElement&&!this.dragging)this.onPause();});
 element.addEventListener('mousemove',e=>{if(!this.active)return;if(document.pointerLockElement===element){this.dx+=e.movementX;this.dy+=e.movementY;}else if(this.dragging){this.dx+=e.clientX-this.lastX;this.dy+=e.clientY-this.lastY;this.lastX=e.clientX;this.lastY=e.clientY;}});
 element.addEventListener('pointerdown',e=>{if(e.button!==0||!this.active||document.pointerLockElement)return;this.dragging=true;this.lastX=e.clientX;this.lastY=e.clientY;});window.addEventListener('pointerup',()=>this.dragging=false);
 }
 async lock(){if(!this.element.requestPointerLock)return;try{await this.element.requestPointerLock();}catch{ /* drag-to-look fallback */ }}
 unlock(){if(document.pointerLockElement)document.exitPointerLock();}
 clear(){this.keys.clear();this.dx=this.dy=0;this.dragging=false;}
 consumeMouse(){const result={x:this.dx,y:this.dy};this.dx=this.dy=0;return result;}
}
