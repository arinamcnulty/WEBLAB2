document.addEventListener('DOMContentLoaded', init);

function init() {
    const addItemButton = document.querySelector('.add-button');
    const inputField = document.querySelector('.add-item input[type="text"]');

    addItemButton.addEventListener('click', addItem);
    inputField.addEventListener('keypress', handleKeyPress);

    setupItemEventListeners();
    updateStatistics();
}

function updateStatistics() {
    const remainingList = document.querySelector('.summary-items-row.remaining');
    const boughtList = document.querySelector('.summary-items-row.bought');
    remainingList.innerHTML = '';
    boughtList.innerHTML = '';

    const items = document.querySelectorAll('.item-list .flex-container');
    items.forEach(function(item) {
        let itemNameElement = item.querySelector('.item-name, .cookies-text, .item-input');
        let itemName = itemNameElement.tagName === 'INPUT' ? itemNameElement.value.trim() : itemNameElement.textContent.trim();
        const itemQuantity = parseInt(item.querySelector('.numberBox span').textContent);
        const isBought = itemNameElement.classList.contains('bought');

        const summaryItem = document.createElement('div');
        summaryItem.classList.add('summary-item'); 
        summaryItem.innerHTML = `<span>${itemName}</span><span class="badge">${itemQuantity}</span>`;

        if (isBought) {
            boughtList.appendChild(summaryItem);
        } else {
            remainingList.appendChild(summaryItem);
        }
    });
}

function addItem() {
    const inputField = document.querySelector('.add-item input[type="text"]');
    const itemName = inputField.value.trim();
    if (itemName) {
        const itemList = document.querySelector('.item-list');
        const newItem = createItemElement(itemName);
        itemList.appendChild(newItem);
        inputField.value = '';
        inputField.focus();
        updateStatistics();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addItem();
    }
}

function setupItemEventListeners() {
    document.querySelectorAll('.item-name, .cookies-text, .item-input').forEach(function(itemNameSpan) {
        itemNameSpan.addEventListener('click', handleItemClick);
    });

    document.querySelectorAll('.status-button').forEach(function(button) {
        button.addEventListener('click', handleStatusButtonClick);
    });

    document.querySelectorAll('.remove-button').forEach(function(button) {
        button.addEventListener('click', handleRemoveButtonClick);
    });

    document.querySelectorAll('.quantity-button.decrement').forEach(function(button) {
        button.addEventListener('click', handleDecrementButtonClick);
    });

    document.querySelectorAll('.quantity-button.increment').forEach(function(button) {
        button.addEventListener('click', handleIncrementButtonClick);
    });
}

function handleItemClick() {
    if (!this.classList.contains('bought')) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.textContent;
        input.classList.add('item-input');
        this.parentNode.replaceChild(input, this);
        input.focus();

        input.addEventListener('blur', function() {
            this.textContent = input.value;
            input.parentNode.replaceChild(this, input);
            updateStatistics();
        }.bind(this));

        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                this.textContent = input.value;
                input.parentNode.replaceChild(this, input);
                updateStatistics();
            }
        }.bind(this));
    }
}

function handleStatusButtonClick() {
    const itemContainer = this.closest('.flex-container');
    const itemNameSpan = itemContainer.querySelector('.item-name, .cookies-text, .item-input');
    const removeButton = itemContainer.querySelector('.remove-button');
    const decrementButton = itemContainer.querySelector('.quantity-button.decrement');
    const incrementButton = itemContainer.querySelector('.quantity-button.increment');
    
    itemNameSpan.classList.toggle('bought');
    if (itemNameSpan.classList.contains('bought')) {
        itemNameSpan.style.textDecoration = 'line-through';
        removeButton.style.display = 'none';
        decrementButton.style.visibility = 'hidden';
        incrementButton.style.visibility = 'hidden';
        this.textContent = 'Не куплено';
    } else {
        itemNameSpan.style.textDecoration = 'none';
        removeButton.style.display = 'inline-block';
        decrementButton.style.visibility = 'visible';
        incrementButton.style.visibility = 'visible';
        this.textContent = 'Куплено';
        if(itemNameSpan.tagName === 'SPAN') {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = itemNameSpan.textContent;
            input.classList.add('item-input');
            itemNameSpan.parentNode.replaceChild(input, itemNameSpan);
            input.focus();
            input.addEventListener('blur', function() {
                itemNameSpan.textContent = input.value;
                input.parentNode.replaceChild(itemNameSpan, input);
            });
        }
    }
    updateStatistics();
}

function handleRemoveButtonClick() {
    const itemContainer = this.closest('.flex-container');
    itemContainer.remove();
    updateStatistics();
}

function handleDecrementButtonClick() {
    const quantityBox = this.nextElementSibling.querySelector('span');
    let quantity = parseInt(quantityBox.textContent);
    if (quantity > 1) {
        quantity--;
        quantityBox.textContent = quantity;
    }
    toggleDecrementButton(this, quantity);
    updateStatistics();
}

function handleIncrementButtonClick() {
    const quantityBox = this.previousElementSibling.querySelector('span');
    let quantity = parseInt(quantityBox.textContent);
    quantity++;
    quantityBox.textContent = quantity;
    toggleDecrementButton(this.previousElementSibling, quantity);
    updateStatistics();
}

function createItemElement(name) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('flex-container');

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('flex-container_div');

    const itemNameSpan = document.createElement('span');
    itemNameSpan.classList.add('item-name');
    itemNameSpan.textContent = name;

    itemNameSpan.addEventListener('click', handleItemClick);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('twoBtn-count');

    const decrementButton = createButton('-', 'quantity-button', 'decrement', 'Зменшити кількість');
    decrementButton.disabled = true;

    const quantityBox = document.createElement('span');
    quantityBox.classList.add('numberBox', 'colorGray');
    quantityBox.innerHTML = '<span>1</span>';

    const incrementButton = createButton('+', 'quantity-button', 'increment', 'Збільшити кількість');

    decrementButton.addEventListener('click', handleDecrementButtonClick);
    incrementButton.addEventListener('click', handleIncrementButtonClick);

    buttonsDiv.appendChild(decrementButton);
    buttonsDiv.appendChild(quantityBox);
    buttonsDiv.appendChild(incrementButton);

    const statusAndRemoveDiv = document.createElement('div');
    statusAndRemoveDiv.style.display = 'flex';
    statusAndRemoveDiv.style.alignItems = 'center';

    const statusButton = createButton('Куплено', 'status-button', '', 'Помітити як куплене');
    statusButton.addEventListener('click', handleStatusButtonClick);

    const removeButton = createButton('x', 'remove-button', '', 'Видалити товар');
    removeButton.addEventListener('click', handleRemoveButtonClick);

    statusAndRemoveDiv.appendChild(statusButton);
    statusAndRemoveDiv.appendChild(removeButton);

    itemDiv.appendChild(itemNameSpan);
    itemDiv.appendChild(buttonsDiv);
    itemContainer.appendChild(itemDiv);
    itemContainer.appendChild(statusAndRemoveDiv);

    return itemContainer;
}

function createButton(text, className, additionalClass, tooltip) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    if (additionalClass) button.classList.add(additionalClass);
    button.setAttribute('data-tooltip', tooltip);
    return button;
}

function toggleDecrementButton(button, quantity) {
    button.disabled = quantity <= 1;
}
