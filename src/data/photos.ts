export interface Photo {
  src: string;
  full: string;
  caption: string;
  width: number;
  height: number;
}

const photo = (name: string, caption: string, width: number, height: number): Photo => ({
  src: `/media/images/${name}.jpg`,
  full: `/media/images/${name}.jpg`,
  caption, width, height,
});

/** Rows group related work, preserving each photograph's complete composition. */
export const photoRows: Photo[][] = [
  [
    photo('motorcycle-portrait', 'Motorcycle rider with mountains behind him', 1024, 683),
    photo('studio-portrait-woman', 'Studio portrait of a woman', 1024, 683),
    photo('studio-portrait-man', 'Studio portrait of a man in a blue shirt', 1024, 683),
    photo('tommy-portrait', 'Tommy, studio portrait', 683, 1024),
  ],
  [
    photo('waving-child', 'A smiling child waving to the camera', 1024, 768),
    photo('child-by-vehicle', 'A child standing beside a vehicle', 768, 1024),
    photo('orange-door', 'Two children seated by an orange door', 1024, 768),
  ],
];
