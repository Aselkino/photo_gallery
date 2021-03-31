'use strict';
var multiItemSlider = (function () {
  return function (selector, config) {
	var
	  _mainElement = document.querySelector(selector), // основный элемент блока
	  _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
	  _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
	  _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
	  _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
	  _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
	  _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
	  _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
	  _positionLeftItem = 0, // позиция левого активного элемента
	  _transform = 0, // значение транфсофрмации .slider_wrapper
	  _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
	  _items = []; // массив элементов
	// наполнение массива _items
	_sliderItems.forEach(function (item, index) {
	  _items.push({ item: item, position: index, transform: 0 });
	});

	var position = {
	  getMin: 0,
	  getMax: _items.length - 1,
	}

	var _transformItem = function (direction) {
	  if (direction === 'right') {
		if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
		  return;
		}
		if (!_sliderControlLeft.classList.contains('slider__control_show')) {
		  _sliderControlLeft.classList.add('slider__control_show');
		}
		if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
		  _sliderControlRight.classList.remove('slider__control_show');
		}
		_positionLeftItem++;
		_transform -= _step;
	  }
	  if (direction === 'left') {
		if (_positionLeftItem <= position.getMin) {
		  return;
		}
		if (!_sliderControlRight.classList.contains('slider__control_show')) {
		  _sliderControlRight.classList.add('slider__control_show');
		}
		if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
		  _sliderControlLeft.classList.remove('slider__control_show');
		}
		_positionLeftItem--;
		_transform += _step;
	  }
	  _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
	}

	// обработчик события click для кнопок "назад" и "вперед"
	var _controlClick = function (e) {
	  if (e.target.classList.contains('slider__control')) {
		e.preventDefault();
		var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
		_transformItem(direction);
	  }
	};

	var _setUpListeners = function () {
	  // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
	  _sliderControls.forEach(function (item) {
		item.addEventListener('click', _controlClick);
	  });
	}

	// инициализация
	_setUpListeners();

	return {
	  right: function () { // метод right
		_transformItem('right');
	  },
	  left: function () { // метод left
		_transformItem('left');
	  }
	}

  }
}());

var slider = multiItemSlider('.slider')


// init
var maxx = document.body.clientWidth;
var maxy = document.body.clientHeight;
var halfx = maxx / 2;
var halfy = maxy / 2;
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = maxx;
canvas.height = maxy;
var context = canvas.getContext("2d");
var dotCount = 200;
var dots = [];
// create dots
for (var i = 0; i < dotCount; i++) {
  dots.push(new dot());
}

// dots animation
function render() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, maxx, maxy);
  for (var i = 0; i < dotCount; i++) {
    dots[i].draw();
    dots[i].move();
  }
  requestAnimationFrame(render);
}

// dots class
// @constructor
function dot() {
  
  this.rad_x = 2 * Math.random() * halfx + 1;
  this.rad_y = 1.2 * Math.random() * halfy + 1;
  this.alpha = Math.random() * 360 + 1;
  this.speed = Math.random() * 100 < 50 ? 1 : -1;
  this.speed *= 0.1;
  this.size = Math.random() * 5 + 1;
  this.color = Math.floor(Math.random() * 256);
  
}

// drawing dot
dot.prototype.draw = function() {
  
  // calc polar coord to decart
  var dx = halfx + this.rad_x * Math.cos(this.alpha / 180 * Math.PI);
  var dy = halfy + this.rad_y * Math.sin(this.alpha / 180 * Math.PI);
  // set color
  context.fillStyle = "rgb(" + this.color + "," + this.color + "," + this.color + ")";
  // draw dot
  context.fillRect(dx, dy, this.size, this.size);
  
};

// calc new position in polar coord
dot.prototype.move = function() {
  
  this.alpha += this.speed;
  // change color
  if (Math.random() * 100 < 50) {
    this.color += 1;
  } else {
    this.color -= 1;
  }
  
};

// start animation
render();






