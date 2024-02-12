/*
function animate() { 
  requestAnimationFrame( animate ); 
  if (environnement["sphere"]) rotateMesh(environnement["sphere"], {x: 0.01, y: 0.01, z: 0.01})
  if (environnement["surface"]) rotateMesh(environnement["surface"], {x: 0, y: 0.01, z: 0})
}

function rotateMesh (mesh: Mesh, rotation: Vector3D) {
  mesh.rotation.x += rotation.x
  mesh.rotation.y += rotation.y
  mesh.rotation.z += rotation.z
}

watch(environnement, (newEnvironment: Record<string, Mesh>) => {
  scene.clear()
  for (let key in newEnvironment) scene.add(newEnvironment[key].clone())
  render()
})
*/