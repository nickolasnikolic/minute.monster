window.onload= () => {

const vitamins = document.getElementById('vitamins')

const t = new THREE()
const s = t.Scene()
const c = t.OrthographicCamera(0,0, vitamins.clientWidth, vitamins.clientHeight)
c.position.z = 1
s.add(c)

var g = new t.BoxGeometry(1, 1, 0.1)
var m = new t.BasicMeshMaterial({color: 'yellow'})
var flatRectangle = new t.Mesh(g,m)
s.add(flatRectangle)

const r = new t.WebGLRenderer()
//r.setClearColor( 0x000000, 0 )

vitamins.insertAdjacentHTML(r)

}