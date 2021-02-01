var number = []; // четыре цифры нашего числа
var attempts = 0; // число попыток

generateNumber(); //сгенерировали неповторяющиеся значения массива
alert(number.join(''));//преобразование массива в строку
guessNumber();

function generateNumber(){
	var min = 1;
	var max = 9;
	
	// заполняем массив цифр в числе
	for(var i = 0; i < 4; i++){
		var part = Math.round(Math.random() * (max - min)+min); //5
		
		// первое число всегда уникально
		if(i == 0){
			number[0] = part;
		}
		else{ // пока не сгенерируется уникальное число, генерируем новые случайные числа
			while(number.indexOf(part) != -1){//элемент найден
				part = Math.round(Math.random() * (max - min) + min);
			}
			
			number[i] = part;
		}
	}
}

function guessNumber(){
	var result = prompt("Введите число (-1 - закончить игру)", 0);
	var gameIsRunning = true;//проверка на то, что игра идет
	
	// пока игрок не угадал число
	while(gameIsRunning){
		// выход из игры
		if(parseInt(result) == -1){
			gameIsRunning = false;
		}
		// игрок ввел некорректные данные
		else if(parseInt(result) == 0 || isNaN(parseInt(result))){
			alert("Вы не ввели число");
			// запрашиваем по новой
			result = prompt("Введите число (-1 - закончить игру)", 0);
		}
		// проверяем число
		else{
			var answer = checkNumber(result);//answer[false,1,1]
			if(answer[0]){
				// число угадано
				alert("Поздравляем! Вы угадали число. Кол-во попыток: " + attempts);
				// останавливаем игру
				gameIsRunning = false;
			}
			else{
				// следующий ход
				result = prompt("Быки: " + answer[1] + " Коровы: " + answer[2] + " Введите число (-1 - закончить игру)", 0);
			}
		}
	}
}

function checkNumber(myresult){//1234
    
    
    //"1234".split('') => [1234]
    
    
	// каждая проверка увеличивает кол-во попыток на 1
	attempts++;
	
	// массив результата
	// 0 - общий результат
	// 1 - быки
	// 2 - коровы
	var answer = [false, 0, 0];
	
	// раскладываем число на разряды
	console.log(myresult);
	console.log(number);
	
	/*s = "1, 2, 3, 4";
	mas = s.split(", ")
	*/
	
	
	var ranks = myresult.split("");//массив, полученный из введенного числа
	
	for(var i = 0; i < ranks.length; i++){		
		// если по индексу значения совпадают, то это бык
		if(parseInt(ranks[i]) == number[i]){
			answer[1]++;
		}
		// если число вообще есть в массиве, то это корова
		else if(number.indexOf(parseInt(ranks[i])) != -1){
			answer[2]++;
		}
	}
	
	// если набралось 4 быка, то это победа
	if(answer[1] == 4){
		answer[0] = true;
	}
	
	return answer;
}