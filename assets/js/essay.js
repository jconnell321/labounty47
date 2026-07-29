const progressBar = document.querySelector(".reading-progress-bar");
const essay = document.querySelector(".essay");

function updateReadingProgress() {
    if (!progressBar || !essay) {
        return;
    }

    const essayTop = essay.offsetTop;
    const essayHeight = essay.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollableEssayHeight = Math.max(
        essayHeight - viewportHeight,
        1
    );

    const distanceThroughEssay = window.scrollY - essayTop;

    const progress = Math.min(
        Math.max(distanceThroughEssay / scrollableEssayHeight, 0),
        1
    );

    progressBar.style.width = `${progress * 100}%`;
}

let progressUpdateRequested = false;

function requestProgressUpdate() {
    if (progressUpdateRequested) {
        return;
    }

    progressUpdateRequested = true;

    window.requestAnimationFrame(() => {
        updateReadingProgress();
        progressUpdateRequested = false;
    });
}

window.addEventListener("scroll", requestProgressUpdate, {
    passive: true
});

window.addEventListener("resize", requestProgressUpdate);

updateReadingProgress();