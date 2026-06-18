export function renderIterationChart(container, payload) {
  container.innerHTML = "";
  const values = payload.history?.map((item) => Math.max(item.residual, 1e-14)) || syntheticValues(payload.steps?.length || 4);

  const canvas = document.createElement("canvas");
  canvas.className = "convergence-chart";
  canvas.width = 360;
  canvas.height = 128;
  canvas.setAttribute("aria-label", payload.history ? "График сходимости" : "Схема шагов исключения");
  container.append(canvas);

  const context = canvas.getContext("2d");
  const state = {
    points: mapPoints(values, canvas.width, canvas.height),
    progress: 0,
    hover: -1,
    label: payload.history ? "Невязка" : "Шаги"
  };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    state.hover = nearestPoint(state.points, x);
    draw(context, canvas, state);
  });

  canvas.addEventListener("pointerleave", () => {
    state.hover = -1;
    draw(context, canvas, state);
  });

  animate(context, canvas, state);
}

function syntheticValues(count) {
  return Array.from({ length: Math.max(4, Math.min(9, count)) }, (_, index) => Math.pow(0.58, index + 1));
}

function mapPoints(values, width, height) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const left = 28;
  const right = width - 18;
  const top = 16;
  const bottom = height - 28;
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);

  return values.map((value, index) => {
    const x = values.length === 1 ? left : left + (index / (values.length - 1)) * (right - left);
    const ratio = logMax === logMin ? 0.5 : (Math.log10(value) - logMin) / (logMax - logMin);
    const y = bottom - ratio * (bottom - top);
    return { x, y, value, index };
  });
}

function animate(context, canvas, state) {
  state.progress = Math.min(1, state.progress + 0.035);
  draw(context, canvas, state);
  if (state.progress < 1) requestAnimationFrame(() => animate(context, canvas, state));
}

function draw(context, canvas, state) {
  const { width, height } = canvas;
  const points = state.points;
  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(103, 232, 249, 0.34)");
  gradient.addColorStop(1, "rgba(246, 198, 91, 0.1)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(154, 190, 229, 0.18)";
  context.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = 18 + i * 26;
    context.beginPath();
    context.moveTo(18, y);
    context.lineTo(width - 16, y);
    context.stroke();
  }

  const visible = Math.max(2, Math.ceil(points.length * state.progress));
  context.strokeStyle = "#67e8f9";
  context.lineWidth = 4;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  points.slice(0, visible).forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.stroke();

  points.slice(0, visible).forEach((point, index) => {
    const active = index === state.hover || index === visible - 1;
    context.beginPath();
    context.fillStyle = active ? "#f6c65b" : "#dff8ff";
    context.arc(point.x, point.y, active ? 5.5 : 3.5, 0, Math.PI * 2);
    context.fill();
  });

  if (state.hover >= 0) {
    const point = points[state.hover];
    context.fillStyle = "rgba(4, 10, 18, 0.92)";
    context.strokeStyle = "rgba(103, 232, 249, 0.42)";
    roundRect(context, point.x - 48, 8, 96, 26, 8);
    context.fill();
    context.stroke();
    context.fillStyle = "#dff8ff";
    context.font = "700 12px Consolas, monospace";
    context.textAlign = "center";
    context.fillText(`${state.label}: ${format(point.value)}`, point.x, 26);
  }
}

function nearestPoint(points, x) {
  return points.reduce((best, point, index) => {
    const distance = Math.abs(point.x - x);
    return distance < best.distance ? { index, distance } : best;
  }, { index: 0, distance: Infinity }).index;
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function format(value) {
  if (value < 1e-6) return value.toExponential(1);
  return Number(value.toPrecision(3)).toString();
}
