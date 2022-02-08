const btn = document.querySelector(".rpn-submit");
const input = document.querySelector("#rpn-data");
const output = document.querySelector(".output");

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

btn.addEventListener("click", () => {
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
});
