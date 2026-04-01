import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { BrailleChar, getDotPositions } from '@/lib/braille'

interface BrailleViewer3DProps {
  brailleChars: BrailleChar[]
  baseWidth?: number
  baseHeight?: number
  baseDepth?: number
  dotRadius?: number
  dotHeight?: number
  cellWidth?: number
  cellHeight?: number
  cellSpacing?: number
  onGeometryUpdate?: (geometry: THREE.BufferGeometry) => void
}

export function BrailleViewer3D({
  brailleChars,
  baseWidth = 100,
  baseHeight = 30,
  baseDepth = 2,
  dotRadius = 0.75,
  dotHeight = 0.5,
  cellWidth = 2.5,
  cellHeight = 6.2,
  cellSpacing = 6,
  onGeometryUpdate
}: BrailleViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const controlsRef = useRef<OrbitControls>()
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, -40, 30)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 20
    controls.maxDistance = 200
    controlsRef.current = controls

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, -5, 10)
    scene.add(directionalLight)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
    directionalLight2.position.set(-5, 5, 5)
    scene.add(directionalLight2)

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      controls.dispose()
      renderer.dispose()
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current
    
    while (scene.children.length > 3) {
      scene.remove(scene.children[3])
    }

    if (brailleChars.length === 0) return

    const group = new THREE.Group()

    const totalWidth = Math.max(baseWidth, brailleChars.length * cellSpacing + 10)
    
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8e4d9,
      roughness: 0.7,
      metalness: 0.1
    })
    const baseGeometry = new THREE.BoxGeometry(totalWidth, baseHeight, baseDepth)
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)
    baseMesh.position.set(0, 0, -baseDepth / 2)
    group.add(baseMesh)

    const dotMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4cbb8,
      roughness: 0.5,
      metalness: 0.2
    })

    const startX = -(brailleChars.length - 1) * cellSpacing / 2

    brailleChars.forEach((brailleChar, charIndex) => {
      const dotPositions = getDotPositions(brailleChar.dots, cellWidth, cellHeight, dotHeight)
      
      dotPositions.forEach((pos) => {
        const dotGeometry = new THREE.CylinderGeometry(dotRadius, dotRadius, dotHeight, 16)
        const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial)
        
        const xOffset = startX + charIndex * cellSpacing
        const yOffset = -cellHeight / 2
        
        dotMesh.position.set(
          xOffset + pos.x - cellWidth / 2,
          yOffset + pos.y,
          dotHeight / 2
        )
        dotMesh.rotation.x = Math.PI / 2
        
        group.add(dotMesh)
      })
    })

    scene.add(group)

    if (onGeometryUpdate) {
      const geometries: THREE.BufferGeometry[] = []
      
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const clonedGeometry = child.geometry.clone()
          clonedGeometry.applyMatrix4(child.matrixWorld)
          geometries.push(clonedGeometry)
        }
      })

      if (geometries.length > 0) {
        const mergedGeo = mergeGeometries(geometries)
        if (mergedGeo) {
          onGeometryUpdate(mergedGeo)
        }
      }
    }

  }, [brailleChars, baseWidth, baseHeight, baseDepth, dotRadius, dotHeight, cellWidth, cellHeight, cellSpacing, onGeometryUpdate])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
    />
  )
}
