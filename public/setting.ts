/** ログを表示する`svg`要素。 */
export const handlers: {
  /** ハンドラーを表示する`circle`要素。 */
  circles: SVGCircleElement[]
  /** ハンドラーを表示する`polyline`要素。 */
  polylines: SVGPolylineElement[]
} = {
  circles: [],
  polylines: []
}

/** ストップウォッチに関するオブジェクト。 */
export const stopwatchObject: {
  /** インターバルのID。 */
  intervalId: number | undefined
  /** カウンター。 */
  counter: number
  /** カウンターを初期値に戻す。 */
  reset: () => void
} = {
  intervalId: undefined,
  counter: 0,
  reset: function () { this.counter = 0 }
}
