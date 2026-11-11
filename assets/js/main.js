const albumButtons = document.querySelectorAll(".album-thumb");

const modal = document.getElementById("albumModal");
const modalBackdrop = modal.querySelector(".album-modal-backdrop");
const modalClose = modal.querySelector(".album-modal-close");

const modalCover = modal.querySelector(".album-modal-cover");
const modalTitle = modal.querySelector("#albumModalTitle");
const modalArtist = modal.querySelector(".album-modal-artist");
const modalStatus = modal.querySelector(".album-modal-status");
const modalDescription = modal.querySelector(".album-modal-description");
const modalEpigraph = modal.querySelector(".album-modal-epigraph");
const modalStory = modal.querySelector(".album-modal-story");
const modalLink = modal.querySelector(".album-modal-link");

function openAlbumModal(album) {
    const {
        cover,
        title,
        artist,
        status,
        description,
        link
    } = album.dataset;

    modalCover.src = cover;
    modalCover.alt = `${title} by ${artist}`;

    modalTitle.textContent = title;
    modalArtist.textContent = artist;
    modalStatus.textContent = status;
    modalDescription.textContent = description;

    modalEpigraph.hidden = !album.dataset.epigraph;
    modalEpigraph.textContent = album.dataset.epigraph || "";
    modalStory.hidden = !album.dataset.storyUrl;
    if (album.dataset.storyUrl) modalStory.href = album.dataset.storyUrl;

    if (link) {
        modalLink.href = link;
        modalLink.classList.remove("is-hidden");
    } else {
        modalLink.classList.add("is-hidden");
    }

    modal.querySelector(".album-modal-content").scrollTop = 0;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}

function closeAlbumModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}

albumButtons.forEach((button) => {
    button.addEventListener("click", () => {
        openAlbumModal(button);
    });
});

modalClose.addEventListener("click", closeAlbumModal);
modalBackdrop.addEventListener("click", closeAlbumModal);

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        modal.classList.contains("is-open")
    ) {
        closeAlbumModal();
    }
});