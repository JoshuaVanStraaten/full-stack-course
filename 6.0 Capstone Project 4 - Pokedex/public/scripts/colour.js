const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
};

// Wait for DOM content to load and determine the colour to use
// based on the Pokemon type selected.
document.addEventListener("DOMContentLoaded", () => {
  const typeDiv = document.querySelector(".type-text");
  const card = document.querySelector(".card");
  if (typeDiv) {
    const typeName = typeDiv.textContent.trim().toLowerCase();
    const color = typeColor[typeName];
    if (color) {
      typeDiv.style.backgroundColor = color;
    }
  }

  if (card) {
    const typeName = typeDiv.textContent.trim().toLowerCase();
    const color = typeColor[typeName];
    if (color) {
      card.style.background = `radial-gradient(circle at 50% 0%, ${color} 38%, #ffffff 44%)`;
    }
  }
});
