const code = document.querySelector('#code');
const codeElement = document.querySelector('.code');

if (!localStorage._code) {
	localStorage._code = generateCode();
} else {
	generateCode(localStorage._code)
}
const circle = document.querySelector('#circle');
if (circle) {
	let startTime = 0;
	let animationFrame;

	circle.style.animationDelay = `-${localStorage._animationTime || 0}s`;

	circle.addEventListener('animationstart', () => {
		startTime = performance.now();
		updateAnimationTime();
	});

	circle.addEventListener('animationiteration', () => {
		
		localStorage._code = generateCode();
		
		startTime = performance.now();
		startTime = 0;
		codeElement.classList.remove('timeout')
		cancelAnimationFrame(animationFrame);
	});


	function updateAnimationTime() {
		const currentTime = performance.now();
		const elapsedSeconds = ((currentTime - startTime) / 1000).toFixed(2);
		localStorage._animationTime = elapsedSeconds + 2;
		if (elapsedSeconds > 25) {
			codeElement.classList.add('timeout')
		}
		animationFrame = requestAnimationFrame(updateAnimationTime);
	}
}

function generateCode(code) {
	const randomCode = code || Math.floor(Math.random() * 900000 + 100000);
	
	if (codeElement) {
		codeElement.textContent = randomCode;
	}
	return randomCode
}

const changeElement = document.querySelector('#change');
const codeStyle = document.querySelector("#codeStyle");
if (changeElement) {
	let clickTimes = [];

	changeElement.addEventListener('click', () => {
		const now = Date.now();
		clickTimes.push(now);

		clickTimes = clickTimes.filter(time => now - time <= 1000);

		if (clickTimes.length >= 2) {
			code.style.display = 'none'
			codeStyle.parentNode.removeChild(codeStyle);
			clickTimes = []; 
		}
	});
}