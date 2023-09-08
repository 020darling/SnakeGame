const drawsnake = document.getElementById("snake_drawing");

// return a canvas's drawing context
//for draw the snake body
const cotx = drawsnake.getContext("2d");
const block = 20;
const row = drawsnake.height / block;
const column = drawsnake.width / block;

document.querySelector("#clear").onclick = function () {
  localStorage.setItem("highest_mark", 0);
  document.getElementById("highest_mark").innerHTML = "Highest Mark: 0";
};

let snake = []; //The snake's coordinate

snake[0] = {
  x: 60,
  y: 0,
};

snake[1] = {
  x: 40,
  y: 0,
};

snake[2] = {
  x: 20,
  y: 0,
};

snake[3] = {
  x: 0,
  y: 0,
};

//make the point object
class Point {
  constructor() {
    //20 rows and 20 colmuns
    this.x = Math.floor(Math.random() * column) * block;
    this.y = Math.floor(Math.random() * row) * block;
  }

  //make point let snake to eat
  makept() {
    cotx.fillStyle = "#914a03";
    cotx.fillRect(this.x, this.y, block, block);
  }

  //re-generate location when snacke eat the point
  reGenerateLocation() {
    let coversnake = false;
    let re_x;
    let re_y;

    function checkSnakeCover(re_x, re_y) {
      for (let i = 0; i < snake.length; i++) {
        if (re_x == snake[i].x && re_y == snake[i].y) {
          console.warn("檢測到隨機point與snake重叠");
          coversnake = true;
          return;
        } else {
          coversnake = false;
        }
      }
    }

    do {
      re_x = Math.floor(Math.random() * column) * block;
      re_y = Math.floor(Math.random() * row) * block;
      checkSnakeCover(re_x, re_y);
    } while (coversnake);

    this.x = re_x;
    this.y = re_y;
  }
}

let newPoint = new Point();

// change direction of snake
addEventListener("keydown", cd);

function cd(e) {
  if (e.key == "a" && direction != "R") {
    direction = "L";
  } else if (e.key == "d" && direction != "L") {
    direction = "R";
  } else if (e.key == "w" && direction != "D") {
    direction = "U";
  } else if (e.key == "s" && direction != "U") {
    direction = "D";
  }

  //remove listener to prevent user press very fast
  //and turn 180degree
  removeEventListener("keydown", cd);
}

let direction = "R";

let mark = 0;
let highest_mark = 0;
checkHighest();
document.getElementById("nows_mark").innerHTML = "Current Mark: " + mark;
document.getElementById("highest_mark").innerHTML =
  "Highest Mark: " + highest_mark;

function drawsnakeblock() {
  //check snake if head touch the asshole
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(drawer);
      alert("GG YOU LOSS YOUR ASS! GAME OVER!");
      console.warn("游戲已經被結束 - - - ");
      return;
    }
  }

  //cover the background
  cotx.fillStyle = "#a3b231";
  cotx.fillRect(0, 0, drawsnake.width, drawsnake.height);

  //draw new pt
  newPoint.makept();

  //draw the snake
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      cotx.fillStyle = "#6c0475";
    } else {
      cotx.fillStyle = "#1c011f";
    }
    cotx.strokeStyle = "white";

    //put the snake back to the screen when snake touch the border
    if (snake[i].x >= drawsnake.width) {
      snake[i].x = 0;
    }

    if (snake[i].x < 0) {
      snake[i].x = drawsnake.width - block;
    }

    if (snake[i].y >= drawsnake.width) {
      snake[i].y = 0;
    }

    if (snake[i].y < 0) {
      snake[i].y = drawsnake.height - block;
    }

    //the arg of fillrect and strokerect is (x,y,width,height)
    cotx.fillRect(snake[i].x, snake[i].y, block, block);
    cotx.strokeRect(snake[i].x, snake[i].y, block, block);
  }

  //get the coordinate of snake head
  let cdnx = snake[0].x;
  let cdny = snake[0].y;

  //the logical of change snake's direction
  if (direction == "L") {
    cdnx -= block;
  } else if (direction == "U") {
    cdny -= block;
  } else if (direction == "R") {
    cdnx += block;
  } else if (direction == "D") {
    cdny += block;
  }

  let head = {
    x: cdnx,
    y: cdny,
  };

  //check the snake's head have/have not touch the point
  if (snake[0].x == newPoint.x && snake[0].y == newPoint.y) {
    newPoint.reGenerateLocation();
    newPoint.makept();
    mark++;
    setHighest(mark);
    document.getElementById("nows_mark").innerHTML = "Current Mark: " + mark;
  } else {
    snake.pop();
  }

  snake.unshift(head);
  addEventListener("keydown", cd);
}

let drawer = setInterval(drawsnakeblock, 70);

function checkHighest() {
  if (localStorage.getItem("highest_mark") == null) {
    highest_mark = 0;
  } else {
    highest_mark = Number(localStorage.getItem("highest_mark"));
  }
}

function setHighest(n_mark) {
  if (n_mark > highest_mark) {
    localStorage.setItem("highest_mark", n_mark);
  }
}
