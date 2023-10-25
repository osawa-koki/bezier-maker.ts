/* eslint-disable @typescript-eslint/no-non-null-assertion */

/** ベジェ曲線の公式を表示する`Div`要素。 */
export const bezierFormulaBox = document.getElementById('bezierFormulaBox')! as HTMLDivElement
/** デモ用のベジェ曲線を表示する`SVG`要素。 */
export const currentdemoSVG = document.getElementById('currentdemoSVG')! as unknown as SVGSVGElement
/** デモ用のベジェ曲線を表示する`path`要素。 */
export const currentdemoPath = document.getElementById('currentdemoPath')! as unknown as SVGPathElement

/** 実行ボタン。 */
export const mainLeftButton = document.getElementById('mainLeftButton')! as HTMLButtonElement
/** リセットボタン。 */

export const mainRightButton = document.getElementById('mainRightButton')! as HTMLButtonElement
/** グリッドの分割数を設定する`input`要素。 */
export const gridWidth = document.getElementById('gridWidth')! as HTMLInputElement
/** グリッドの濃さを設定する`input`要素。 */
export const gridDense = document.getElementById('gridDense')! as HTMLInputElement
/** アニメーションの速さを設定する`input`要素。 */
export const speed = document.getElementById('speed')! as HTMLInputElement
/** アニメーションの間隔を設定する`input`要素。 */
export const interval = document.getElementById('interval')! as HTMLInputElement

/** グリッドの幅を表示する`span`要素。 */
export const gridWidthShow = document.getElementById('gridWidthShow')! as HTMLSpanElement
/** アニメーションの速さを表示する`span`要素。 */
export const speedShow = document.getElementById('speedShow')! as HTMLSpanElement
/** アニメーションの間隔を表示する`span`要素。 */
export const intervalShow = document.getElementById('intervalShow')! as HTMLSpanElement
/** グリッドの濃さを表示する`span`要素。 */
export const gridDenseShow = document.getElementById('gridDenseShow')! as HTMLSpanElement

/** グリッドを表示する`g`要素。 */
export const groupOfLines = document.getElementById('groupOfLines')! as unknown as SVGGElement
/** 説明用の線を表示する`g`要素。 */
export const groupOfExplanator = document.getElementById('groupOfExplanator')! as unknown as SVGGElement
/** ハンドラーを表示する`g`要素。 */
export const groupOfhandler = document.getElementById('groupOfhandler')! as unknown as SVGGElement

/** 実行中の円を表示する`circle`要素。 */
export const runningCircle = document.getElementById('runningCircle')! as unknown as SVGCircleElement
/** 赤い進捗バーを表示する`path`要素。 */
export const progressorRed = document.getElementById('progressorRed')! as unknown as SVGPathElement
/** 赤い進捗バーのパーセントを表示する`text`要素。 */
export const progressorRedCounter = document.getElementById('progressorRedCounter')! as unknown as SVGTextElement
/** 青い進捗バーを表示する`path`要素。 */
export const progressorBlue = document.getElementById('progressorBlue')! as unknown as SVGPathElement
/** 赤い進捗バーの縦線を表示する`line`要素。 */
export const progressorRedLine = document.getElementById('progressorRedLine')! as unknown as SVGLineElement
/** 青い進捗バーの縦線を表示する`line`要素。 */
export const progressorBlueLine = document.getElementById('progressorBlueLine')! as unknown as SVGLineElement

/** メインの`div`要素。 */
export const mainWindow = document.getElementById('mainWindow')! as HTMLDivElement
/** テンプレートを表示する`div`要素。 */
export const templateWindow = document.getElementById('templateWindow')! as HTMLDivElement
/** ログを表示する`div`要素。 */
export const logWindow = document.getElementById('logWindow')! as HTMLDivElement
/** デモ用の`div`要素。 */
export const mainRightBottomFrame = document.getElementById('mainRightBottomFrame')! as HTMLDivElement

/** メインデモのベジェ曲線。 */
export const bezier = document.getElementById('bezier')! as unknown as SVGPathElement

/** 比較デモのアニメーション速度を設定する`input`タグ。 */
export const XSpeed = document.getElementById('X_speed')! as HTMLInputElement
/** 比較デモの実行回数を設定する`input`タグ。 */
export const XTimes = document.getElementById('X_times')! as HTMLInputElement
/** 比較デモの色を設定する`input`タグ。 */
export const XColor = document.getElementById('X_color')! as HTMLInputElement
/** リニア線の有無を設定する`input`タグ。 */
export const XLine = document.getElementById('X_line')! as HTMLInputElement

/** 比較デモのアニメーション速度を表示する`td`要素。 */
export const XSpeedShow = document.getElementById('X_speedShow')! as HTMLTableCellElement
/** 比較デモの実行回数を表示する`td`要素。 */
export const XTimesShow = document.getElementById('X_timesShow')! as HTMLTableCellElement
/** 比較デモの色を表示する`td`要素。 */
export const XColorShow = document.getElementById('X_colorShow')! as HTMLTableCellElement
/** 比較デモの線の太さを表示する`td`要素。 */
export const XColorParent = document.getElementById('X_colorParent')! as HTMLTableRowElement
/** リニア線の有無を表示する`td`要素。 */
export const XLineShow = document.getElementById('X_lineShow')! as HTMLTableCellElement

/* eslint-enable @typescript-eslint/no-non-null-assertion */
