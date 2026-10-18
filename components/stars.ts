import * as THREE from "three";

// deterministic star layout so it's the same on every visit
function makeStars(n: number) {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 1.6 - 0.6); // mostly the upper sky
    const r = 9 + rand() * 3;
    return new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
  });
}
export const STAR_COUNT = 46;
export const STARS = makeStars(STAR_COUNT);

/** Random constellation: start anywhere, then hop to the nearest unused star. */
export function randomConstellation(size = 6) {
  const path = [Math.floor(Math.random() * STAR_COUNT)];
  while (path.length < size) {
    const last = STARS[path[path.length - 1]];
    let best = -1, bestD = Infinity;
    STARS.forEach((p, i) => {
      const d = p.distanceTo(last);
      if (!path.includes(i) && d < bestD) { best = i; bestD = d; }
    });
    path.push(best);
  }
  return path;
}
