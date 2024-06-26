
const canvas = document.querySelector('canvas'),
  toolBtns = document.querySelectorAll('.tool'),
  fillColor = document.querySelector('#fill-color'),
  sizeSlider = document.querySelector('#size-slider'),
  changeColor = document.querySelectorAll('.colors .option'),
  colorPicker = document.querySelector('#color-picker'),
  clearCanvasBtn = document.querySelector('.clear-canvas'),
  saveCanvasBtn = document.querySelector('.save-img'),
  undoBtn = document.querySelector(".undoBtn")


//VARIABLES
let ctx = canvas.getContext('2d'),
  isDrawing = false,
  brushWidth = 5,
  selectedTool = 'brush',
  selectedColor = '#000',
  prevMouseX,
  prevMouseY,
  snapshot

//LOADER
window.addEventListener('load', () => {
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
})

//TOOL BUTTONS
toolBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.options .active').classList.remove('active')
    btn.classList.add('active')
    selectedTool = btn.id
  })
})

//SIZE SLIDER
sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value))

//SET COLOR TO SHAPE
changeColor.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.options .selected').classList.remove('selected')
    btn.classList.add('selected')
    const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
    selectedColor = bgColor
  })
})
const setCanvasBg = () => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = selectedColor
}

//SET COLOR FROM COLOR PICKER
colorPicker.addEventListener('change', e => {
  colorPicker.parentElement.style.background = colorPicker.value
  colorPicker.parentElement.click()
  setCanvasBg()
})
//CLEAR CANVAS
clearCanvasBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
})

//SAVE DOCUMENT
saveCanvasBtn.addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = `Farmix|Paint${Date.now()}.jpg`
  link.href = canvas.toDataURL()
  link.click()
})
//START DRAWING
const startDrawing = e => {
  isDrawing = true
  prevMouseX = e.offsetX
  prevMouseY = e.offsetY
  ctx.lineWidth = brushWidth
  ctx.beginPath()
  ctx.strokeStyle = selectedColor
  ctx.fillStyle = selectedColor
  snapshot = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight)
}
//DRAWING
const drawing = e => {
  if (!isDrawing) return
  ctx.putImageData(snapshot, 0, 0)
  switch (selectedTool) {
    case 'brush':
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()
      emitDrawEvent({
        tool: 'brush',
        color: selectedColor,
        brushWidth,
        startX: prevMouseX,
        startY: prevMouseY,
        endX: e.offsetX,
        endY: e.offsetY,
      });
      break
    case 'rectangle':
      drawRectangle(e)
      emitDrawEvent({
        tool: 'brush',
        color: selectedColor,
        brushWidth,
        startX: prevMouseX,
        startY: prevMouseY,
        endX: e.offsetX,
        endY: e.offsetY,
      });
      break
    case 'circle':
      drawCircle(e)
      emitDrawEvent({
        tool: 'brush',
        color: selectedColor,
        brushWidth,
        startX: prevMouseX,
        startY: prevMouseY,
        endX: e.offsetX,
        endY: e.offsetY,
      });
      break
    case 'triangle':
      drawTriangle(e)
      emitDrawEvent({
        tool: 'brush',
        color: selectedColor,
        brushWidth,
        startX: prevMouseX,
        startY: prevMouseY,
        endX: e.offsetX,
        endY: e.offsetY,
      });
      break
    case 'eraser':
      ctx.strokeStyle = '#fff'
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()
      emitDrawEvent({
        tool: 'brush',
        color: selectedColor,
        brushWidth,
        startX: prevMouseX,
        startY: prevMouseY,
        endX: e.offsetX,
        endY: e.offsetY,
      });
      break
  }

}

//STOP DRAWING
const stopDrawing = () => {
  isDrawing = false
}

// DRAW RECTANGLE
const drawRectangle = e => {
  fillColor.checked ? ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    : ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

//DRAW CIRCLE
const drawCircle = e => {
  ctx.beginPath()
  let radius =
    Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) + Math.pow(prevMouseY - e.offsetY, 2)
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
  fillColor.checked ? ctx.fill() : ctx.stroke()
}

//DRAW TRIANGLE
const drawTriangle = e => {
  ctx.beginPath()
  ctx.moveTo(prevMouseX, prevMouseY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
  ctx.closePath()
  fillColor.checked ? ctx.fill() : ctx.stroke()
}


setCanvasBg()
canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDrawing)

