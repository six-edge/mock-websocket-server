const app = document.getElementById("app")

export function log(msg, data = "") {
  const str = JSON.stringify(data, null, 2)
  const p = document.createElement('p')
  const out = data ? `${msg}: ${str}` : msg
  p.innerHTML = out
  p.className = 'log'
  app.prepend(p)
  p.clientHeight;
  p.className = 'log fadeIn'
}
