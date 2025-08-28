const fs = require("fs");

function decodeValue(value, base) {
  return BigInt(parseInt(value, base));
}


function solvePolynomial(x, y, k) {
  const n = k;
  let A = Array.from({ length: n }, () => Array(n).fill(0));
  let b = Array(n).fill(0);

  
  for (let i = 0; i < n; i++) {
    let xi = 1n;
    for (let j = 0; j < n; j++) {
      A[i][j] = BigInt(x[i]) ** BigInt(j);
    }
    b[i] = y[i];
  }


  let A_num = A.map(row => row.map(Number));
  let b_num = b.map(Number);

  
  for (let i = 0; i < n; i++) {
    
    let diag = A_num[i][i];
    for (let j = 0; j < n; j++) A_num[i][j] /= diag;
    b_num[i] /= diag;

   
    for (let k2 = i + 1; k2 < n; k2++) {
      let factor = A_num[k2][i];
      for (let j = 0; j < n; j++) {
        A_num[k2][j] -= factor * A_num[i][j];
      }
      b_num[k2] -= factor * b_num[i];
    }
  }

  /
  let coeff = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    coeff[i] = b_num[i];
    for (let j = i + 1; j < n; j++) {
      coeff[i] -= A_num[i][j] * coeff[j];
    }
  }

  return coeff;
}


function main() {
  const data = fs.readFileSync("input.json", "utf-8");
  const obj = JSON.parse(data);

  const n = obj.keys.n;
  const k = obj.keys.k;

  let x = [];
  let y = [];

  let idx = 0;
  for (let key of Object.keys(obj)) {
    if (key === "keys") continue;
    if (idx >= k) break;

    let xi = parseInt(key);
    let base = parseInt(obj[key].base);
    let val = obj[key].value;

    let yi = decodeValue(val, base);

    x.push(xi);
    y.push(yi);
    idx++;
  }

  let coeff = solvePolynomial(x, y, k);

  console.log("Secret (c) =", coeff[0]);
}

main();
