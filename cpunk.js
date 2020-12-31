let gameData = {
	timeOut: 1200,
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
		hackContent[i] = document.getElementById(`CharHack_${i}`);
	}
}

function setHL(row, col, flag) {
	let i = 0;
	if (flag===0) {
		for(i=0; i<numRows; i++) {
			gameTable[i][col].elem.classList.add('half_hl');
		}
	} else {
		for(i=0; i<numCols; i++) {
			gameTable[row][i].elem.classList.add('half_hl');
		}
	}
	gameTable[row][col].elem.classList.remove('half_hl');
	gameTable[row][col].elem.classList.add('full_hl');

}

function delHL(row, col, flag) {
	let i = 0;
	if (flag===0) {
		for(i=0; i<numRows; i++) {
			gameTable[i][col].elem.classList.remove('half_hl');
		}
	} else {
		for(i=0; i<numCols; i++) {
			gameTable[row][i].elem.classList.remove('half_hl');
		}
	}
	gameTable[row][col].elem.classList.remove('full_hl');
}

function compareHack() {
	for (let i=0; i<gameData.numHacks; i++) {
		console.log(hackContent[i].textContent);
		if (bfix.textContent.indexOf(hackContent[i].textContent) >=0 ) {
			timeFlag = 0; // Стоп таймер. Выиграли.
			bfix.textContent = `YOU WIN FOR HACK ${i+1}`;
			timer.style.display = "none";
			document.removeEventListener("keydown", onKey);
		}
	}
}

const numRows = 5;
const numCols = 5;
const numChars = 5;

let timeFlag = 0;

let colFlag = 0; // При 0 выбираем столбец, при 1 - строку.

let curRow = 4, curCol = 0;

let timeOut = gameData.timeOut;
const timer = document.getElementById('timer');
const hacks = document.getElementById('hacks');
const bfix = document.getElementById('bfix');
const buffer = document.getElementById('buffer');

const gameTable = [	[{},{},{},{},{}],
					[{},{},{},{},{}],
					[{},{},{},{},{}],
					[{},{},{},{},{}],
					[{},{},{},{},{}],];

const hackContent = [];

fullField(numChars);
showHacks(gameTable);
setHL(curRow, curCol, colFlag);
document.addEventListener("keydown", onKey);

if (timeOut > 0) {
	timerFunc = setInterval(function () {
			let decades = timeOut - Math.floor(timeOut/10)*10;
			let seconds = (timeOut/10)%60; // Получаем секунды
			let minutes = (timeOut/10)/60%60; // Получаем минуты
			let hour = (timeOut/10)/60/60%60; // Получаем часы
			// Условие если время закончилось то...
			if (timeOut <= 0) {
					// Таймер удаляется. Проиграли.
					clearInterval(timerFunc);
					timer.style.display = "none";
					bfix.textContent = "YOU LOSE!!!";
					document.removeEventListener("keydown", onKey);
					// gameLose(); // Проиграли!
			} else { // Иначе
					// Создаём строку с выводом времени
					let strDec = pad(parseInt(decades*10, 10).toString(), 2);
					let strSec = pad(parseInt(seconds, 10).toString(), 2);
					let strMin = pad(parseInt(Math.trunc(minutes), 10).toString(), 2);
					let strHour = pad(parseInt(Math.trunc(hour), 10).toString(), 2);
					let strOut = `${strHour}:${strMin}:${strSec}.${strDec}`;
					// Выводим строку в блок для показа таймера
					timer.innerHTML = strOut;
			}
			timeOut -= timeFlag; // Уменьшаем таймер
	}, 100)
} else {
	timer.style.display = "none";
}

function onKey(event) {
	if((event.code === 'ArrowDown' || event.code === 'KeyS') && colFlag === 1) {
		buffer.textContent = '';
		delHL(curRow, curCol, colFlag);
		if (curRow > 0) {
			curRow = curRow - 1;
		} else {
			curRow = numRows - 1;
		}
		setHL(curRow, curCol, colFlag);
		buffer.textContent = gameTable[curRow][curCol].char;
	} else if ((event.code === 'ArrowUp' || event.code === 'KeyW') && colFlag === 1) {
		buffer.textContent = '';
		delHL(curRow, curCol, colFlag);
		curRow = (curRow + 1) % numRows;
		setHL(curRow, curCol, colFlag);
		buffer.textContent = gameTable[curRow][curCol].char;
	} else if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && colFlag === 0) { 
		buffer.textContent = '';
		delHL(curRow, curCol, colFlag);
		if (curCol > 0) {
			curCol = curCol - 1;
		} else {
			curCol = numCols - 1;
		}
		setHL(curRow, curCol, colFlag);
		buffer.textContent = gameTable[curRow][curCol].char;
	} else if ((event.code === 'ArrowRight' || event.code === 'KeyD') && colFlag === 0) { 
		buffer.textContent = '';
		delHL(curRow, curCol, colFlag);
		curCol = (curCol + 1) % numCols;
		setHL(curRow, curCol, colFlag);
		buffer.textContent = gameTable[curRow][curCol].char;
	} else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
		timeFlag = 1; // Запускаем отсчёт с первого выбора!
		delHL(curRow, curCol, colFlag);
		colFlag = (colFlag + 1) % 2;
		setHL(curRow, curCol, colFlag);
		buffer.textContent = '';
		bfix.textContent += gameTable[curRow][curCol].char + " ";
		gameTable[curRow][curCol].char = '';
		gameTable[curRow][curCol].elem.innerHTML = '';
		compareHack();
		// console.log("Enter");
	}	
}

