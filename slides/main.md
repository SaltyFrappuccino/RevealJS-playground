# Численные методы

Вариант №2

<div class="hero-grid">
  <div>
    <span class="hero-mark">Ax = b</span>
    <p>СЛАУ, прямые и итерационные методы, невязка и интерактивная JavaScript-программа.</p>
  </div>
  <img src="./assets/img/matrix-lab.svg" alt="Матрицы и вычисления">
</div>

---

# Введение

<p class="section-kicker">Раздел</p>

От математической модели к вычислительному алгоритму.

---

## Определение численных методов

Численные методы - это способы приближенного или точного вычисления математических объектов с помощью конечного набора арифметических операций.

<div class="accent-panel">
  <span data-tex="x^* \approx x,\qquad \varepsilon = |x^*-x|"></span>
</div>

Их используют, когда аналитическое решение сложно, слишком громоздко или невозможно получить в явном виде.

---

## Где применяются численные методы

<div class="three-columns">
  <div class="mini-card"><b>Инженерия</b><span>прочность, теплообмен, аэродинамика</span></div>
  <div class="mini-card"><b>Экономика</b><span>прогнозирование, оптимизация, балансы</span></div>
  <div class="mini-card"><b>Графика</b><span>рендеринг, симуляции, обработка сигналов</span></div>
</div>

<img class="wide-illustration" src="./assets/img/iteration-orbit.svg" alt="Итерационный процесс">

---

## Численный алгоритм

<div class="flow">
  <div><b>Модель</b><span>постановка задачи</span></div>
  <div><b>Дискретизация</b><span>переход к числам</span></div>
  <div><b>Алгоритм</b><span>последовательность шагов</span></div>
  <div><b>Оценка ошибки</b><span>контроль точности</span></div>
</div>

<p>Качество метода оценивают по точности, устойчивости, сложности и удобству программной реализации.</p>

---

# СЛАУ

<p class="section-kicker">Раздел</p>

Системы линейных алгебраических уравнений как основной объект вычислений.

---

## Определение СЛАУ

СЛАУ - это система уравнений, в которой все неизвестные входят только в первой степени.

<div class="formula-wall">
  <span data-tex="\begin{cases}a_{11}x_1+a_{12}x_2+\dots+a_{1n}x_n=b_1\\a_{21}x_1+a_{22}x_2+\dots+a_{2n}x_n=b_2\\\dots\\a_{n1}x_1+a_{n2}x_2+\dots+a_{nn}x_n=b_n\end{cases}"></span>
</div>

---

## Матричная форма

Любую квадратную СЛАУ удобно записывать как:

<div class="formula-wall">
  <span data-tex="Ax=b,\qquad A\in\mathbb{R}^{n\times n},\quad x,b\in\mathbb{R}^{n}"></span>
</div>

<div class="two-columns compact">
  <div><b>A</b><span>матрица коэффициентов</span></div>
  <div><b>x</b><span>вектор неизвестных</span></div>
  <div><b>b</b><span>вектор свободных членов</span></div>
  <div><b>n</b><span>размерность системы</span></div>
</div>

---

## Что значит решить СЛАУ

Найти такой вектор <span data-tex="x" data-display="inline"></span>, при котором произведение <span data-tex="Ax" data-display="inline"></span> совпадает с <span data-tex="b" data-display="inline"></span>.

<div class="accent-panel">
  <span data-tex="x=A^{-1}b\quad\text{если}\quad \det A\ne0"></span>
</div>

На практике обратную матрицу чаще не находят напрямую: используют более устойчивые алгоритмы.

---

# Прямые методы

<p class="section-kicker">Раздел</p>

Метод Гаусса и метод Гаусса-Жордана.

---

## Метод Гаусса: идея

Метод Гаусса приводит расширенную матрицу системы к верхнетреугольному виду, затем выполняет обратный ход.

<div class="formula-wall">
  <span data-tex="[A|b]\rightarrow[U|c]\rightarrow x"></span>
</div>

Главный практический прием - выбор ведущего элемента, чтобы уменьшить накопление ошибки.

---

## Метод Гаусса: формулы

Для шага <span data-tex="k" data-display="inline"></span> зануляем элементы ниже ведущего:

<div class="formula-wall">
  <span data-tex="m_{ik}=\frac{a_{ik}}{a_{kk}},\qquad R_i\leftarrow R_i-m_{ik}R_k,\quad i=k+1,\dots,n"></span>
</div>

После прямого хода:

<div class="formula-wall small-formula">
  <span data-tex="x_i=\frac{c_i-\sum_{j=i+1}^{n}u_{ij}x_j}{u_{ii}},\qquad i=n,n-1,\dots,1"></span>
</div>

---

## Метод Гаусса: алгоритм

<div class="algorithm">
  <div><b>1</b><span>Собрать расширенную матрицу <span data-tex="[A|b]" data-display="inline"></span>.</span></div>
  <div><b>2</b><span>На каждом столбце выбрать ведущую строку.</span></div>
  <div><b>3</b><span>Занулить элементы ниже диагонали.</span></div>
  <div><b>4</b><span>Выполнить обратную подстановку.</span></div>
</div>

---

## Метод Гаусса: пример

<div class="two-columns">
  <div>
    <span data-tex="\begin{cases}2x+y=5\\4x-6y=-2\end{cases}"></span>
  </div>
  <div>
    <span data-tex="\left[\begin{array}{cc|c}2&1&5\\4&-6&-2\end{array}\right]\rightarrow\left[\begin{array}{cc|c}4&-6&-2\\0&4&6\end{array}\right]"></span>
  </div>
</div>

<div class="accent-panel">
  <span data-tex="y=\frac{3}{2},\qquad x=\frac{7}{4}"></span>
</div>

---

## Метод Гаусса-Жордана: идея

Метод Гаусса-Жордана продолжает исключение до единичной матрицы.

<div class="formula-wall">
  <span data-tex="[A|b]\rightarrow[I|x]"></span>
</div>

В результате решение считывается сразу из правой части расширенной матрицы.

---

## Метод Гаусса-Жордана: формулы

Сначала нормируем ведущую строку:

<div class="formula-wall">
  <span data-tex="R_k\leftarrow\frac{R_k}{a_{kk}}"></span>
</div>

Потом зануляем весь столбец, кроме диагонального элемента:

<div class="formula-wall small-formula">
  <span data-tex="R_i\leftarrow R_i-a_{ik}R_k,\qquad i\ne k"></span>
</div>

---

## Метод Гаусса-Жордана: алгоритм

<div class="algorithm">
  <div><b>1</b><span>Выбрать ведущий элемент в текущем столбце.</span></div>
  <div><b>2</b><span>Поменять строки при необходимости.</span></div>
  <div><b>3</b><span>Разделить ведущую строку на ведущий элемент.</span></div>
  <div><b>4</b><span>Занулить элементы сверху и снизу.</span></div>
  <div><b>5</b><span>Повторить для всех столбцов.</span></div>
</div>

---

## Метод Гаусса-Жордана: пример

<div class="formula-wall">
  <span data-tex="\left[\begin{array}{cc|c}2&1&5\\4&-6&-2\end{array}\right]\rightarrow\left[\begin{array}{cc|c}1&0&\frac{7}{4}\\0&1&\frac{3}{2}\end{array}\right]"></span>
</div>

<p>Преимущество метода - прозрачный финальный вид. Недостаток - больше операций, чем у обычного метода Гаусса.</p>

---

# Итерационные методы

<p class="section-kicker">Раздел</p>

Метод Гаусса-Зейделя.

---

## Метод Гаусса-Зейделя: идея

Метод строит последовательность приближений <span data-tex="x^{(0)},x^{(1)},x^{(2)},\dots" data-display="inline"></span>.

<div class="formula-wall small-formula">
  <span data-tex="x_i^{(k+1)}=\frac{1}{a_{ii}}\left(b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}-\sum_{j>i}a_{ij}x_j^{(k)}\right)"></span>
</div>

Свежие значения сразу используются в текущей итерации.

---

## Условие сходимости

Достаточное условие сходимости - диагональное преобладание:

<div class="formula-wall">
  <span data-tex="|a_{ii}|>\sum_{j\ne i}|a_{ij}|,\qquad i=1,\dots,n"></span>
</div>

Это не единственный возможный случай сходимости, но простой и удобный критерий для проверки.

---

## Метод Гаусса-Зейделя: алгоритм

<div class="algorithm">
  <div><b>1</b><span>Выбрать начальное приближение, например <span data-tex="x^{(0)}=0" data-display="inline"></span>.</span></div>
  <div><b>2</b><span>Последовательно пересчитать все координаты.</span></div>
  <div><b>3</b><span>Оценить изменение или невязку.</span></div>
  <div><b>4</b><span>Остановиться при достижении точности.</span></div>
</div>

---

## Метод Гаусса-Зейделя: пример

<div class="two-columns">
  <div>
    <span data-tex="\begin{cases}10x-y+2z=6\\-x+11y-z=22\\2x-y+10z=-10\end{cases}"></span>
  </div>
  <div>
    <span data-tex="x^{(0)}=\begin{bmatrix}0\\0\\0\end{bmatrix},\quad x^{(1)}=\begin{bmatrix}0.6\\2.327\\-0.987\end{bmatrix}"></span>
  </div>
</div>

<div class="accent-panel">
  <span data-tex="x\approx\begin{bmatrix}1\\2\\-1\end{bmatrix}"></span>
</div>

---

# JavaScript-программа

<p class="section-kicker">Раздел</p>

Интерактивный решатель СЛАУ.

---

## Архитектура программы

<div class="file-tree">
  <div><b>src/core</b><span>парсер, матрицы, LaTeX</span></div>
  <div><b>src/methods</b><span>Гаусс, Гаусс-Жордан, Зейдель</span></div>
  <div><b>src/ui.js</b><span>события, предпросмотр, результат, сравнение</span></div>
  <div><b>src/presentation.js</b><span>Reveal.js, меню, формулы</span></div>
</div>

---

## Формат ввода

Каждая строка - одно уравнение. Слева коэффициенты, справа свободный член.

<div class="code-sample">

```text
10 -1 2 | 6
-1 11 -1 | 22
2 -1 10 | -10
```

</div>

Также можно писать последним числом свободный член без символа <span data-tex="|" data-display="inline"></span>.

---

## Интерактивный решатель

<div class="solver-app" id="solverApp">
  <div class="solver-left">
    <div class="solver-toolbar">
      <button data-example="easy2">2x2</button>
      <button data-example="stable3">3x3</button>
      <button data-example="wide4">4x4</button>
      <button data-example="exact4">Контроль</button>
      <button data-random>Случайная</button>
    </div>
    <textarea id="systemInput" spellcheck="false" aria-label="Ввод СЛАУ"></textarea>
    <div class="solver-options">
      <label>Метод <select id="methodSelect"><option value="gauss">Гаусс</option><option value="jordan">Гаусс-Жордан</option><option value="seidel">Гаусс-Зейдель</option></select></label>
      <label>ε <input id="toleranceInput" type="number" min="1e-12" step="0.000001" value="0.000001"></label>
      <label>итерации <input id="iterationInput" type="number" min="1" max="500" value="80"></label>
    </div>
    <div class="solver-actions">
      <button data-solve>Решить</button>
      <button data-compare>Сравнить методы</button>
      <span id="solverStatus" class="solver-status"></span>
    </div>
  </div>
  <div class="solver-right">
    <div class="solver-card"><b>Система</b><div id="systemPreview"></div></div>
    <div class="solver-card"><b>Решение</b><div id="solverResult"></div></div>
    <div class="solver-card"><b>Невязка</b><div id="residualResult"></div></div>
    <div class="solver-card row-card"><div id="iterationChart"></div><div id="solverSteps"></div></div>
    <div id="compareResult" class="compare-result"></div>
  </div>
</div>

---

## Что делает программа

<div class="three-columns">
  <div class="mini-card"><b>Парсит</b><span>матрицу любой квадратной размерности</span></div>
  <div class="mini-card"><b>Решает</b><span>тремя выбранными методами</span></div>
  <div class="mini-card"><b>Проверяет</b><span>невязку в нормах <span data-tex="\|\cdot\|_\infty" data-display="inline"></span> и <span data-tex="\|\cdot\|_2" data-display="inline"></span></span></div>
</div>

<p>Ввод, матрица, решение и невязка отображаются через LaTeX-рендеринг KaTeX.</p>

---

# Невязка

<p class="section-kicker">Раздел</p>

Проверка качества найденного решения.

---

## Определение невязки

Если найдено приближенное решение <span data-tex="\tilde{x}" data-display="inline"></span>, невязкой называют вектор:

<div class="formula-wall">
  <span data-tex="r=A\tilde{x}-b"></span>
</div>

Чем ближе <span data-tex="r" data-display="inline"></span> к нулю, тем точнее найденное решение удовлетворяет исходной системе.

---

## Вычисление невязки

Для системы:

<div class="formula-wall">
  <span data-tex="A=\begin{bmatrix}4&1\\2&3\end{bmatrix},\quad b=\begin{bmatrix}9\\13\end{bmatrix},\quad x=\begin{bmatrix}1.4\\3.4\end{bmatrix}"></span>
</div>

Получаем:

<div class="accent-panel">
  <span data-tex="r=Ax-b=\begin{bmatrix}0\\0\end{bmatrix}"></span>
</div>

---

## Нормы невязки

<div class="two-columns">
  <div class="mini-card"><b>Максимальная норма</b><span data-tex="\|r\|_\infty=\max_i |r_i|"></span></div>
  <div class="mini-card"><b>Евклидова норма</b><span data-tex="\|r\|_2=\sqrt{\sum_i r_i^2}"></span></div>
</div>

<img class="wide-illustration" src="./assets/img/residual-compass.svg" alt="Невязка и направление ошибки">

---

# Исходный код

<p class="section-kicker">Раздел</p>

Ключевые модули программы.

---

## Выбор алгоритма

<div class="code-sample">

```js
const methods = {
  gauss: solveGauss,
  jordan: solveGaussJordan,
  seidel: solveGaussSeidel
};
```

</div>

<p>Интерфейс выбирает метод, передает матрицу и отображает результат в LaTeX.</p>

---

## Функция невязки

<div class="code-sample">

```js
export function residual(A, x, b) {
  const r = subtractVectors(multiplyMatrixVector(A, x), b);
  return {
    vector: r,
    normInf: normInf(r),
    norm2: norm2(r)
  };
}
```

</div>

---

## Почему реализация модульная

<div class="three-columns">
  <div class="mini-card"><b>Методы</b><span>можно тестировать отдельно</span></div>
  <div class="mini-card"><b>UI</b><span>не содержит математику</span></div>
  <div class="mini-card"><b>LaTeX</b><span>изолирован в отдельном модуле</span></div>
</div>

<p>Такую структуру проще расширять, проверять и объяснять.</p>

---

# Мемная Пауза, ig

<p class="section-kicker">Раздел</p>

---

## Работаю в банке с Рисками

<div class="meme-showcase">
  <img src="./assets/img/meme-1.png" alt="Мем про банк и риски">
  <div class="risk-caption">
    <b>Сбер, трайб Риски</b>
    <span>Я работаю в Сбербанке, в трайбе Риски, отсюда пошла эта мемная картинка, про работу в банке, полной рисков.</span>
  </div>
</div>

---

## Вайбкодинг - это как казик

<img class="meme-image" src="./assets/img/meme-2.png" alt="">

---

## Типичный ответ чатГПТ

<img class="meme-image" src="./assets/img/meme-3.jpg" alt="ь">

---

## Моя аффирмация

<img class="meme-image" src="./assets/img/meme-4.jpg" alt="">

---

# Заключение

Численные методы позволяют решать задачи, где ручные преобразования быстро становятся неудобными.

<div class="closing-grid">
  <div><b>Гаусс</b><span>надежный прямой метод</span></div>
  <div><b>Гаусс-Жордан</b><span>полное приведение к единичной матрице</span></div>
  <div><b>Гаусс-Зейдель</b><span>итерационный подход для больших систем</span></div>
  <div><b>Невязка</b><span>практическая проверка качества</span></div>
</div>

<p class="final-line">Спасибо за внимание.</p>
