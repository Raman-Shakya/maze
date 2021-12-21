const row=20, col=20;
const start=[0,0];
const end  =[row-1, col-1];

var moves, grid;

function init() {
    grid  = [];
    moves = [start];
    for (let i=0; i<row; i++) {
        let temp = [];
        for (let j=0; j<col; j++) {
            temp.push(
                {
                    borders: ['rightBorder', 'bottomBorder'],
                    visited: false,
                });
        }
        grid.push(temp);
    }
    makeMaze()
}

function makeGrid () {
    let table = `<table cellspacing=0>`;
    for (let i=0; i<row; i++) {
        table += `<tr>`;
        for (let j=0; j<col; j++) {
            let tempClass = grid[i][j].borders.join` `;
            for (let [a,b] of moves) {
                if (a==i && b==j) tempClass+=' selected';
            }
            table += `<td class='${tempClass}'></td>`;
        }
        table += `</tr>`;
    }
    table += `</table>`;
    return table;
}

function makeMaze(i=start[0], j=start[1], ei=end[0], ej=end[1]) {
    grid[i][j].visited = true;
    if (i==ei && j==ej) return;

    let temp = getNeighbours(i, j);
    for (let [a,b] of shuffle(temp)) {
        if (grid[a][b].visited==false) {
            makeLink(i,j, a,b);
            makeMaze(a, b, ei, ej);
        }
    }
}

function makeLink(i,j, a,b) {
    let rf = b-j,
        bf = a-i;
    if (bf==0)
        (rf==1?grid[i][j]:grid[a][b]).borders[0] = '';
    if (rf==0)
        (bf==1?grid[i][j]:grid[a][b]).borders[1] = '';
}

function shuffle(array) {
    let temp=[];
    while (array.length!=0) {
        let a = parseInt(Math.random()*array.length);
        temp.push(array[a]);
        array.splice(a, 1);
    }
    return temp;
}

function getNeighbours (i, j) {
    let temp = [];
    for (let [a,b] of [[i,j+1], [i+1,j], [i,j-1], [i-1,j]]) {
        if (a>=0 && a<row && b>=0 && b<col) temp.push([a,b]);
    }
    return temp;
}




function solveMaze(i=start[0], j=start[1], ei=end[0], ej=end[1], visited=[]) {
    if (i==ei && j==ej) return [[ei,ej]];
    for ([a,b] of visited)
        if (a==i && b==j) return false;

    let temp = [];
    // if you can go right
    if (grid[i][j].borders[0]=='') {
        temp = solveMaze(i, j+1, ei, ej, [...visited, [i, j]]);
        if (temp) return [[i,j], ...temp];
    }
    // if you can go down
    if (grid[i][j].borders[1]=='') {
        temp = solveMaze(i+1, j, ei, ej, [...visited, [i, j]]);
        if (temp) return [[i,j], ...temp];
    }
    // if you can go left
    if (j>0 && grid[i][j-1].borders[0]=='') {
        temp = solveMaze(i, j-1, ei, ej, [...visited, [i, j]]);
        if (temp) return [[i,j], ...temp];
    }
    // if you can go up
    if (i>0 && grid[i-1][j].borders[1]=='') {
        temp = solveMaze(i-1, j, ei, ej, [...visited, [i, j]]);
        if (temp) return [[i,j], ...temp];
    }

    return false;
}

function Move(a) {
    let [x,y]   = [moves[moves.length-1][0], moves[moves.length-1][1]];
    let [ni,nj] = [x + a[0], y + a[1]];
    if (ni>=0 && ni<row && nj>=0 && nj<col) {
        if (a[1]==1) {
            if (grid[x][y].borders[0]=='')
                moves.push([ni,nj]);
        }
        else if (a[1]==-1) {
            if (grid[ni][nj].borders[0]=='')
                moves.push([ni,nj]);
        }
        else if (a[0]==1) {
            if (grid[x][y].borders[1]=='')
                moves.push([ni,nj]);
        }
        else if (a[0]==-1) {
            if (grid[ni][nj].borders[1]=='')
                moves.push([ni,nj]);
        }

        if (moves.length>2) {
            if (moves[moves.length-3][0]==ni && moves[moves.length-3][1]==nj) {
                moves.pop();
                moves.pop();
            }
        }
    }
}

function draw() {
    document.querySelector('.grid').innerHTML = makeGrid(grid);
}

init();
draw();

document.querySelector('.solve').addEventListener('click', ()=>{
    moves = solveMaze();
    draw();
});

document.querySelector('.new').addEventListener('click', ()=>{
    init();
    draw();
});

window.addEventListener('keydown', (e)=>{
    switch(e.key) {
        case 'ArrowRight':
            Move([0,1]);
            break;
        case 'ArrowLeft':
            Move([0,-1]);
            break;
        case 'ArrowUp':
            Move([-1,0]);
            break;
        case 'ArrowDown':
            Move([1,0]);
            break;
    }
    draw();
});