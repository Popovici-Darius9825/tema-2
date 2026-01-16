// =========================
//  ELEMENTE DIN HTML
// =========================
const nameInput = document.getElementById("nameInput");
const estimateBtn = document.getElementById("estimateBtn");
const refreshBtn = document.getElementById("refreshBtn");
const resultsContainer = document.getElementById("resultsContainer");
const resultsBody = document.getElementById("resultsBody");

estimateBtn.addEventListener("click", estimateNationality);
refreshBtn.addEventListener("click", refreshView);

const regionNames = new Intl.DisplayNames(["ro", "en"], { type: "region" });

// =========================
//  MEME RANDOM (din memes.js)
// =========================
function getRandomMeme() {
    return allMemes[Math.floor(Math.random() * allMemes.length)];
}

// =========================
//  FUNCTIA PRINCIPALA
// =========================
async function estimateNationality() {
    const name = nameInput.value.trim();
    resultsContainer.innerHTML = "";
    resultsBody.innerHTML = "";

    if (!name) {
        resultsContainer.innerHTML = `<p class="error-message">Te rog introdu un nume.</p>`;
        return;
    }

    resultsContainer.innerHTML = `<p>Se încarcă rezultatele pentru <strong>${name}</strong>...</p>`;

    try {
        const response = await fetch(`https://api.nationalize.io?name=${encodeURIComponent(name)}`);
        if (!response.ok) throw new Error("API-ul nu a răspuns.");

        const data = await response.json();

        if (!data.country || data.country.length === 0) {
            resultsContainer.innerHTML = `<p>Nu există rezultate pentru <strong>${name}</strong>.</p>`;
            return;
        }

        resultsContainer.innerHTML = `<p>Rezultate pentru <strong>${name}</strong>:</p>`;

        data.country.forEach(item => {
            const tr = document.createElement("tr");

            // Steag
            const flagTd = document.createElement("td");
            const flagImg = document.createElement("img");
            flagImg.src = `https://flagcdn.com/w40/${item.country_id.toLowerCase()}.png`;
            flagImg.className = "flag-icon";
            flagTd.appendChild(flagImg);

            // Nume țară
            const countryNameTd = document.createElement("td");
            countryNameTd.textContent = regionNames.of(item.country_id) || item.country_id;

            // Probabilitate
            const probTd = document.createElement("td");
            probTd.textContent = (item.probability * 100).toFixed(2) + "%";

            // Cod ISO
            const codeTd = document.createElement("td");
            codeTd.textContent = item.country_id;

            // Meme
            const memeTd = document.createElement("td");
            const memeImg = document.createElement("img");
            memeImg.src = getRandomMeme();
            memeImg.style.width = "60px";
            memeImg.style.height = "60px";
            memeImg.style.borderRadius = "8px";
            memeImg.style.cursor = "pointer";

            memeImg.addEventListener("click", () => {
                document.getElementById("modalImage").src = memeImg.src;
                document.getElementById("imageModal").style.display = "block";
            });

            memeTd.appendChild(memeImg);

            tr.appendChild(flagTd);
            tr.appendChild(countryNameTd);
            tr.appendChild(probTd);
            tr.appendChild(codeTd);
            tr.appendChild(memeTd);

            resultsBody.appendChild(tr);
        });

    } catch (error) {
        resultsContainer.innerHTML = `<p>Eroare: ${error.message}</p>`;
    }
}

// =========================
//  REFRESH
// =========================
function refreshView() {
    nameInput.value = "";
    resultsContainer.innerHTML = "";
    resultsBody.innerHTML = "";
}

// =========================
//  MODAL
// =========================
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("imageModal").style.display = "none";
});

document.getElementById("imageModal").addEventListener("click", (event) => {
    if (event.target === document.getElementById("imageModal")) {
        document.getElementById("imageModal").style.display = "none";
    }
});
