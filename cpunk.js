let gameData = {
	timeOut: 300,
	numHacks: 3, 
	hacks: [{len: 2, text: 'Взлом 1'}, 
			{len: 3, text: 'Взлом 2'},
			{len: 4, text: 'Взлом 3'}]
};

// Полезные вспомогательные функции

function isAlpha(c) {
	return (alphas.indexOf(c) != -1);
}

function isDigit(c) {
	return (digits.indexOf(c) != -1);
}

function isAlphaNum(c) {
	return (isAlpha(c) || isDigit(c));
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function gameLose () { // Проигрыш
	document.location.href = "./ftLose.html";
}

function gameWin () { // Выигрыш
	t_field.onclick = function clickDummy(event) {};
	if (game_data.timeout > 0) {
		clearInterval(timerFunc);	
	}
	document.location.href = "./ftmenu.html";
}

function getCoords (elem) {
	let str_id = elem.id
	let elem_row = str_id.split(" ")[0];
	let elem_col = str_id.split(" ")[1];
	return([elem_row,elem_col]);
}

function genChars(numC) {
	let i = 0, j = 0;
	let gameChars = [];
	let tmpChar = 0;
	let flag = 0;
	while (i < numC) {
		flag = 0;
		tmpChar = getRandomInt(0,255);
		tmpChar = pad(tmpChar.toString(16),2);
		for (j=0; j<i; j++) {
			if (gameChars[j] === tmpChar) {
				flag = 1;
			}
		}
		if (flag != 1) {
			gameChars[i] = tmpChar;
			i++;
		}
	}
	return gameChars;
}

function fullField (numC, numR, chars) {
	let i = 0, j = 0;
	let gameChars = [];
	let gameLocalTable = [];
	
	gameChars = genChars(chars);

	for (i=0; i<numR; i++) {
		gameLocalTable[i] = [];
		for (j=0; j<numC; j++) {
			gameLocalTable[i][j] = {};
			tChar = gameChars[getRandomInt(0,4)];
			gameLocalTable[i][j].char = tChar;
			gameLocalTable[i][j].elem = document.getElementById(`${i} ${j}`);
		}
	}
	return gameLocalTable;
}

function showHacks() {
	let i = 0, j = 0;
	for (i=0; i<gameData.numHacks; i++) {
		hacks.innerHTML += `<div class="cpinf_row" id="Hack_${i}">
			<div class="сpinf_l_cell" id="CharHack_${i}">xx xx xx</div>
			<div class="сpinf_r_cell" id="NameHack_${i}">${gameData.hacks[i].text}</div></div>`
	}
}

const numRows = 5;
const numCols = 5;
const numChars = 5;

let timeOut = gameData.timeOut;
let timer = document.getElementById('timer');
let hacks = document.getElementById('hacks');
let gameTable = fullField(numRows, numCols, numChars);

let curRow = 0, curCol = 0;

for (let i=0; i<numRows; i++) {
	for (let j=0; j<numCols; j++) {
		gameTable[i][j].elem.innerHTML = gameTable[i][j].char;
	}
}

showHacks();

if (timeOut > 0) {
	timerFunc = setInterval(function () {
			let seconds = timeOut%60; // Получаем секунды
			let minutes = timeOut/60%60; // Получаем минуты
			let hour = timeOut/60/60%60; // Получаем часы
			// Условие если время закончилось то...
			if (timeOut <= 0) {
					// Таймер удаляется
					clearInterval(timerFunc);
					gameLose(); // Проиграли!
			} else { // Иначе
					// Создаём строку с выводом времени
					let strSec = pad(parseInt(seconds, 10).toString(), 2);
					let strMin = pad(parseInt(Math.trunc(minutes), 10).toString(), 2);
					let strHour = pad(parseInt(Math.trunc(hour), 10).toString(), 2);
					let strOut = `${strHour}:${strMin}:${strSec}`;
					// Выводим строку в блок для показа таймера
					timer.innerHTML = strOut;
			}
			--timeOut; // Уменьшаем таймер
	}, 1000)
} else {
	timer.style.display = "none";
}

document.addEventListener("keydown", this.onKey);

function onKey(event) {
	if(event.code === 'ArrowDown' || event.code === 'KeyS') {
		gameTable[curRow][curCol].elem.style.border = "none";
		if (curRow > 0) {
			curRow = curRow - 1;
		} else {
			curRow = numRows - 1;
		}
		gameTable[curRow][curCol].elem.style.border = "thick solid #00DD00";
	} else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
		gameTable[curRow][curCol].elem.style.border = "none";
		curRow = (curRow + 1) % numRows;
		gameTable[curRow][curCol].elem.style.border = "thick solid #00DD00";
	} else if (event.code === 'ArrowLeft' || event.code === 'KeyA') { 
		gameTable[curRow][curCol].elem.style.border = "none";
		if (curCol > 0) {
			curCol = curCol - 1;
		} else {
			curCol = numCols - 1;
		}
		gameTable[curRow][curCol].elem.style.border = "thick solid #00DD00";
	} else if (event.code === 'ArrowRight' || event.code === 'KeyD') { 
		gameTable[curRow][curCol].elem.style.border = "none";
		curCol = (curCol + 1) % numCols;
		gameTable[curRow][curCol].elem.style.border = "thick solid #00DD00";
	} else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
		// console.log("Enter");
	}	
}

