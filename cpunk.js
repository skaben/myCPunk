let gameData = {
	timeOut: 1200, 	// *0.1 сек.
	numRows: 8, 	// Строк в игровом поле.
	numCols: 8,	// Столбцов в игровом поле.
	numChars: 8,	// Сколько символов отображается на поле и объём буфера
	numHacks: 1,  	// Число возможных вариантов хака.
	hacks: [{len: 5, text: 'ОТКЛЮЧЕНИЕ ЛАЗЕРНОЙ СЕТИ'}]
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
	document.location.href = "./cpLose.html";
}

function gameWin () { // Выигрыш
	document.location.href = "./cpWin.html";
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
	let row = 0, col = 0, i = 0;
	const gameChars = genChars(numChars);
	const cellsHash = field.querySelectorAll(`[data-coords]`);
	cellsHash.forEach( function(item) {
		[row, col] = item.getAttribute('data-coords').split(" ");
		tChar = gameChars[getRandomInt(0,numChars-1)];
		item.innerText = tChar;
		gameTable[row][col] = item;
	});
}

function getHack(hackLen, gameTable) {
	let i = 0, flag = 0;
	let col = getRandomInt(0,numCols-1), row = getRandomInt(0,numRows-1);
	let hackStr = "";
	hackStr = gameTable[row][col].innerText;
	for (i=1; i<hackLen; i++) {
		if (flag===0) {
			row1 = (row + getRandomInt(0,numRows-1)) % numRows;
			while (row1==row) {
				row1 = (row + getRandomInt(0,numRows-1)) % numRows;
			} 
			row = row1;
			hackStr += " "+gameTable[row][col].innerText;
			flag = 1;
		} else {
			col1 = (col + getRandomInt(0,numCols-1)) % numCols;
			while (col1==col) {
				col1 = (col + getRandomInt(0,numCols-1)) % numCols;
			} 
			col = col1;
			hackStr += " "+gameTable[row][col].innerText;
			flag = 0;
		}
	}
	hackStr = ((hackStr.split(' ')).reverse()).join(" "); // Перевернули последовательность
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
			gameTable[i][col].classList.add('half_hl');
		}
	} else {
		for(i=0; i<numCols; i++) {
			gameTable[row][i].classList.add('half_hl');
		}
	}
	gameTable[row][col].classList.remove('half_hl');
	gameTable[row][col].classList.add('full_hl');

}

function delHL(row, col, flag) {
	let i = 0;
	if (flag===0) {
		for(i=0; i<numRows; i++) {
			gameTable[i][col].classList.remove('half_hl');
		}
	} else {
		for(i=0; i<numCols; i++) {
			gameTable[row][i].classList.remove('half_hl');
		}
	}
	gameTable[row][col].classList.remove('full_hl');
}

function compareHack() {
	for (let i=0; i<gameData.numHacks; i++) {
		console.log(hackContent[i].textContent);
		if (bfix.textContent.indexOf(hackContent[i].textContent) >=0 ) {
			timeFlag = 0; // Стоп таймер. Выиграли.
			bfix.textContent = `YOU WIN FOR HACK ${i+1}`;
			timer.style.display = "none";
			document.removeEventListener("keydown", onKey);
                        gameWin();
		} else if (bfix.textContent.length/3 >= numChars) {
			gameLose();
		}
	}
}

const numRows = gameData.numRows;
const numCols = gameData.numCols;
const numChars = gameData.numChars;

let timeFlag = 0;

let colFlag = 0; // При 0 выбираем столбец, при 1 - строку.

let curRow = numRows-1, curCol = 0;

let timeOut = gameData.timeOut;
const field = document.getElementById('interface_field');
render();
const timer = document.getElementById('timer');
const hacks = document.getElementById('hacks');
const bfix = document.getElementById('bfix');
const buffer = document.getElementById('buffer');

const gameTable = [...Array(numRows)].map(e => Array(numCols));

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
					gameLose(); // Проиграли!
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
		bfix.textContent += gameTable[curRow][curCol].innerText + " ";
		gameTable[curRow][curCol].innerText = '';
		compareHack();
		// console.log("Enter");
	}	
}

function template() {
	txtField = '<div class="cp_table">\n';
	for (i = numRows - 1; i >= 0; i--) {
		txtField += '<div class="cp_row">\n';
		for (j = 0; j < numCols; j++) {
			txtField += `<div class="cp_cell" data-coords="${i} ${j}"></div>\n`
		}
		txtField += '</div>\n';
	}
	txtField += '</div>\n<div class="cp_table cp_table-inf" id="hacks"></div>\n';
	return txtField;
}

function render() {
	field.innerHTML = template();
}	
