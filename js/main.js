const btn = document.querySelector(".rpn-submit");
const input = document.querySelector("#rpn-data");
const output = document.querySelector(".output");

// own functions
const generate = () => {
      const rpnString = input.value;
      let convString = postfixToInfix(rpnString);
      if (!rpnString || !convString) {
            return;
      }
      convString = convString.split("+").join(" + ");
      convString = convString.split("-").join(" - ");
      convString = convString.split("*").join(" * ");
      convString = convString.split("/").join(" / ");
      const outputElem = document.createElement("div");
      outputElem.textContent = `${convString} = ${eval(convString)}`;
      output.innerHTML = "";
      output.appendChild(outputElem);
};

const focusInput = () => {
      input.focus();
};

const clearInput = () => {
      console.log("ASDSADSAD");
      input.value = "";
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

const keyMgr = new KeyMgr(document.body, true);

keyMgr.addKeyCombo(genCombo);

keyMgr.addKeyCombo(clearInputCombo);

keyMgr.addOnKeyReleaseEvent("Shift", focusInput);

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
