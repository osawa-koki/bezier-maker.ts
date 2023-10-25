/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { NAMESPACE_OF_SVG } from './const.js'

export function mkElms (...tagNames: string[]): HTMLElement[] {
  return tagNames.map((tagName) => document.createElement(tagName))
}

export function mkSVGElm (tagName: string): SVGElement {
  return document.createElementNS(NAMESPACE_OF_SVG, tagName)
}

export function mkSVGElms (...tagNames: string[]): SVGElement[] {
  return tagNames.map((tagName) => mkSVGElm(tagName))
}

export function removeChildren (elm: HTMLElement): void {
  while (elm.firstChild != null) {
    elm.removeChild(elm.firstChild)
  }
}

export function round (n: number): (i: number) => number {
  return i => Math.round(i * n) / n
}

export const round100 = round(100)

/* eslint-enable @typescript-eslint/no-non-null-assertion */
