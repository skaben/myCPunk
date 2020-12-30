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
		tmpChar = getRandomInt(1,255);
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

function fullField (numChars) {
	let row = 0, col = 0;
	const gameChars = genChars(numChars);
	const cellsHash=document.querySelectorAll(`[data-coords]`);
	cellsHash.forEach( function(item) {
		[row, col] = item.getAttribute('data-coords').split(" ");
		tChar = gameChars[getRandomInt(0,4)];
		gameTable[row][col].elem = item;
		gameTable[row][col].char = tChar;
		gameTable[row][col].elem.innerHTML = tChar;
	});
	console.log(gameTable[0]);
}

function getHack(hackLen, gameTable) {
	let i = 0, flag = 0;
	let col = getRandomInt(0,4), row = getRandomInt(0,4);
	let hackStr = "";
	hackStr = gameTable[row][col].char;
	for (i=1; i<hackLen; i++) {
		if (flag===0) {
			row = (row + getRandomInt(0,4)) % numRows;
			hackStr += " "+gameTable[row][col].char;
			flag = 1;
		} else {
			col = (col + getRandomInt(0,4)) % numCols;
			hackStr += " "+gameTable[row][col].char;
			flag = 0;
		}
	}
	return hackStr;
}

function showHacks(gameTable) {
	let i = 0;
	let hackString = "";
	for (i=0; i<gameData.numHacks; i++) {
		hackString = getHack(gameData.hacks[i].len, gameTable);
		hacks.innerHTML += `<div class="cpinf_row" id="Hack_${i}">
			<div class="сpinf_l_cell" id="CharHack_${i}">${hackString}</div>
			<div class="сpinf_r_cell" id="NameHack_${i}">${gameData.hacks[i].text}</div></div>`
	}
}

const numRows = 5;
const numCols = 5;
const numChars = 5;

let timeFlag = 0;

let colFlag = 0; // При 0 выбираем столбец, при 1 - строку.

let curRow = 0, curCol = 0;

let timeOut = gameData.timeOut;
let timer = document.getElementById('timer');
let hacks = document.getElementById('hacks');

const gameTable = [	[{},{},{},{},{}],
					[{},{},{},{},{}],
					[{},{},{},{},{}],
					[{},{},{},{},{}],
					[{},{},{},{},{}],];
fullField(numChars);
console.log(gameTable[0][4].char);
showHacks(gameTable);
document.addEventListener("keydown", onKey);

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
			timeOut -= timeFlag; // Уменьшаем таймер
	}, 1000)
} else {
	timer.style.display = "none";
}

function onKey(event) {
	if(event.code === 'ArrowDown' || event.code === 'KeyS') {
		gameTable[curRow][curCol].elem.classList.remove('full_hl');
		if (curRow > 0) {
			curRow = curRow - 1;
		} else {
			curRow = numRows - 1;
		}
		gameTable[curRow][curCol].elem.classList.add('full_hl');
	} else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
		gameTable[curRow][curCol].elem.classList.remove('full_hl');
		curRow = (curRow + 1) % numRows;
		gameTable[curRow][curCol].elem.classList.add('full_hl');
	} else if (event.code === 'ArrowLeft' || event.code === 'KeyA') { 
		gameTable[curRow][curCol].elem.classList.remove('full_hl');
		if (curCol > 0) {
			curCol = curCol - 1;
		} else {
			curCol = numCols - 1;
		}
		gameTable[curRow][curCol].elem.classList.add('full_hl');
	} else if (event.code === 'ArrowRight' || event.code === 'KeyD') { 
		gameTable[curRow][curCol].elem.classList.remove('full_hl');
		curCol = (curCol + 1) % numCols;
		gameTable[curRow][curCol].elem.classList.add('full_hl');
	} else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
		// console.log("Enter");
	}	
}

