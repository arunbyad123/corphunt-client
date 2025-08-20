import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles(){
  const ref = useRef()
  const count = 3000
  const positions = useMemo(()=>{
    const arr = new Float32Array(count * 3)
    for(let i=0;i<count*3;i++){
      arr[i] = (Math.random() - 0.5) * 40 // random cube space
    }
    return arr
  },[])
  useFrame((_, delta)=>{
    if(ref.current){
      ref.current.rotation.y += delta * 0.06
      ref.current.rotation.x += delta * 0.02
    }
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={'#9ff'} sizeAttenuation />
    </points>
  )
}

export default function AnimatedBackground(){
  return (
    <Canvas
      style={{ position:'fixed', inset:0, zIndex: -1 }}
      camera={{ position: [0,0,12], fov: 60 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7}/>
      <Particles/>
    </Canvas>
  )
}
