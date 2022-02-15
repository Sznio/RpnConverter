const btn = document.querySelector(".rpn-submit");
const input = document.querySelector("#rpn-data");
const output = document.querySelector(".output");

const slideIn = document.querySelector(".slide_in_menu");
const slideInIcon = document.querySelector(".slide_in_menu__icon-menu");

const checkBoxes = document.querySelectorAll("input[type=checkbox]");

let funny_mode = false;
let sound_on_typing = false;

// own functions
const generate = () => {
      const rpnString = input.value;
      let convString = postfixToInfix(rpnString);
      if (!rpnString || !convString) {
            return;
      }
      playFunnySound();
      convString = convString.split("+").join(" + ");
      convString = convString.split("-").join(" - ");
      convString = convString.split("*").join(" * ");
      convString = convString.split("/").join(" / ");
      const outputElem = document.createElement("div");
      outputElem.textContent = `${convString} = ${eval(convString)}`;
      output.innerHTML = "";
      output.appendChild(outputElem);
};

const toggleMenuVisibility = () => {
      const isHidden = slideIn.classList.contains("slide_in_menu--hidden");
      if (isHidden) {
            // We need to show it now.
            slideIn.classList.remove("slide_in_menu--hidden");
            slideInIcon.classList.remove("slide_in_menu__icon-menu--hidden");

            slideIn.classList.add("slide_in_menu--active");
            slideInIcon.classList.add("slide_in_menu__icon-menu--active");
      } else {
            // We need to hide it now.
            slideIn.classList.add("slide_in_menu--hidden");
            slideInIcon.classList.add("slide_in_menu__icon-menu--hidden");

            slideIn.classList.remove("slide_in_menu--active");
            slideInIcon.classList.remove("slide_in_menu__icon-menu--active");
      }
};

const focusInput = () => {
      input.focus();
};

const clearInput = () => {
      input.value = "";
};

const playTypingSound = () => {
      if (sound_on_typing) {
            const audio = new Audio(
                  "https://github.com/Sznio/RpnConverter/blob/main/audio/click.mp3?raw=true"
            );
            audio.volume = 0.5;
            audio.play();
      }
};

const playFunnySound = () => {
      if (funny_mode) {
            const audio = new Audio(
                  "https://github.com/Sznio/RpnConverter/blob/main/audio/vine-boom.mp3?raw=true"
            );

            audio.volume = 0.5;
            audio.play();
      }
};

// keymag
import { KeyMgr, KeyCombo, KeyHelper } from "./KeyMgr/KeyMgr.js";

const genCombo = new KeyCombo(["Tab"], generate);

const clearInputCombo = new KeyCombo(
      [
            KeyHelper.convertKeyCodeToKey("CtrlLeft"),
            KeyHelper.convertKeyCodeToKey("AltLeft"),
      ],
      clearInput
);

const keyMgr = new KeyMgr(document.body, false);

keyMgr.addKeyCombo(genCombo);

keyMgr.addKeyCombo(clearInputCombo);

keyMgr.addOnKeyReleaseEvent("Shift", focusInput);

keyMgr.addOnKeyPressEvent(null, playTypingSound);

const postfixToInfix = (RPN) => {
      let convert = RPN.replace(/\^/g, "**")
            .split(/\s+/g)
            .filter((el) => !/\s+/.test(el) && el !== "");
      let stack = [];
      let result = [];
      let precedence = {
            null: 4,
            "**": 3,
            "/": 2,
            "*": 2,
            "+": 1,
            "-": 1,
      };
      convert.forEach((symbol) => {
            let stra, strb;
            if (!isNaN(parseFloat(symbol)) && isFinite(symbol)) {
                  result.push(symbol);
                  stack.push(null);
            } else if (Object.keys(precedence).includes(symbol)) {
                  let [a, b, opa, opb] = [
                        result.pop(),
                        result.pop(),
                        stack.pop(),
                        stack.pop(),
                  ];
                  if (precedence[opb] < precedence[symbol]) {
                        strb = `(${b})`;
                  } else {
                        strb = `${b}`;
                  }
                  if (
                        precedence[opa] < precedence[symbol] ||
                        (precedence[opa] === precedence[symbol] &&
                              ["/", "-"].includes(symbol))
                  ) {
                        stra = `(${a})`;
                  } else {
                        stra = `${a}`;
                  }
                  result.push(strb + symbol + stra);
                  stack.push(symbol);
            } else throw `${symbol} is not a recognized symbol`;
      });
      if (result.length === 1) return result.pop();
      else throw `${RPN} is not a correct RPN`;
};

btn.addEventListener("click", generate);

slideInIcon.addEventListener("click", toggleMenuVisibility);

checkBoxes.forEach((checkbox) => {
      checkbox.addEventListener("click", (e) => {
            if (e.target.name == "funny-mode") {
                  funny_mode = e.target.checked;

                  if (e.target.value) {
                        playFunnySound();
                  }
            } else if (e.target.name == "typing-sounds") {
                  sound_on_typing = e.target.checked;

                  if (e.target.value) {
                        playTypingSound();
                  }
            }
      });
});

// Make the menu appear as the page loads, with slight delay:
setTimeout(toggleMenuVisibility, 350);
