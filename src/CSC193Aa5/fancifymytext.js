function makeTextBigger() {
    const main_text = document.getElementById("main-text");
    main_text.style.fontSize = "24pt";
}

function mooText() {
    const main_text = document.getElementById("main-text");
    const text = main_text.value;
    const uppercase = text.toUpperCase();

    let out = ""
    for(const sentence of uppercase.split(".")) {
        // ignore trailing whitespace after final "."
        if (sentence.trim().length == 0) {
            continue;
        }

        out += sentence + "-Moo."
    }
    main_text.value = out;
}

function fancy() {
    const main_text = document.getElementById("main-text");
    main_text.style.fontWeight = "bold";
    main_text.style.color = "blue";
    main_text.style.textDecoration = "underline";
}

function boring() {
    const main_text = document.getElementById("main-text");
    main_text.style.fontWeight = "normal";
    main_text.style.color = "black";
    main_text.style.textDecoration = "none";
}