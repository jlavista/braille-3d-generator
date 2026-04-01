import * as THREE from 'three'

export function generateSTL(geometry: THREE.BufferGeometry): string {
  const vertices = geometry.attributes.position
  const indices = geometry.index
  
  let stl = 'solid braille\n'
  
  if (indices) {
    for (let i = 0; i < indices.count; i += 3) {
      const i1 = indices.getX(i)
      const i2 = indices.getX(i + 1)
      const i3 = indices.getX(i + 2)
      
      const v1 = new THREE.Vector3(
        vertices.getX(i1),
        vertices.getY(i1),
        vertices.getZ(i1)
      )
      const v2 = new THREE.Vector3(
        vertices.getX(i2),
        vertices.getY(i2),
        vertices.getZ(i2)
      )
      const v3 = new THREE.Vector3(
        vertices.getX(i3),
        vertices.getY(i3),
        vertices.getZ(i3)
      )
      
      const normal = new THREE.Vector3()
      const edge1 = new THREE.Vector3().subVectors(v2, v1)
      const edge2 = new THREE.Vector3().subVectors(v3, v1)
      normal.crossVectors(edge1, edge2).normalize()
      
      stl += `  facet normal ${normal.x.toExponential(6)} ${normal.y.toExponential(6)} ${normal.z.toExponential(6)}\n`
      stl += `    outer loop\n`
      stl += `      vertex ${v1.x.toExponential(6)} ${v1.y.toExponential(6)} ${v1.z.toExponential(6)}\n`
      stl += `      vertex ${v2.x.toExponential(6)} ${v2.y.toExponential(6)} ${v2.z.toExponential(6)}\n`
      stl += `      vertex ${v3.x.toExponential(6)} ${v3.y.toExponential(6)} ${v3.z.toExponential(6)}\n`
      stl += `    endloop\n`
      stl += `  endfacet\n`
    }
  }
  
  stl += 'endsolid braille\n'
  return stl
}

export function downloadSTL(stl: string, filename: string = 'braille-model.stl') {
  const blob = new Blob([stl], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
