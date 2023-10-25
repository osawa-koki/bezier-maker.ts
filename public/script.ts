

import { getElms, mkElms, mkSVGElm, mkSVGElms, removeChildren, round100 } from "./functions.js";
import { NAMESPACE_OF_SVG, SPACE } from "./const.js";

// define const values.
const [SVG_SIZE_MIN, SVG_SIZE_MAX] = [0, 300];

/** ベジェ曲線の公式を表示する`Div`要素。 */
const bezierFormulaBox = document.getElementById("bezierFormulaBox")! as HTMLDivElement;
/** デモ用のベジェ曲線を表示する`SVG`要素。 */
const currentdemoSVG = document.getElementById("currentdemoSVG")! as unknown as SVGSVGElement;
/** デモ用のベジェ曲線を表示する`path`要素。 */
const currentdemoPath = document.getElementById("currentdemoPath")! as unknown as SVGPathElement;

/** 実行ボタン。 */
const mainLeftButton = document.getElementById("mainLeftButton")! as HTMLButtonElement;
/** リセットボタン。 */
const mainRightButton = document.getElementById("mainRightButton")! as HTMLButtonElement;
/** グリッドの分割数を指定する`input`要素。 */
const gridWidth = document.getElementById("gridWidth")! as HTMLInputElement;
/** グリッドの濃さを指定する`input`要素。 */
const gridDense = document.getElementById("gridDense")! as HTMLInputElement;
/** アニメーションの速さを指定する`input`要素。 */
const speed = document.getElementById("speed")! as HTMLInputElement;
/** アニメーションの間隔を指定する`input`要素。 */
const interval = document.getElementById("interval")! as HTMLInputElement;

/** グリッドの幅を表示する`span`要素。 */
const gridWidthShow = document.getElementById("gridWidthShow")! as HTMLSpanElement;
/** アニメーションの速さを表示する`span`要素。 */
const speedShow = document.getElementById("speedShow")! as HTMLSpanElement;
/** アニメーションの間隔を表示する`span`要素。 */
const intervalShow = document.getElementById("intervalShow")! as HTMLSpanElement;
/** グリッドの濃さを表示する`span`要素。 */
const gridDenseShow = document.getElementById("gridDenseShow")! as HTMLSpanElement;

/** グリッドを表示する`g`要素。 */
const groupOfLines = document.getElementById("groupOfLines")! as unknown as SVGGElement;
/** ベジェ曲線を表示する`g`要素。 */
const groupOfBezier = document.getElementById("groupOfBezier")! as unknown as SVGGElement;
/** 説明用の線を表示する`g`要素。 */
const groupOfExplanator = document.getElementById("groupOfExplanator")! as unknown as SVGGElement;
/** ハンドラーを表示する`g`要素。 */
const groupOfhandler = document.getElementById("groupOfhandler")! as unknown as SVGGElement;

/** 実行中の円を表示する`circle`要素。 */
const runningCircle = document.getElementById("runningCircle")! as unknown as SVGCircleElement;
/** 赤い進捗バーを表示する`path`要素。 */
const progressorRed = document.getElementById("progressorRed")! as unknown as SVGPathElement;
/** 赤い進捗バーのパーセントを表示する`text`要素。 */
const progressorRedCounter = document.getElementById("progressorRedCounter")! as unknown as SVGTextElement;
/** 青い進捗バーを表示する`path`要素。 */
const progressorBlue = document.getElementById("progressorBlue")! as unknown as SVGPathElement;
/** 赤い進捗バーの縦線を表示する`line`要素。 */
const progressorRedLine = document.getElementById("progressorRedLine")! as unknown as SVGLineElement;
/** 青い進捗バーの縦線を表示する`line`要素。 */
const progressorBlueLine = document.getElementById("progressorBlueLine")! as unknown as SVGLineElement;

/** メインの`div`要素。 */
const mainWindow = document.getElementById("mainWindow")! as HTMLDivElement;
/** テンプレートを表示する`div`要素。 */
const templateWindow = document.getElementById("templateWindow")! as HTMLDivElement;
/** ログを表示する`div`要素。 */
const logWindow = document.getElementById("logWindow")! as HTMLDivElement;
/** デモ用の`div`要素。 */
const mainRightBottomFrame = document.getElementById("mainRightBottomFrame")! as HTMLDivElement;

/** メインデモのベジェ曲線。 */
const bezier = document.getElementById("bezier")! as unknown as SVGPathElement;

/** ログを表示する`svg`要素。 */
const handlers: {
  circles: SVGCircleElement[],
  polylines: SVGPolylineElement[],
} = {
	circles: [],
	polylines: [],
};

// init
putLines();
setDefault();
bezierSync();
currentImporter();

/**
 * メインデモキャンバスのグリッド線を最新の値に更新する。
 */
function putLines(): void {
	removeChildren(groupOfLines as unknown as HTMLElement);
	const range: number = parseInt(gridWidth.value);
	gridWidthShow.textContent = `${range}等分`;
	for (let i = SVG_SIZE_MIN; i < SVG_SIZE_MAX; i = i + SVG_SIZE_MAX / range) {
		const [h, v] = mkSVGElms("line", "line");
		h.setAttribute("x1", SVG_SIZE_MIN.toString());
		h.setAttribute("x2", SVG_SIZE_MAX.toString());
		["y1", "y2"].map((element) => h.setAttribute(element, i.toString()));
		v.setAttribute("y1", SVG_SIZE_MIN.toString());
		v.setAttribute("y2", SVG_SIZE_MAX.toString());
		["x1", "x2"].map((element) => v.setAttribute(element, i.toString()))
    groupOfLines.appendChild(h);
    groupOfLines.appendChild(v);
		setDense();
	}
}

/**
 * メインデモキャンバスのハンドラーを初期値に戻す。
 */
function setDefault() {
	const cxcy = [50, 100, 250, 200]; // default bezier value.
  for (let i = 0; i < 2; i++) {
    const circle = document.createElementNS(NAMESPACE_OF_SVG, "circle");
    const circleSettings: { [key: string]: number } = {
      "r" : 15,
      "cx" : cxcy[i * 2],
      "cy" : cxcy[i * 2 + 1],
    };
    for (const circleSetting in circleSettings) {
      circle.setAttribute(circleSetting, circleSettings[circleSetting].toString());
    }
    circle.addEventListener("mousedown", mousedown, false);
    const polyline = document.createElementNS(NAMESPACE_OF_SVG, "polyline");
    groupOfhandler.appendChild(polyline);
    groupOfhandler.appendChild(circle);
    handlers.circles.push(circle);
    handlers.polylines.push(polyline);
  }
	manipuratorSync();
}

/**
 * ベジェ曲線を最新の値に更新して、ベジェ曲線の制御点の座標を返す。
 * @returns {string[]} ベジェ曲線の制御点の座標。
 */
function bezierSync(): string[] {
	const pointsContainer = [];
  for (const circle of handlers.circles) {
    const points = [];
    points.push(circle.getAttribute("cx"));
    points.push(circle.getAttribute("cy"));
    pointsContainer.push(points.join(SPACE));
  }
	bezier.setAttribute("d", `m ${SVG_SIZE_MIN} ${SVG_SIZE_MAX} C ${pointsContainer.join(", ")}, ${SVG_SIZE_MAX} ${SVG_SIZE_MIN}`);
	return pointsContainer;
}

// ##### イベントハンドラの登録。
// 実行ボランがクリックされたら、デモを実行する。
mainLeftButton.addEventListener("click", exec);
// グリッド幅の値が変更されたら、デモキャンバスのグリッド線を更新する。
gridWidth.addEventListener("input", putLines);
// グリッドの濃さが変更されたら、グリッド線の濃さを更新する。
gridDense.addEventListener("input", setDense);
// アニメーションの速さの値が変更されたら、その値の表示を更新する。
speed.addEventListener("input", () => {
  speedShow.textContent = `${parseFloat(speed.value).toFixed(1)}秒`
});
// アニメーションの間隔の値が変更されたら、その値の表示を更新する。
interval.addEventListener("input", () => {
  intervalShow.textContent = (parseInt(interval.value) <= 3) ? "低" : (parseInt(interval.value) <= 7) ? "中" : "高"
});

/**
 * グリッド線の濃さを最新の値に更新する。
 */
function setDense() {
	Array.from(groupOfLines.getElementsByTagName("line")).forEach(line => {
		line.style.stroke = `rgba(0, 0, 0, ${parseInt(gridDense.value) * 0.05})`;
	});
	gridDenseShow.style.backgroundColor = `rgba(0, 0, 0, ${parseInt(gridDense.value) * 0.05})`;
}

/**
 * マンピュレーターに対して、マウスダウンされた際に実行される関数。
 * @param event
 */
function mousedown(this: any, event: MouseEvent) {
	event.preventDefault();
	removeChildren(groupOfExplanator as unknown as HTMLElement);
	this.setAttribute("r", 20);
	this.style.fill = "red";
	this.addEventListener("mousemove", mousemove, false);
	this.parentNode.appendChild(this); // マウスダウンされたハンドラーを最前面に表示する。
	this.addEventListener("mouseup", mouseup, false);
	this.addEventListener("mouseleave", mouseup, false);
	truncAndImport(false);
}

/**
 * マンピュレーターに対して、マウスが動いた際に実行される関数。
 * @param event
 */
function mousemove(this: any, event: MouseEvent) {
	event.preventDefault();
	this.setAttribute("cx", event.offsetX);
	this.setAttribute("cy", event.offsetY);
	manipuratorSync();
	if (event.offsetX < SVG_SIZE_MIN - 10 || SVG_SIZE_MAX + 10 < event.offsetX) {
		this.removeEventListener("mousemove", mousemove, false);
		this.removeEventListener("touchmove", mousemove, false);
		this.setAttribute("cx", (event.offsetX < SVG_SIZE_MIN) ? SVG_SIZE_MIN : SVG_SIZE_MAX);
		manipuratorSync();
	}
	mousemove_mouseup_common();
}

/**
 * マンピュレーターに対して、マウスアップされた際に実行される関数。
 * @param event
 */
function mouseup(this: any, event: MouseEvent) {
	event.preventDefault();
	this.removeEventListener("mousemove", mousemove, false);
	this.removeEventListener("touchmove", mousemove, false);
	this.setAttribute("r", 15);
	this.style.fill = "yellow";
	this.removeEventListener("mouseup", mouseup);
	this.removeEventListener("mouseleave", mouseup);
	if (event.offsetX < SVG_SIZE_MIN || SVG_SIZE_MAX < event.offsetX) {
		this.setAttribute("cx", (event.offsetX < SVG_SIZE_MIN) ? SVG_SIZE_MIN : SVG_SIZE_MAX);
	}
	manipuratorSync();
	putLogSVG();
}

/**
 * マニピュレーターの各操作に対して、共通の処理を実行するための関数。
 */
function mousemove_mouseup_common() {
	bezierSync();
	const positions = obtainManipulatorPositions();
	bezierFormulaBox.textContent = `cubic-bezier(${round100(positions[1][0] / SVG_SIZE_MAX)}, ${round100((1 - (positions[1][1] / SVG_SIZE_MAX)))}, ${round100(positions[2][0] / SVG_SIZE_MAX)}, ${round100(1 - (positions[2][1] / SVG_SIZE_MAX))})`;
	currentImporter();
}

/**
 * マニピュレーターの位置に、ベジェ曲線を同期させる。
 */
function manipuratorSync() {
  for (let i = 0; i < 2; i++) {
    const polyline = handlers.polylines[i];
    const polylineSettings: { [key: string]: string } = {
      points : `${(i === 0) ? SVG_SIZE_MIN : SVG_SIZE_MAX} ${(i === 1) ? SVG_SIZE_MIN : SVG_SIZE_MAX}, ${handlers.circles[i].getAttribute("cx")} ${handlers.circles[i].getAttribute("cy")}`,
    }
    for (const polylineSetting in polylineSettings) {
      polyline.setAttribute(polylineSetting, polylineSettings[polylineSetting]);
    }
  }
}

function exec(this: any) {
	this.removeEventListener("click", exec);
	this.addEventListener("click", pause);
	this.textContent = "一時停止";
	Array.from(groupOfhandler.getElementsByTagName("circle")).forEach(e => e.removeEventListener("mousedown", mousedown));
	bezierSync();
	recursiveInitiator(obtainManipulatorPositions());
}

/**
 * マニピュレーターの位置を取得する。
 * @returns マニピュレーターの位置。
 */
function obtainManipulatorPositions(): number[][] {
	const positions = [];
	positions.push([SVG_SIZE_MIN, SVG_SIZE_MAX]);
	positions.push([
    parseInt(handlers.circles[0]!.getAttribute("cx")!),
    parseInt(handlers.circles[0]!.getAttribute("cy")!)
  ]);
	positions.push([
    parseInt(handlers.circles[1]!.getAttribute("cx")!),
    parseInt(handlers.circles[1]!.getAttribute("cy")!)
  ]);
	positions.push([SVG_SIZE_MAX, SVG_SIZE_MIN]);
	return positions;
}

/**
 * 実行中のアニメーションを一時停止させる。
 */
function pause(this: any): void{
	clearInterval(stopwatchObject.intervalId);
	this.removeEventListener("click", pause);
	this.addEventListener("click", restart);
	this.textContent = "再実行"
}

/**
 * 一時停止中のアニメーションを再実行させる。
 */
function restart(this: any) {
	this.removeEventListener("click", restart);
	this.addEventListener("click", pause);
	this.textContent = "一時停止"
	recursiveInitiator(obtainManipulatorPositions(), false);
}

const stopwatchObject: {
  intervalId: number | undefined,
  counter: number,
  reset: () => void,
} = {
	intervalId: undefined,
	counter: 0,
	reset: function() {this.counter = 0;}
};

function recursiveInitiator(points: number[][], tf = true) {
	const intervalValue = interval.value;
	const speedValue = parseInt(speed.value) * 1000;
	const span = 50 + (5 - parseInt(intervalValue)) * 5;
	const realSpeed = speedValue / span;
	if (tf) {
		const polyline = document.createElementNS(NAMESPACE_OF_SVG, "polyline");
		polyline.setAttribute("points", points.map(j => j.join(",")).join(SPACE));
		groupOfExplanator.appendChild(polyline);
    for (let i = 0; i < points.length; i++) {
      const polyline = mkSVGElm("polyline");
      groupOfExplanator.appendChild(polyline);
    }
		runningCircle.classList.add("ok");
		runningCircle.setAttribute("cx", SVG_SIZE_MIN.toString());
		runningCircle.setAttribute("cy", SVG_SIZE_MAX.toString());
		stopwatchObject.reset();
	}
	stopwatchObject.intervalId = setInterval(() => {
		recursiveMain(points, stopwatchObject.counter / realSpeed);
		stopwatchObject.counter++;
		if(realSpeed < stopwatchObject.counter) stopInterval();
	}, span);
}

/**
 * 実行中のアニメーションを停止させる。
 */
function stopInterval() {
	mainLeftButton.removeEventListener("click", pause);
	mainLeftButton.addEventListener("click", exec);
	mainLeftButton.textContent = "実行";
	Array.from(groupOfhandler.getElementsByTagName("circle")).forEach(circle => circle.addEventListener("mousedown", mousedown, false));
	truncAndImport();
}

/**
 * 実行中のアニメーションを停止させ、進捗バーを初期値に戻す。
 * @param tf - `true`の場合、進捗バーを初期値に戻す。
 */
function truncAndImport(tf = true) {
	clearInterval(stopwatchObject.intervalId);
	mainLeftButton.removeEventListener("click", pause);
	mainLeftButton.removeEventListener("click", restart);
	mainLeftButton.addEventListener("click", exec);
	mainLeftButton.textContent = "実行";
	runningCircle.classList.remove("ok");
	runningCircle.setAttribute("cx", (SVG_SIZE_MIN - 10).toString());
	runningCircle.setAttribute("cy", (SVG_SIZE_MAX + 10).toString());
	const xx = (tf) ? SVG_SIZE_MAX : SVG_SIZE_MIN;
	const yy = (tf) ? SVG_SIZE_MIN : SVG_SIZE_MAX;
	progressorRed.setAttribute("d", `m -5 ${yy}, -10 -10 h-10 v20 h10 z`);
	progressorRedCounter.textContent = `${((SVG_SIZE_MAX - yy) / 3).toFixed(0)}%`;
	progressorRedLine.setAttribute("x2", xx.toString());
	progressorRedLine.setAttribute("y1", yy.toString());
	progressorRedLine.setAttribute("y2", yy.toString());
	progressorBlue.setAttribute("d", `m ${xx} 305, -10 10 v10 h20 v-10 z`);
	progressorBlueLine.setAttribute("x1", xx.toString());
	progressorBlueLine.setAttribute("x2", xx.toString());
	progressorBlueLine.setAttribute("y2", yy.toString());
}

function recursiveMain(points: number[][], proportion: number) {
	if (points.length === 1) return;
	const targetLine = groupOfExplanator.getElementsByTagName("polyline")[5 - points.length];
	const dComponents = [];
  for (let i = 0; i < points.length - 1; i++) {
    const x = (points[i + 1][0] - points[i][0]) * proportion + points[i][0];
    const y = (points[i + 1][1] - points[i][1]) * proportion + points[i][1];
    dComponents.push([x, y]);
  }
	targetLine.setAttribute("points", dComponents.map(j => j.join(",")).join(" "));
	if (points.length === 2) {
		const xx = dComponents[0][0];
		const yy = dComponents[0][1];
		runningCircle.setAttribute("cx", xx.toString());
		runningCircle.setAttribute("cy", yy.toString());
		progressorRed.setAttribute("d", `m ${SVG_SIZE_MIN - 5} ${yy}, -10 -10 h-10 v20 h10 z`);
		progressorRedCounter.textContent = `${((SVG_SIZE_MAX - yy) / 3).toFixed(0)}%`;
		progressorRedLine.setAttribute("x2", xx.toString());
		progressorRedLine.setAttribute("y1", yy.toString());
		progressorRedLine.setAttribute("y2", yy.toString());
		progressorBlue.setAttribute("d", `m ${xx} ${SVG_SIZE_MAX + 5}, -10 10 v10 h20 v-10 z`);
		progressorBlueLine.setAttribute("x1", xx.toString());
		progressorBlueLine.setAttribute("x2", xx.toString());
		progressorBlueLine.setAttribute("y2", yy.toString());
	}
	recursiveMain(dComponents, proportion);
}

mainRightButton.addEventListener("click", doAnimation);

Array.from(document.getElementsByClassName("arrowBox")).map(arrowBox => arrowBox.addEventListener("click", function syncIcon(this: any) {
	const dValue = bezier.getAttribute("d")!.match(/-?\d+\.?\d*/g);
	const arrow = this.nextElementSibling.getElementsByClassName("bezier")[0];
	arrow.setAttribute("d", `m ${SVG_SIZE_MIN} ${SVG_SIZE_MAX} C${dValue![2]} ${dValue![3]}, ${dValue![4]} ${dValue![5]}, ${SVG_SIZE_MAX} ${SVG_SIZE_MIN}`);
}));

function animateIt(this: any, target: HTMLElement) {
	const targetBox = (this != window && this) ? this : target;
	const bezierLine = calcBezierFormula(targetBox.getElementsByTagName("path")[0].getAttribute("d"));
	const toAnimate: HTMLElement[] = Array.from(targetBox.nextElementSibling.getElementsByClassName("toAnimate"));
	toAnimate.forEach(mover => {
		mover.style.animationTimingFunction = (!targetBox.classList.contains("linearAnimation")) ? bezierLine : "linear";
		mover.addEventListener("animationend", finishedAnimation);
		mover.classList.add("onAnimation");
	});
}
function calcBezierFormula(target: string) {
	const _dElement = target.match(/-?\d+\.?\d*/g)!;
  const dElement = _dElement.map((i) => parseInt(i));
	return `cubic-bezier(${round100(dElement[2] / SVG_SIZE_MAX)}, ${round100((1 - (dElement[3] / SVG_SIZE_MAX)))}, ${round100(dElement[4] / SVG_SIZE_MAX)}, ${round100(1 - (dElement[5] / SVG_SIZE_MAX))})`;
}
function finishedAnimation(this: any) {
	this.classList.remove("onAnimation");
}
function doAnimation() {
  const icons: HTMLElement[] = Array.from(document.getElementsByClassName("icon")) as unknown as HTMLElement[];
  for (const icon of icons) {
    animateIt(icon);
  }
}

for (let i = 0; i < mainRightBottomFrame.getElementsByClassName("icon").length; i++) {
  const icon = mainRightBottomFrame.getElementsByClassName("icon")[i];
  icon.addEventListener("click", function(this: any) {
    animateIt(this);
  });
}

const X_speed = document.getElementById("X_speed")! as HTMLInputElement
const X_times = document.getElementById("X_times")! as HTMLInputElement
const X_color = document.getElementById("X_color")! as HTMLInputElement
const X_line = document.getElementById("X_line")! as HTMLInputElement

const X_speedShow = document.getElementById("X_speedShow")! as HTMLSpanElement
const X_timesShow = document.getElementById("X_timesShow")! as HTMLSpanElement
const X_colorShow = document.getElementById("X_colorShow")! as HTMLSpanElement
const X_colorParent = document.getElementById("X_colorParent")! as HTMLTableRowElement
const X_lineShow = document.getElementById("X_lineShow")! as HTMLSpanElement

const toAnimateItems: HTMLElement[] = Array.from(document.getElementsByClassName("toAnimate")) as unknown as HTMLElement[];
X_speed.addEventListener("input", function() {
	toAnimateItems.forEach(toAnimateItem => toAnimateItem.style.animationDuration = parseInt(this.value) * 1.5 + "s");
	X_speedShow.textContent = `${parseFloat(this.value).toFixed(1)}秒`;
});
X_times.addEventListener("input", function() {
	toAnimateItems.forEach(toAnimateItem => toAnimateItem.style.animationIterationCount = this.value);
	X_timesShow.textContent = `${this.value}回`;
});
X_color.addEventListener("change", function() {
	toAnimateItems.forEach(toAnimateItem => toAnimateItem.style.backgroundColor = `hsla(${this.value}, 100%, 50%, 1)`);
	X_color.style.backgroundColor = `hsla(${this.value}, 100%, 50%, 1)`;
	X_colorShow.style.backgroundColor = `hsla(${this.value}, 100%, 50%, 1)`;
	setTimeout(() => X_colorParent.style.backgroundColor = "transparent", 300);
});
X_color.addEventListener("input", function() {
	X_colorShow.style.backgroundColor = `hsla(${this.value}, 100%, 50%, 1)`;
});
X_line.addEventListener("change", function() {
	X_lineShow.textContent = (parseInt(this.value) === 1) ? "あり" : "なし";
	if (parseInt(this.value) === 1) {
		const pausedElement = document.getElementsByClassName("animationPaused");
    for (let i = 0; i < pausedElement.length; i++) {
      pausedElement[i].classList.add("toAnimate");
      pausedElement[i].classList.remove("animationPaused");
    }
	} else {
		const animationLinear = document.getElementsByClassName("linearAnimation");
    for (let i = 0; i < animationLinear.length; i++) {
      animationLinear[i].classList.add("animationPaused");
      animationLinear[i].classList.remove("toAnimate");
    }
	}
});

/**
 * ログを表示する`svg`要素を生成する。
 */
function putLogSVG(): void {
	const positions = bezierSync();
	const [svg, groupOfPaths, groupOfCircles, path] = mkSVGElms("svg", "g", "g", "path");
	svg.setAttribute("viewBox", "-50 -50 400 400");
	path.setAttribute("d", `m ${SVG_SIZE_MIN} ${SVG_SIZE_MAX} C ${positions.join(", ")}, ${SVG_SIZE_MAX} ${SVG_SIZE_MIN}`);
	groupOfPaths.appendChild(path);
	const xy = [[SVG_SIZE_MIN, SVG_SIZE_MAX], [SVG_SIZE_MAX, SVG_SIZE_MIN]];
  for (let i = 0; i < 2; i++) {
    const circle = mkSVGElm("circle");
    const circleSettings: { [key: string]: number } = {
      "r" : 30,
      "cx" : xy[i][0],
      "cy" : xy[i][1],
    };
    for (const circleSetting in circleSettings) {
      circle.setAttribute(circleSetting, circleSettings[circleSetting].toString());
    }
    groupOfCircles.appendChild(circle);
  }
  svg.appendChild(groupOfPaths);
  svg.appendChild(groupOfCircles);
	svg.addEventListener("click", logBack);
	logWindow.insertBefore(svg, logWindow.firstChild);
}

function logBack(this: any) {
	truncAndImport(false);
	const dAttr = this.getElementsByTagName("path")[0].getAttribute("d").match(/-?\d+\.?\d*/g).slice(2, 6); // マイナスも取得することを忘れずに!!
	const d = [dAttr.slice(0, 2), dAttr.slice(2, 4)];
  for (let i = 0; i < d.length; i++) {
    handlers.circles[i].setAttribute("cx", d[i][0]);
    handlers.circles[i].setAttribute("cy", d[i][1]);
  }
	scrollUp(dAttr);
	manipuratorSync();
	bezierSync();
	const ary = obtainManipulatorPositions();
	bezierFormulaBox.textContent = `cubic-bezier(${round100(ary[1][0] / SVG_SIZE_MAX)}, ${round100((1 - (ary[1][1] / SVG_SIZE_MAX)))}, ${round100(ary[2][0] / SVG_SIZE_MAX)}, ${round100(1 - (ary[2][1] / SVG_SIZE_MAX))})`;
	currentImporter();
}
function currentImporter() {
	const pointsContainer = [];
  for (let i = 0; i < 2; i++) {
    const points = [];
    const circle = handlers.circles[i];
    points.push(circle.getAttribute("cx"));
    points.push(circle.getAttribute("cy"));
    pointsContainer.push(points);
  }
	currentdemoPath.setAttribute("d", `m ${SVG_SIZE_MIN} ${SVG_SIZE_MAX} C ${pointsContainer.map(e => e.join(" ")).join(", ")}, ${SVG_SIZE_MAX} ${SVG_SIZE_MIN}`);
}

currentdemoSVG.addEventListener("click", function() {
  return animateIt(this as unknown as HTMLElement)
})

for (let i = 0; i < document.getElementsByClassName("currentDemoProgressor").length; i++) {
  document.getElementsByClassName("currentDemoProgressor")[i].addEventListener("animationend", finishedAnimation);
}

function putTemplate() {
	const templates: { [key: string]: number[][] } = {
		"linear" : [[0.0, 0.0], [1.0, 1.0]],
		"ease" : [[0.25, 0.1], [0.25, 1.0]],
		"ease-in" : [[0.42, 0], [1.0, 1.0]],
		"ease-out" : [[0.0, 0.0], [0.58, 1.0]],
		"オススメ１" : [[0.2, 0.2], [0.3, 1]],
		"オススメ２" : [[0.1, 0.2], [0.8, 0.9]],
		"オススメ３" : [[0.5, 0.5], [0.1, 0.8]],
		"オススメ４" : [[0.0, 0.3], [1.0, 1.0]],
		"オススメ５" : [[0.2, 0.2], [0.3, 0.9]],
	};
	for (let templateName in templates) {
		const [explanationBox, text] = mkElms("div", "div");
		const [svg, path, circle1, circle2] = mkSVGElms("svg", "path", "circle", "circle");
    const modifiedPoints = templates[templateName].map(points => points.map(point => point * SVG_SIZE_MAX));
		svg.setAttribute("viewBox", `-50 -50 400 400`);
		path.setAttribute("d", `m${SVG_SIZE_MIN} ${SVG_SIZE_MAX} C ${modifiedPoints[0][0]} ${SVG_SIZE_MAX - modifiedPoints[0][1]}, ${modifiedPoints[1][0]} ${SVG_SIZE_MAX - modifiedPoints[1][1]}, ${SVG_SIZE_MAX} ${SVG_SIZE_MIN}`);
		circle1.setAttribute("cx", SVG_SIZE_MIN.toString());
		circle1.setAttribute("cy", SVG_SIZE_MAX.toString());
		circle2.setAttribute("cx", SVG_SIZE_MAX.toString());
		circle2.setAttribute("cy", SVG_SIZE_MIN.toString());
    for (const circle of [circle1, circle2]) {
      circle.setAttribute("r", "20");
    }
		explanationBox.classList.add("explanationBox");
		text.textContent = templateName;
		text.classList.add("text");
		svg.addEventListener("click", logBack);
		// append([path, circle1, circle2], svg);
    svg.appendChild(path);
    svg.appendChild(circle1);
    svg.appendChild(circle2);
		// append([svg, text], explanationBox);
    explanationBox.appendChild(svg);
    explanationBox.appendChild(text);
		templateWindow.appendChild(explanationBox);
	};
}
putTemplate();

function scrollUp(d: number[]) {
	const positions = [d[0] / SVG_SIZE_MAX, 1 - d[1] / SVG_SIZE_MAX, d[2] / SVG_SIZE_MAX, 1 - d[3] / SVG_SIZE_MAX];
	const bezierPoints = calcBezier(positions);
	let count = 0;
	const scrolled = window.scrollY;
	const toWhere = window.pageYOffset + mainWindow.getBoundingClientRect().top;
	const needToScroll = toWhere - scrolled;
	function waitAndRun() {
		if (count < 100) {
			count++;
			scrollTo(0, scrolled + needToScroll * bezierPoints["y"][count]);
			setTimeout(waitAndRun, 15 * bezierPoints["x"][count]);
		}
	}
	waitAndRun();
}
function calcBezier(d: number[], step = 100, percent = true) {
	const answer: { [key: string]: number[] } = {
		"x" : [],
		"y" : [],
	};
	function recCalcPositions(ary: number[][], ppn: number) {
		if (ary.length === 1) return;
		const list = [];
		for (let i = 0; i < ary.length - 1; i++) {
			const x = (ary[i + 1][0] - ary[i][0]) * ppn + ary[i][0];
			const y = (ary[i + 1][1] - ary[i][1]) * ppn + ary[i][1];
			list.push([x, y]);
		}
		if (ary.length === 2) {
			answer["x"].push((percent) ? list[0][0] / 100 : list[0][0]);
			answer["y"].push((percent) ? list[0][1] / 100 : list[0][1]);
		} else {
			recCalcPositions(list, ppn);
		}
	}
	const positions = [[0, 0], [d[0], d[1]], [d[2], d[3]], [100, 100]];
	for (let i = 0; i <= step; i++) {
		recCalcPositions(positions, i / step);
	}
	return answer;
}
