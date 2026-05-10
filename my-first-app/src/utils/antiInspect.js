/**
 * Client-side deterrents only — easy to bypass; never rely on this for secrets.
 */

export function initAntiInspect() {
  const onContextMenu = (e) => {
    e.preventDefault()
  }

  const onKeyDown = (e) => {
    const k = typeof e.key === 'string' ? e.key.toUpperCase() : ''

    if (e.key === 'F12') {
      e.preventDefault()
      return
    }

    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(k)) {
      e.preventDefault()
      return
    }

    if (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(k)) {
      e.preventDefault()
      return
    }

    if (e.ctrlKey && k === 'U') {
      e.preventDefault()
      return
    }
  }

  document.addEventListener('contextmenu', onContextMenu, { capture: true })
  document.addEventListener('keydown', onKeyDown, { capture: true })
}

/** Heuristic: docked DevTools often change inner vs outer size; undocked/remote bypass. */
export function enableAntiInspect() {
  const detect = () => {
    const devtoolsOpen =
      window.outerWidth - window.innerWidth > 160 ||
      window.outerHeight - window.innerHeight > 160

    if (devtoolsOpen) {
      document.body.innerHTML = `
        <div style="
          height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background:#000;
          color:#fff;
          font-size:28px;
        ">
          Access Restricted
        </div>
      `

      window.stop()
    }
  }

  detect()
  setInterval(detect, 500)
}
