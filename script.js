function catSays(event) {
  // Remove any existing "meow" text
  const existing = document.getElementById("meow-text");
  if (existing) existing.remove();

  const meow = document.createElement("span");
  meow.id = "meow-text";
  meow.textContent = "meow";
  meow.style.position = "fixed";
  meow.style.left = event.clientX + 12 + "px";
  meow.style.top = event.clientY + 12 + "px";
  meow.style.background = "#ffff00";
  meow.style.color = "#000080";
  meow.style.padding = "2px 8px";
  meow.style.fontWeight = "bold";
  meow.style.pointerEvents = "none";
  meow.style.zIndex = "9999";
  document.body.appendChild(meow);

  setTimeout(() => meow.remove(), 2000);
}
