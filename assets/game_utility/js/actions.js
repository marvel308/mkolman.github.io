function getFullscreenBg() {
    let container = document.createElement("div");
    container.className = "fullscreen-bg";

    let close = document.createElement("div");
    close.innerHTML = "✕";
    close.className = "fullscreen-close";
    close.addEventListener("click", () => container.remove())
    container.appendChild(close);

    document.body.appendChild(container);
    return container;
}

function fullscreenify(element) {
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    if ((window.innerWidth < window.innerHeight) != (width < height)) {
        let tmp = width;
        width = height;
        height = tmp;
        element.className += " vertical";
    }
    element.className += " fullscreenify";
    let zoom = Math.min(window.innerWidth/width, window.innerHeight/height);
    element.style.zoom = zoom * 0.9 * 100 + "%";
    element.style.opacity = 1;
}

function showFullscreenText(txt) {
    let container = getFullscreenBg();
    let txtSpan = document.createElement("span");
    txtSpan.innerHTML = txt;
    txtSpan.style.opacity = 0;
    container.prepend(txtSpan);
    // Hack: wait for txtSpan to render :(
    setTimeout(() => fullscreenify(txtSpan), 50);
    return container;
}

function showFullscreenInput() {
    let container = getFullscreenBg();
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    container.appendChild(input);
    input.focus();

    let showBtn = document.createElement("div");
    showBtn.className = "jo-btn";
    showBtn.innerHTML = "<span>SHOW</span>";
    showBtn.addEventListener("click", () => showFullscreenText(input.value));
    container.appendChild(showBtn);
}

function showFullscreenCanvas() {
    let container = getFullscreenBg();
    let canvas = document.createElement("canvas");
    canvas.className = "fullscreen-bg";
    canvas.width = 2*window.innerWidth;
    canvas.height = 2*window.innerHeight;
    container.prepend(canvas);
    initializeDraw(canvas);
}

function randomElement(collection) {
   return collection[Math.floor(Math.random() * collection.length)];
}
function countDown(numSeconds, callback) {
    if (numSeconds == 0) {
        callback();
        return;
    }
    let container = showFullscreenText(numSeconds + "");
    setTimeout(() => {
        if (document.contains(container)) {
            container.remove();
            countDown(numSeconds-1, callback);
        }
    }, 1000);
}
function showRandomWord() {
    let word = randomElement(WORDLIST);
    countDown(3, () => showFullscreenText(word));
}
