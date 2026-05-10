/**
 * Client-side UI deterrents only. Anyone can bypass via browser menus,
 * extensions, or remote debugging — never use this to protect secrets.
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
