let A = [
  ["00BCD4", "FFEB3B", "FFEB3B", "00BCD4"],
  ["FFEB3B", "FFC107", "FFC107", "FFEB3B"],
  ["FFEB3B", "FFC107", "FFC107", "FFEB3B"],
  ["00BCD4", "FFEB3B", "FFEB3B", "00BCD4"]
];
let prevColorsData = [head.value];
let canvas;
let ctx;
let previousColorElement;

window.onload = function() {
  canvas = document.getElementById("drawingCanvas");
  ctx = canvas.getContext("2d");
  (width = A[0].length), (height = A.length), (scale = 128);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      ctx.fillStyle = "#" + A[row][col];
      ctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }
  changePenColor(getColor(), document.getElementById("Pen"));
};

function getColor() {  
  return head.value;
}

function changePenColor(color, imgElement) {
  // Подключаем требуемые для рисования события
  canvas.onmousedown = startDrawing;
  canvas.onmouseup = stopDrawing;
  canvas.onmouseout = stopDrawing;
  canvas.onmousemove = draw;

  // 	Меняем текущий цвет рисования
  ctx.strokeStyle = color;

  // Меняем стиль элемента <img>, по которому щелкнули
  imgElement.className = "Selected";

  // Возвращаем ранее выбранный элемент <img> в нормальное состояние
  if (previousColorElement != null) previousColorElement.className = "";
  previousColorElement = imgElement;
}

head.addEventListener("input", updateFirst, false);

function updateFirst() {
  prevColorsData.push(head.value);  
  changePrevColor();
  if (document.getElementsByClassName("Selected")[0].id == "Pen") {
    changePenColor(head.value, this.class);
  } else if (document.getElementsByClassName("Selected")[0].id == "bucket") {
    changeBackground(head.value, this.class);
  } else {
    return null;
  }
}

function changePrevColor() {
  if (prevColorsData.length > 2) prevColorsData = prevColorsData.slice(1);
  prevColor.style.background = prevColorsData[0];
  prevColor.value = prevColorsData[0];  
}

// Отслеживаем элемент <img> для толщины линии, по которому ранее щелкнули
let previousThicknessElement;

function changeThickness(thickness, imgElement) {
  // Изменяем текущую толщину линии
  ctx.lineWidth = thickness;

  // Меняем стиль элемента <img>, по которому щелкнули
  imgElement.className = "Selected";

  // Возвращаем ранее выбранный элемент <img> в нормальное состояние
  if (previousThicknessElement != null) previousThicknessElement.className = "";

  previousThicknessElement = imgElement;
}

function startDrawing(e) {
  // Начинаем рисовать
  isDrawing = true;

  // Создаем новый путь (с текущим цветом и толщиной линии)
  ctx.beginPath();

  // Нажатием левой кнопки мыши помещаем "кисть" на холст
  ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
}

function draw(e) {
  if (isDrawing) {
    // Определяем текущие координаты указателя мыши
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    // Рисуем линию до новой координаты
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function stopDrawing() {
  isDrawing = false;
}

function changeBackground(color, imgElement) {
  canvas.onmousedown = changeBgColor;
  ctx.fillStyle = color;
  imgElement.className = "Selected";
  if (previousColorElement != null) previousColorElement.className = "";
  previousColorElement = imgElement;
}

function changeBgColor(e) {
  bucket(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
}

function bucket(xPosition, yPosition) {
  ctx.fillRect(
    Math.floor(xPosition / 128) * 128,
    Math.floor(yPosition / 128) * 128,
    scale,
    scale
  );
}

function pickColor() { 
  eyeDropper.classList.add("Selected");
  if (previousColorElement != null) previousColorElement.className = "";
  previousColorElement = document.getElementById("eyeDropper");
  canvas.onmousedown = down;
}

function down(e) {
  let canvasX = Math.floor(e.pageX - canvas.offsetLeft);
  let canvasY = Math.floor(e.pageY - canvas.offsetTop);
  let imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
  let pixel = imageData.data;
  let pickedColor = pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3];
  pickedcolor.style.background = "rgba(" + pickedColor + ")";
}

function applyDefaultColor() {
  head.value = "#000000";
  updateFirst();
}

function applyPrevColor() {
  head.value = prevColor.value;
  updateFirst();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
