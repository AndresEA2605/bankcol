(() => {
  // --- Modal logic
  const openers = [document.getElementById("openAuth"), document.getElementById("openAuth2")].filter(Boolean);
  const modal = document.getElementById("auth");
  const closeBtn = document.getElementById("closeAuth");
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.querySelector(".key").focus();
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  openers.forEach(b => b.addEventListener("click", openModal));
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => { if (!modal.hidden && e.key === "Escape") closeModal(); });

  // Trap focus simple
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusables = modal.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])');
    const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });

  // --- Grid keyboard navigation
  const grid = document.getElementById("grid");
  const cards = Array.from(grid.querySelectorAll(".card"));
  function indexToCoord(i, cols) { return { r: Math.floor(i/cols), c: i%cols }; }
  function coordToIndex(r, c, cols) { return r*cols + c; }
  function getCols() {
    const style = getComputedStyle(grid);
    const cols = style.gridTemplateColumns.split(" ").length;
    return Math.max(1, cols);
  }
  grid.addEventListener("keydown", (e) => {
    const i = cards.indexOf(document.activeElement);
    if (i < 0) return;
    const cols = getCols();
    let {r,c} = indexToCoord(i, cols);
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowLeft") c = Math.max(0, c-1);
    if (e.key === "ArrowRight") c = Math.min(cols-1, c+1);
    if (e.key === "ArrowUp") r = Math.max(0, r-1);
    if (e.key === "ArrowDown") r = Math.min(Math.ceil(cards.length/cols)-1, r+1);
    const j = coordToIndex(r, c, cols);
    const next = cards[Math.min(cards.length-1, j)];
    if (next) next.focus();
  });

  // --- PIN UI (adaptado del CodePen indicado)
  const CORRECT_PIN = "2580";
  const MAX_TRIES = 3;
  let buffer = "";
  let tries = MAX_TRIES;

  const dots = [...document.querySelectorAll(".dot")];
  const keypad = document.querySelector(".keypad");
  const msg = document.getElementById("message");
  const triesEl = document.getElementById("tries");
  const panel = document.querySelector(".modal__panel");

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("filled", i < buffer.length));
  }
  function setMessage(text, type = "") {
    msg.textContent = text;
    msg.className = "message " + type;
  }
  function clearBuffer(anim = false) {
    buffer = "";
    updateDots();
    if (anim) {
      panel.classList.remove("shake");
      void panel.offsetWidth;
      panel.classList.add("shake");
    }
  }
  function lock() {
    keypad.classList.add("locked");
    setMessage("Bloqueado temporalmente. Intenta más tarde.", "err");
  }

  keypad.addEventListener("click", (e) => {
    const key = e.target.closest("button");
    if (!key) return;
    const action = key.dataset.action;
    const digit = key.dataset.key;

    if (digit) {
      if (buffer.length < 4) {
        buffer += digit;
        updateDots();
        setMessage("");
      }
      return;
    }
    if (action === "clear") {
      clearBuffer();
    } else if (action === "enter") {
      if (buffer.length !== 4) {
        setMessage("El PIN debe tener 4 dígitos.", "err");
        clearBuffer(true);
        return;
      }
      if (buffer === CORRECT_PIN) {
        setMessage("Acceso concedido. ¡Bienvenido!", "ok");
        keypad.classList.add("locked");
        setTimeout(() => { closeModal(); }, 600);
      } else {
        tries--;
        triesEl.textContent = String(tries);
        setMessage("PIN incorrecto.", "err");
        clearBuffer(true);
        if (tries <= 0) lock();
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (keypad.classList.contains("locked")) return;
    if (/^[0-9]$/.test(e.key)) {
      if (buffer.length < 4) {
        buffer += e.key;
        updateDots();
      }
    } else if (e.key === "Backspace") {
      buffer = buffer.slice(0, -1);
      updateDots();
    } else if (e.key === "Enter") {
      modal.querySelector('[data-action="enter"]').click();
    }
  });
})();