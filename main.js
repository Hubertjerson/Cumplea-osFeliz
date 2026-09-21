const intro = document.getElementById("intro");
const experience = document.getElementById("experience");
const openButton = document.getElementById("openExperience");
const finalButton = document.getElementById("finalButton");
const secretMessage = document.getElementById("secretMessage");
const petalLayer = document.getElementById("petalLayer");
const petalButton = document.getElementById("petalButton");
const photo = document.getElementById("dennisPhoto");
const photoPlaceholder = document.getElementById("photoPlaceholder");

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createGarden(field, amount, compact) {
  if (!field) return;

  const flowers = ["🌼", "🌼", "🌼", "🌻"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < amount; i += 1) {
    const flower = document.createElement("span");
    flower.className = "garden-flower";
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.setProperty("--left", randomBetween(1, 96) + "%");
    flower.style.setProperty("--bottom", randomBetween(compact ? -8 : -3, compact ? 55 : 42) + "px");
    flower.style.setProperty("--size", randomBetween(compact ? 26 : 30, compact ? 46 : 54) + "px");
    flower.style.setProperty("--duration", randomBetween(2.4, 4.8) + "s");
    flower.style.setProperty("--delay", randomBetween(-3.5, 0) + "s");
    flower.style.zIndex = String(Math.floor(randomBetween(1, 6)));
    fragment.appendChild(flower);
  }

  field.appendChild(fragment);
}

function rainPetals(amount) {
  const symbols = ["🌼", "💛", "✨", "🌻"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < amount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.setProperty("--left", randomBetween(0, 98) + "vw");
    petal.style.setProperty("--size", randomBetween(14, 27) + "px");
    petal.style.setProperty("--opacity", randomBetween(0.55, 0.95).toFixed(2));
    petal.style.setProperty("--drift", randomBetween(-100, 100) + "px");
    petal.style.setProperty("--fall-duration", randomBetween(4.2, 7.2) + "s");
    petal.style.setProperty("--fall-delay", randomBetween(0, 1.1) + "s");
    fragment.appendChild(petal);

    window.setTimeout(function () {
      petal.remove();
    }, 8500);
  }

  petalLayer.appendChild(fragment);
}

function openGarden() {
  intro.classList.add("is-open");
  experience.classList.add("is-visible");
  experience.setAttribute("aria-hidden", "false");
  document.body.classList.remove("locked");
  petalButton.hidden = false;
  rainPetals(34);

  window.setTimeout(function () {
    intro.setAttribute("aria-hidden", "true");
  }, 850);
}

function revealSecret() {
  const alreadyVisible = secretMessage.classList.contains("is-visible");

  if (!alreadyVisible) {
    secretMessage.classList.add("is-visible");
    secretMessage.setAttribute("aria-hidden", "false");
    finalButton.innerHTML = "<span>Mensaje descubierto</span><span aria-hidden='true'>🌼</span>";
    finalButton.disabled = true;
    rainPetals(46);
  }
}

function setupPhotoFallback() {
  if (!photo) return;

  function showPlaceholder() {
    photo.style.display = "none";
    photoPlaceholder.style.display = "grid";
  }

  function showPhoto() {
    photo.style.display = "block";
    photoPlaceholder.style.display = "none";
  }

  photo.addEventListener("error", showPlaceholder);
  photo.addEventListener("load", showPhoto);

  if (photo.complete) {
    if (photo.naturalWidth > 0) {
      showPhoto();
    } else {
      showPlaceholder();
    }
  }
}

function setupRevealObserver() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px"
  });

  items.forEach(function (item) {
    observer.observe(item);
  });
}

createGarden(document.getElementById("introFlowers"), 24, false);
createGarden(document.getElementById("mainFlowerField"), 34, true);
setupPhotoFallback();
setupRevealObserver();

openButton.addEventListener("click", openGarden);
finalButton.addEventListener("click", revealSecret);
petalButton.addEventListener("click", function () {
  rainPetals(24);
});
