const mortgageAmount = $('#amountInput');
const mortgageTerm = $('#termInput');
const mortgageRate = $('#rateInput');
const typeRepayment = $('#mortgage-type-radio');
const typeInterest = $('#interest-type-radio');
const calcButton = $('#calculateButton');
const emptyResults = $('#emptyResults');
const completedResults = $('#completedResults');
const clearButton = $('#clearButton');
const amountError = $('#amountError');
const termError = $('#termError');
const rateError = $('#rateError');
const typeError = $('#typeError');

function calculateMortgage() {
    const totalAmount = Number(mortgageAmount.val());
    const termLength = Number(mortgageTerm.val());
    const termMonths = termLength * 12
    const interestRate = Number(mortgageRate.val());
    const type = typeRepayment.is(':checked') ? 'repayment' : 'interest';
    const repaymentWrapper = $('#repaymentWrapper');
    const interestWrapper = $('#interestWrapper');
    const isValid = checkInputs(totalAmount, termLength, interestRate, type);

    if (!isValid) {
        return;
    } else if (type === 'repayment') {
        let monthlyPayment = calculateMonthlyPayment(totalAmount, termLength, interestRate);
        let totalPayment = monthlyPayment * termMonths;
        repaymentWrapper.css('opacity', '1');
        interestWrapper.css('opacity', '0');
        updateNumber('#monthlyResultsValue', monthlyPayment.toFixed(2));
        updateNumber('#totalResultsValue', totalPayment.toFixed(2));
        emptyResults.css('opacity', '0');
        completedResults.css('opacity', '1');
    } else if (type === 'interest') {
        let monthlyPayment = calculateMonthlyPayment(totalAmount, termLength, interestRate);
        let totalPayment = monthlyPayment * termMonths;
        let totalInterest = totalPayment - totalAmount;
        repaymentWrapper.css('opacity', '0');
        interestWrapper.css('opacity', '1');
        updateNumber('#interestResultsValue', totalInterest.toFixed(2));
        emptyResults.css('opacity', '0');
        completedResults.css('opacity', '1');
    } else {
        console.log('Error');
    }
}

function updateNumber(element, number) {
    $(element).prop('counter', 0).animate({
        counter: number
    }, {
        duration: 500,
        step: function (now) {
            $(this).text(formatNumber(now.toFixed(2)));
        }
    });
}


function formatNumber(num) {
    // Converts the number to a string and uses a regular expression to add commas
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateMonthlyPayment(totalAmount, termLength, interestRate) {
    const monthlyInterest = interestRate / 100 / 12
    const termMonths = termLength * 12
    return totalAmount * monthlyInterest * (Math.pow(1 + monthlyInterest, termMonths)) / (Math.pow(1 + monthlyInterest, termMonths) - 1);
}

function checkInputs(totalAmount, termLength, interestRate, type) {
    let isValid = true;

    // Check for valid totalAmount
    if ((totalAmount <= 0 && mortgageAmount.val().trim() === "") || totalAmount <= 0) {
        amountError.css('height', '1.2rem');
        isValid = false;
    }

    // Check for valid termLength
    if (termLength <= 0 && mortgageTerm.val().trim() === "") {
        termError.css('height', '1.2rem');
        isValid = false;
    }

    // Check for valid interestRate
    if (interestRate <= 0 && mortgageRate.val().trim() === "") {
        rateError.css('height', '1.2rem');
        isValid = false;
    }

    // Check if a radio input is selected
    if (!typeRepayment.is(':checked') && !typeInterest.is(':checked')) {
        typeError.css('height', '1.2rem');
        isValid = false;
    }

    return isValid;
}

function calcButtonAnimation() {
    calcButton.find('p').css('transform', 'scale(1.05)');
    setTimeout(function () {
        calcButton.find('p').removeAttr('style');
    }, 225);
}

function clearFormFields() {
    mortgageAmount.val('');
    $('.amount-bar').addClass('ignore-error');
    mortgageTerm.val('');
    $('.term-bar').addClass('ignore-error');
    mortgageRate.val('');
    $('.rate-bar').addClass('ignore-error');
    typeRepayment.prop('checked', false);
    typeInterest.prop('checked', false);
    amountError.css('height', '0');
    termError.css('height', '0');
    rateError.css('height', '0');
    typeError.css('height', '0');
    completedResults.css('opacity', '0');
    emptyResults.css('opacity', '1');
}

$(document).ready(function () {
    // Event listeners for input fields to reset error heights when corrected
    mortgageAmount.on('input', function () {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            amountError.css('height', '0'); // Reset height to 0 if the field is correctly filled
        }
        $('.amount-bar').removeClass('ignore-error');
    });

    mortgageTerm.on('input', function () {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            termError.css('height', '0'); // Reset height to 0 if the field is correctly filled
        }
        $('.term-bar').removeClass('ignore-error');
    });

    mortgageRate.on('input', function () {
        if (Number($(this).val()) > 0 && $(this).val().trim() !== "") {
            rateError.css('height', '0'); // Reset height to 0 if the field is correctly filled
        }
        $('.rate-bar').removeClass('ignore-error');
    });

    typeRepayment.on('change', function () {
        if ($(this).is(':checked')) {
            typeError.css('height', '0'); // Reset height to 0 if repayment type is selected
        }
    });

    typeInterest.on('change', function () {
        if ($(this).is(':checked')) {
            typeError.css('height', '0'); // Reset height to 0 if interest-only type is selected
        }
    });

    // event listener for calculate button
    calcButton.on('click', function () {
        calcButtonAnimation();
        calculateMortgage();
    });

    // event listener for clear button
    clearButton.on('click', function () {
        clearFormFields();
    });
})
