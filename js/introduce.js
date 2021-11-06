let popup = document.createElement('div');
popup.className = "popup background";

let popupHeader = document.createElement('div');
popupHeader.className = "popup-header";
popupHeader.textContent = "Внимание!";

let popupMain = document.createElement('div');
popupMain.className = "popup-main";
popupMain.innerText = "Маринетт срочно нужно спасти город от акуматизации! \n Помоги ей, избегая акум, найти Тикки и спасти Париж! \n Передвижение: мышь, стрелки на клавиатуре. \n Финиш: Эйфелевая Башня"


let popupFooter = document.createElement('div');
popupFooter.className = "popup-footer";

let popupButton = document.createElement('button');
popupButton.type = 'submit';
popupButton.textContent = 'Играть';
popupButton.className = "popup-footer__button";
popupButton.addEventListener('click', () => {
    let parent = document.body;
    parent.removeChild(popup);
    document.body.style = 'overflow-y: scroll';
})


popup.appendChild(popupHeader);
popup.appendChild(popupMain);
popup.appendChild(popupFooter);
popupFooter.appendChild(popupButton)

function createPopup() {
    let parent = document.body;
    let reference = document.querySelector('.background');
    parent.insertBefore(popup, reference);
    document.body.style = 'overflow: hidden';
}

window.onload = function () {
    createPopup();
}