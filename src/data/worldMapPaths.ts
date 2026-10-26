/**
 * Simplified world continent vectors projected for 1000x500 SVG canvas.
 * Clean, modern editorial cartography styling.
 */

export interface LandmassPolygon {
  name: string;
  path: string;
}

export const CONTINENT_PATHS: LandmassPolygon[] = [
  // North America
  {
    name: 'North America',
    path: `M 150 70 
           L 180 65 L 230 75 L 260 85 L 280 120 L 265 140 L 290 180 L 250 200 L 240 240 
           L 210 270 L 195 250 L 160 210 L 130 180 L 120 140 L 140 100 Z`,
  },
  // Greenland
  {
    name: 'Greenland',
    path: `M 320 40 L 370 45 L 360 80 L 330 95 L 310 70 Z`,
  },
  // South America
  {
    name: 'South America',
    path: `M 230 270 L 270 275 L 310 300 L 330 340 L 310 390 L 280 430 L 260 450 L 250 410 L 240 350 L 225 310 Z`,
  },
  // Europe
  {
    name: 'Europe',
    path: `M 450 120 L 490 100 L 530 105 L 540 135 L 510 160 L 485 175 L 460 165 L 440 145 Z`,
  },
  // British Isles & Ireland
  {
    name: 'United Kingdom',
    path: `M 445 115 L 460 110 L 455 130 L 440 135 Z`,
  },
  // Scandinavia
  {
    name: 'Scandinavia',
    path: `M 490 60 L 520 65 L 530 110 L 500 115 L 480 85 Z`,
  },
  // Iceland
  {
    name: 'Iceland',
    path: `M 425 75 L 445 75 L 440 90 L 420 88 Z`,
  },
  // Africa
  {
    name: 'Africa',
    path: `M 460 185 L 520 180 L 565 220 L 555 280 L 530 330 L 500 370 L 475 350 L 455 280 L 435 230 L 440 195 Z`,
  },
  // Madagascar
  {
    name: 'Madagascar',
    path: `M 565 315 L 575 320 L 570 350 L 560 345 Z`,
  },
  // Asia
  {
    name: 'Asia',
    path: `M 545 105 L 620 90 L 730 85 L 820 95 L 840 130 L 800 170 L 760 185 L 750 230 L 700 240 L 670 215 L 610 210 L 580 180 L 545 145 Z`,
  },
  // Indian Subcontinent
  {
    name: 'India',
    path: `M 650 200 L 685 210 L 675 260 L 655 240 Z`,
  },
  // Japan
  {
    name: 'Japan',
    path: `M 845 145 L 860 155 L 845 185 L 835 175 Z`,
  },
  // Southeast Asia & Indonesia
  {
    name: 'Southeast Asia',
    path: `M 720 220 L 745 235 L 735 270 L 715 255 Z`,
  },
  {
    name: 'Indonesia Archipelagos',
    path: `M 740 285 L 800 290 L 810 305 L 750 300 Z`,
  },
  // Australia
  {
    name: 'Australia',
    path: `M 800 335 L 860 330 L 880 370 L 850 410 L 800 400 L 780 365 Z`,
  },
  // New Zealand
  {
    name: 'New Zealand',
    path: `M 900 395 L 915 405 L 905 435 L 890 425 Z`,
  },
];
