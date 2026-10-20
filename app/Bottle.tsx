'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
export default function Bottle({onReady,onError}:{onReady:()=>void,onError:()=>void}) {
 const mount=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=mount.current!; let renderer:THREE.WebGLRenderer;
  try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:true}); } catch {onError();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,0,8);
  const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();
  const key=new THREE.DirectionalLight(0xffe8d7,5);key.position.set(3,4,5);scene.add(key);const rim=new THREE.DirectionalLight(0xff9999,4);rim.position.set(-3,1,2);scene.add(rim);scene.add(new THREE.AmbientLight(0xffffff,2));
  const pivot=new THREE.Group();scene.add(pivot);let alive=true;let frame=0;let loaded=false;let scroll=0;let smoothed=0;
  new GLTFLoader().load('/parfum.glb',g=>{if(!alive)return;const model=g.scene;const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());model.position.sub(center);const group=new THREE.Group();group.add(model);group.scale.setScalar(3.6/Math.max(size.x,size.y,size.z));pivot.add(group);model.traverse(o=>{if(o instanceof THREE.Mesh){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=2.5;if(m.name==='Realistic_Glass'){m.color.set('#71534b');m.opacity=.65;m.transparent=true;m.metalness=.12;m.roughness=.12;}}});}});loaded=true;onReady();},undefined,()=>onError());
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=innerWidth<700?13:8;camera.updateProjectionMatrix();};
  const updateScroll=()=>{scroll=window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);};
  resize();window.addEventListener('resize',resize);window.addEventListener('scroll',updateScroll,{passive:true});
  const render=(t:number)=>{if(!alive)return;smoothed+=(scroll-smoothed)*.065;pivot.rotation.y=-.35+smoothed*Math.PI*3.6;pivot.rotation.z=.08-Math.sin(smoothed*Math.PI*2)*.16;pivot.rotation.x=.08;pivot.position.y=(innerWidth<700?-.55:0)+(reduced?0:Math.sin(t*.0007)*.045);if(loaded)renderer.render(scene,camera);frame=requestAnimationFrame(render);};frame=requestAnimationFrame(render);
  return()=>{alive=false;cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('scroll',updateScroll);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
 },[onReady,onError]);
 return <div ref={mount} className="bottle" role="img" aria-label="Flacon du parfum en trois dimensions, tournant au défilement"/>;
}
