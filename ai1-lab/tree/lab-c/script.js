let targetListenersAttached = false;

let map = L.map('map').setView([53.430127, 14.564802], 17);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolokalizacja nie jest dostępna.");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude.toFixed(6);
    const lon = position.coords.longitude.toFixed(6);

    document.getElementById("latitude").innerText = lat;
    document.getElementById("longitude").innerText = lon;

    map.setView([lat, lon], 17);
  }, () => {
    alert("Nie udało się pobrać lokalizacji.");
  });
}

function captureMap() {
  leafletImage(map, function (err, canvas) {
    if (err) {
      alert("Błąd podczas pobierania mapy.");
      return;
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => {
      resetPuzzle();
      generatePuzzle(img);
      attachTargetListeners();
    };
  });
}

function resetPuzzle() {
  document.getElementById("puzzle-source").innerHTML = "";
  document.getElementById("puzzle-target").innerHTML = "";
}

function generatePuzzle(image) {
  const source = document.getElementById("puzzle-source");
  const target = document.getElementById("puzzle-target");
  const pieceSize = 100;
  const gridSize = 4;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const dropZone = document.createElement("div");
      dropZone.className = "drop-zone";
      dropZone.dataset.x = x;
      dropZone.dataset.y = y;
      target.appendChild(dropZone);
    }
  }

  const pieces = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const piece = document.createElement("div");
      piece.className = "piece";
      piece.style.backgroundImage = `url(${image.src})`;
      piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
      piece.draggable = true;
      piece.dataset.correctX = x;
      piece.dataset.correctY = y;
      pieces.push(piece);
    }
  }

  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(piece => source.appendChild(piece));

  enableDragAndDrop();
}

function enableDragAndDrop() {
  const source = document.getElementById("puzzle-source");
  const target = document.getElementById("puzzle-target");

  document.querySelectorAll(".piece").forEach(piece => {
    piece.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", JSON.stringify({
        bg: piece.style.backgroundImage,
        bgPos: piece.style.backgroundPosition,
        correctX: piece.dataset.correctX,
        correctY: piece.dataset.correctY
      }));
      piece.classList.add("dragging");
    });

    piece.addEventListener("dragend", e => {
      piece.classList.remove("dragging");
    });
  });

  target.querySelectorAll(".drop-zone").forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const dropZone = e.target.closest(".drop-zone");
      if (!dropZone) return;

      const existingPiece = dropZone.firstChild;
      if (existingPiece) {
        existingPiece.remove();  // Usuwamy poprzedni puzzel
      }

      const dragging = document.querySelector(".piece.dragging");
      if (dragging) dragging.remove();

      const piece = document.createElement("div");
      piece.className = "piece";
      piece.style.backgroundImage = data.bg;
      piece.style.backgroundPosition = data.bgPos;
      piece.dataset.correctX = data.correctX;
      piece.dataset.correctY = data.correctY;
      piece.draggable = true;
      dropZone.appendChild(piece);

      piece.addEventListener("click", () => {
        piece.remove();
        source.appendChild(piece);
        enableDragAndDrop();  // Re-aktywacja przeciągania
      });

      const x = parseInt(dropZone.dataset.x);
      const y = parseInt(dropZone.dataset.y);
      if (x === parseInt(data.correctX) && y === parseInt(data.correctY)) {
        piece.dataset.snapped = "true";
      } else {
        piece.dataset.snapped = "false";
      }

      checkWin();
    });
  });
}


function checkWin() {
  const zones = document.querySelectorAll(".drop-zone");
  let correct = 0;
  zones.forEach(zone => {
    const piece = zone.firstChild;
    if (piece && piece.dataset.snapped === "true") correct++;
  });

  if (correct === 16) {
    notifyUser();
  }
}

function notifyUser() {
  if (Notification.permission === "granted") {
    new Notification("🎉 Brawo! Układanka ułożona.");
    alert("🎉 Brawo! Układanka ułożona!");
  } else {
    alert("🎉 Brawo! Układanka ułożona!");
  }
}

Notification.requestPermission();
