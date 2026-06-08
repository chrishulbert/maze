const width = 32;
const height = 21;

// Directions:
const North = 0;
const East = 1;
const South = 2;
const West = 3;

// The array index is an above direction:
const deltaX = [0, 1, 0, -1];
const deltaY = [-1, 0, 1, 0];

// Not exhaustive, but good enough for randomness:
const directionPermutations = [
    [North, East, South, West],
    [North, East, West, South],
    [North, West, East, South],
    [North, West, South, East],
    [East, North, South, West],
    [East, North, West, South],
    [East, West, North, South],
    [East, West, South, North],
    [South, North, East, West],
    [South, North, West, East],
    [South, West, North, East],
    [South, West, East, North],
    [West, North, East, South],
    [West, North, South, East],
    [West, South, North, East],
    [West, South, East, North],
];

// Returns 0..n-1 inclusive.
function randomInt(n) {
    return Math.floor(Math.random() * n);
}

// Usually chooses the last, but sometimes chooses randomly.
function chooseIndex(length) {
    if (Math.random() < 0.2) {
        return randomInt(length);
    } else {
        return length - 1;
    }
}

function main() {
    // Grid bit values:
    // &1 = right is blocked.
    // &2 = bottom is blocked.
    // &4 = visited.
    const grid = Array(width * height).fill(3);
    const initialCell = [randomInt(width), randomInt(height)];
    const cells = [initialCell];
    while (cells.length > 0) {
        const index = chooseIndex(cells.length);
        const [x, y] = cells[index];
        const directions = directionPermutations[randomInt(directionPermutations.length)];
        // Next, we iterate over a randomized list of directions, looking for an unvisited neighbor.
        let foundNeighbour = false;
        for (const dir of directions) {
            const nx = x + deltaX[dir];
            const ny = y + deltaY[dir];
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && (grid[ny * width + nx] & 4) === 0) {
                // When a valid, unvisited neighbor is located, we carve a passage between the current cell and
                // that neighbor, add the neighbor to the list, set foundNeighbour = true (to indicate that an unvisited
                // neighbor was found), and then break out of the directions loop.
                if (dir === North) {
                    grid[ny * width + nx] &= 5; // Remove the destination cell's bottom wall.
                } else if (dir === East) {
                    grid[y * width + x] &= 6; // Remove the from cell's right wall.
                } else if (dir === South) {
                    grid[y * width + x] &= 5; // Remove the from cell's bottom wall.
                } else { // West.
                    grid[ny * width + nx] &= 6; // Remove the destination cell's right wall.
                }
                grid[ny * width + nx] |= 4; // Mark it as visited.
                cells.push([nx, ny]);
                foundNeighbour = true;
                break
            }
        }
        // If no such neighbor is found, we delete the given cell from the list before continuing.
        if (!foundNeighbour) {
            cells.splice(index, 1);
        }
    }
    
    // Draw it:
    let drawing = '';
    drawing += '█ ';
    for (let x=0; x<width-1; x++) {
        drawing += '██';
    }
    drawing += '█\n';
    for (let y=0; y<height; y++) {
        drawing += '█'; // The leftmost wall is always set.
        for (let x=0; x<width; x++) {
            const cell = grid[y * width + x];
            if ((cell & 1) === 0) { // Right wall is cleared.
                drawing += '  ';
            } else {
                drawing += ' █';
            }
        }
        drawing += '\n';
        if (y===height-1) {
            drawing += '█';
        } else {
            drawing += '█'; // The leftmost wall is always set.
        }
        for (let x=0; x<width; x++) {
            const cell = grid[y * width + x];
            if ((cell & 2) === 0) { // Bottom wall is cleared.
                drawing += ' ';
            } else {
                if (x===width-1 && y===height-1) {
                    drawing += ' ';
                } else {
                    drawing += '█';
                }
            }
            if (x===width-1 && y===height-1) {
                drawing += '█';
            } else {
                drawing += '█';
            }
        }
        drawing += '\n';
    }

    const div = document.getElementById('maze');
    div.textContent = drawing;
}

main();
