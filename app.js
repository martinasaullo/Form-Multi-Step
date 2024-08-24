import validator from 'validator';

const config = {
    STEPS: 3,
    STEP_NEXT: 1,
    STEP_PREV: -1,
    currentStep: 1,
    btnNext: document.querySelector("#btn-next"),
    btnPrev: document.querySelector("#btn-prev"),
    indicator: document.querySelectorAll("[data-indicator]"),
    step1: document.querySelector("#step-1"),
    stepMargin: 25,
};

function initApp() {
    const stepHandler = e => {
        e.preventDefault();
        e.stopPropagation();

        // controllo se il click è sul pulsante prev
        if(e.target.dataset.steptype === "prev") {
            return aggiornaForm(config.STEP_PREV);
        }

        // se siamo all'ultimo step invio il form
        if(config.currentStep === config.STEPS) {
            inviaForm();
        }

        // controllo correttezza campi
        if(validaCampi()) {
            aggiornaForm(config.STEP_NEXT);
        }
    };

    config.btnNext.addEventListener('click', stepHandler);
    config.btnPrev.addEventListener('click', stepHandler);
}

function inviaForm() {
    document.querySelector("#form-btn-control").style.display = "none";
    document.querySelector(".step-status.inviato").style.display = "grid";
}

function validaCampi() {
    let result = true;
    getCampi().forEach(formElem => {
        const fieldValue = formElem.value,
              checks = [
                formElem.type === "email" && !validator.isEmail(fieldValue),
                formElem.required && validator.isEmpty(fieldValue)
              ];

        reimpostaClassi(formElem.parentElement, "", "has-error");
        if(checks.includes(true)) {
            reimpostaClassi(formElem.parentElement, "has-error");
            result = false;
        }

        if(formElem.type === "password" && formElem.id === "password") {
            result = checkPassword(formElem, fieldValue);
        } 
    });
    return result;
}

function checkPassword(formElem, fieldValue) {
    const confirm = document.querySelector("#password-confirm").value;
    if(
        !validator.isStrongPassword(fieldValue) || 
        !validator.equals(fieldValue, confirm)
    ) {
        reimpostaClassi(formElem.parentElement, "has-error");
        return false;
    }
    reimpostaClassi(formElem.parentElement, "", "has-error");
    return true;
}

function getCampi() {
    const idStepWrapper = "step-" + config.currentStep,
          selettore = `#${idStepWrapper} :is(input, textarea)`,
          formFields = document.querySelectorAll(selettore);
    
    return formFields;
}

function aggiornaForm(newStep) {
    config.currentStep += newStep;
    console.log(config.currentStep);
    aggiornaPulsanti();
    aggiornaIndicatori();
    aggiornaCampiMostrati();
}

function aggiornaPulsanti() {
    let { STEPS, currentStep, btnNext, btnPrev } = config;
    btnPrev.style.display = currentStep > 1 ? "initial" : "none";
    btnNext.textContent = currentStep === STEPS ? "Invia" : "Successivo";
}

function aggiornaIndicatori() {
    config.indicator.forEach((elem, index) => {
        if(index < config.currentStep - 1) {
            reimpostaClassi(elem, "success", "next", "current");
        } else if(index === config.currentStep - 1) {
            reimpostaClassi(elem, "current", "success", "next");
        } else {
            reimpostaClassi(elem, "next", "success", "current");
        }
    });
}

function reimpostaClassi(elememento, daAggiungere, ...daRimuovere) {
    if(daAggiungere) elememento.classList.add(daAggiungere);
    elememento.classList.remove(...daRimuovere);
}

function aggiornaCampiMostrati() {
    const marginValue = config.stepMargin * (config.currentStep - 1);
    config.step1.style.marginLeft = "-" + marginValue + "%";
}

initApp();