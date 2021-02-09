
var imgsArray = {
    "bread": { "name": "Хлеб для тостов", "price": 68.15 }
    , "cheese": { "name": "Сыр", "price": 240.89 }
    , "chicken_carcass_cooled": { "name": "Курица охлажденная", "price": 160.34 }
    , "cooking_oil": { "name": "Масло подсолнечное", "price": 124.98 }
    , "milk": { "name": "Молоко", "price": 83.62 }
};

function window_load() {

    //Заполнение блока изображений предварительного просмотра
    var thumbnails_div = document.getElementById("container-thumbnails");
    //var keys = Object.keys(imgsArray);
    for (var item in imgsArray) {
        var tn = document.createElement("img");
        tn.src = "img_thumbs/" + item.valueOf() + ".jpg";
        tn.alt = item.valueOf();
        tn.className = "container-thumbnails-thumbnail";
        tn.id = item.valueOf();
        tn.addEventListener("click", thumbnail_click);
        thumbnails_div.append(tn);
    }

    //Назначаем обработчик кастомного события
    fullImageContainer.getContainer().addEventListener("img_error_event", function (event) {
        fullImageContainer.showImgIsAbsentMessage(event.detail["imageName"]);
    });

    //Назначение обработчика событий стрелок
    document.getElementById("container-full-image-left").addEventListener("click", arrow_click);
    document.getElementById("container-full-image-right").addEventListener("click", arrow_click);

    //Отображение элемента по умолчанию
    fullImageContainer.showDefaultImage();

    //Назначение обработчика нажатия кнопки Купить
    document.getElementById("container-button-buy-item").addEventListener("click", function (event) {
        cartContainer.addItem(fullImageContainer.getContainerChildId());
    });

}

//Обработчик сбытия клика на thumbnail
function thumbnail_click(event) {
    fullImageContainer.showImage(event.target.id);
}

//Обработчик событий клика стрелок перехода
function arrow_click(event) {
    var moveDirection;
    if (this.id.match(/left$/) != null) {
        moveDirection = -1;
    } else {
        moveDirection = 1;
    }

    var keysArray = Object.keys(imgsArray);

    var currentIndex = keysArray.indexOf(fullImageContainer.getContainerChildId());
    currentIndex += moveDirection;
    if (currentIndex > keysArray.length - 1) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = keysArray.length - 1;
    }
    fullImageContainer.showImage(keysArray[currentIndex]);
}

//Объект методов блока корзины
var cartContainer = {
    containerElement: ''
    , getContainer: function () {
        if (this.containerElement == '') {
            this.containerElement = document.getElementById("container-cart");
        }
        return this.containerElement;
    }
    , addHeader() {
        var header = document.getElementById(this.getContainer().id + "-header");

        if (header == null) {
            var baseRowClassName = this.getContainer().className + "-row";

            var row = document.createElement("div");
            row.classList.add(baseRowClassName);
            row.classList.add(baseRowClassName + "-header");
            row.id = this.getContainer().id + "-header";

            var column;
            column = document.createElement("div");
            column.innerText = "Наименование";
            column.classList.add(baseRowClassName + "-name");
            column.classList.add(baseRowClassName + "-name-header");
            row.append(column);

            column = document.createElement("div");
            column.innerText = "Цена за единицу";
            column.classList.add(baseRowClassName + "-price");
            column.classList.add(baseRowClassName + "-price-header");
            row.append(column);

            column = document.createElement("div");
            column.innerText = "Количество";
            column.classList.add(baseRowClassName + "-quantity");
            column.classList.add(baseRowClassName + "-quantity-header");
            row.append(column);

            this.getContainer().append(row);
        }
    }
    , addItem(itemKey) {
        this.addHeader();

        var row = document.createElement("div");
        row.className = this.getContainer().className + "-row"
        row.id = this.getContainer().id + "-good";

        var column;
        column = document.createElement("div");
        column.innerText = imgsArray[itemKey]["name"];
        column.classList.add(row.className + "-name");
        column.classList.add(row.className + "-name-value");
        row.append(column);

        column = document.createElement("div");
        column.id = row.id + "-price";
        column.innerText = imgsArray[itemKey]["price"];
        column.classList.add(row.className + "-price");
        column.classList.add(row.className + "-price-value");
        row.append(column);

        column = document.createElement("div");
        column.innerText = "1";
        column.classList.add(row.className + "-quantity");
        column.classList.add(row.className + "-quantity-value");
        row.append(column);
        this.getContainer().append(row);
        this.addTotal();
    }
    , addTotal() {
        var total = document.getElementById(this.getContainer().id + "-total");
        if (total != null) total.remove();

        var baseRowClassName = this.getContainer().className + "-row";

        var row = document.createElement("div");
        row.classList.add(baseRowClassName);
        row.classList.add(baseRowClassName + "-footer");
        row.id = this.getContainer().id + "-total";

        var column;
        column = document.createElement("div");
        column.innerText = "Всего";
        column.classList.add(baseRowClassName + "-name");
        column.classList.add(baseRowClassName + "-name-value");
        row.append(column);

        priceColumn = document.createElement("div");
        priceColumn.id = this.getContainer().id + "-total-sum";
        priceColumn.classList.add(baseRowClassName + "-price");
        priceColumn.classList.add(baseRowClassName + "-price-value");
        row.append(priceColumn);
        this.getContainer().append(row);


        var selectorStr = "#" + this.getContainer().id;
        selectorStr += " #" + this.getContainer().id + "-good";
        selectorStr += " #" + this.getContainer().id + "-good-price";

        var goodPrices = this.getContainer().querySelectorAll(selectorStr);

        var totalSum = 0;
        for (var goodPrice of goodPrices) {
            totalSum += parseFloat(goodPrice.innerText);
        }
        priceColumn.innerText = totalSum.toFixed(2);

    }
}

//Объект методов блока полноразмерного изображения
var fullImageContainer = {
    containerElement: ''
    , getContainer: function () {
        if (this.containerElement == '') {
            this.containerElement = document.getElementById("container-full-image-item");
        }
        return this.containerElement;
    }
    , childElementEnum: {
        none: 0
        , image: 1
        , text: 2
        , unknown: 3
    }
    , getContainerChildNode: function () {
        if (this.getContainer().children.length == 0) {
            return null;
        } else {
            return (this.getContainer().children[0]);
        }
    }
    , getContainerChildType: function () {
        if (this.getContainerChildNode() == null) {
            return this.childElementEnum.none;
        } else if (this.getContainerChildNode().tagName.toLowerCase() == "img") {
            return this.childElementEnum.image;
        } else if (this.getContainerChildNode().tagName.toLowerCase() == "span") {
            return this.childElementEnum.text;
        }
        return this.childElementEnum.unknown;
    }
    , getContainerChildId: function () {
        if (this.getContainerChildNode() == null) {
            return imgsArray[0];
        }
        return this.getContainerChildNode().id;
    }
    , showDefaultImage: function () {
        this.showImage(Object.keys(imgsArray)[0]);
    }
    , showImgIsAbsentMessage: function (imageName) {
        if (this.getContainerChildType() != this.childElementEnum.text) {
            this.removeChildNode();
            var textElement = document.createElement("span");
            textElement.innerText = "Изображение отсутствует";
            this.getContainer().append(textElement);
        } else {

        }
        textElement.id = imageName;
    }
    , showImage: function (imageName) {
        var imageElement;
        if (this.getContainerChildType() != this.childElementEnum.image) {
            this.removeChildNode();
            imageElement = document.createElement("img");
            imageElement.className = this.getContainer().className + "-img";
            //Добавляем кастомное событие ошибки изображения в обработчик ошибки элемента
            imageElement.addEventListener('error', TriggerImageErrorEvent);
            this.getContainer().append(imageElement);
        } else {
            imageElement = this.getContainerChildNode();
        }
        imageElement.src = "img_full/" + imageName + ".jpg";
        imageElement.alt = imageName;
        imageElement.id = imageName;
    }
    , removeChildNode: function () {
        if (this.getContainer().children.length > 0) {
            this.getContainer().removeChild(this.getContainerChildNode());
        }
    }
};

//Зажигание кастомного события ошибки загрузки изображения
function TriggerImageErrorEvent(event) {

    //Кастомное событие
    var imgErrorEvent = new CustomEvent("img_error_event", {
        detail: {
            "imageName": event.target.id
        }
    });

    //Зажигаем кастомное событие
    fullImageContainer.getContainer().dispatchEvent(imgErrorEvent);
}